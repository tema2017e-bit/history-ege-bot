import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, Zap, Trophy, AlertCircle, BookOpen, Target, Sparkles, Timer } from 'lucide-react';
import { TopBar } from '../components/ui/TopBar';
import { useStore } from '../store/useStore';
import { eras, historyCards } from '../data/historyDates';

// ─── WebAudio звуки ──────────────────────────────────────────────
const audioCtx = typeof AudioContext !== 'undefined' ? new AudioContext() : null;

function beep(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.15) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function soundCorrect() {
  beep(660, 0.1, 'sine', 0.12);
  setTimeout(() => beep(880, 0.15, 'sine', 0.12), 100);
}
function soundWrong() {
  beep(200, 0.25, 'sawtooth', 0.08);
  setTimeout(() => beep(160, 0.2, 'sawtooth', 0.06), 150);
}
function soundFinish() {
  [0, 100, 200, 300].forEach((d, i) => setTimeout(() => beep([660, 880, 1047, 1320][i], 0.15, 'sine', 0.1), d));
}
function soundFail() {
  beep(300, 0.3, 'sawtooth', 0.08);
  setTimeout(() => beep(200, 0.4, 'sawtooth', 0.06), 250);
}

// ─── Вопрос ──────────────────────────────────────────────────────
interface Question {
  event: string;
  correctYear: string;
  options: string[];
}

const PASS_THRESHOLD = 70;
const QUESTIONS_COUNT = 10;

const DiagnosticPage: React.FC = () => {
  const { eraId } = useParams<{ eraId: string }>();
  const navigate = useNavigate();
  const { submitDiagnosticResult, canAttemptDiagnostic, isEraUnlocked } = useStore();
  const targetEra = eras.find(e => e.id === eraId);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const correctRef = useRef(0);

  useEffect(() => { correctRef.current = correct; }, [correct]);
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const generate = useCallback(() => {
    if (!targetEra) return;
    const cards = historyCards.filter(c => c.era === targetEra.id);
    const picked = cards.sort(() => Math.random() - 0.5).slice(0, Math.min(QUESTIONS_COUNT, cards.length));
    const qs: Question[] = picked.map(c => {
      // Для диапазонов (1700–1721) используем полный период, для одиночных годов — год
      const isRange = c.year.includes('–') || c.year.includes('-');
      const cy = isRange ? c.year : c.year.split(/[–-]/)[0];
      const cn = parseInt(c.year.split(/[–-]/)[0]);
      const wrongs = new Set<string>();
      while (wrongs.size < 3) {
        const offset = Math.floor(Math.random() * 40) - 20;
        const w = String(cn + offset);
        if (w !== cy && !wrongs.has(w) && +w > 500 && +w < 2030) {
          // Для диапазонов подсовываем тоже диапазон или одиночный год
          if (isRange) {
            wrongs.add(w);
          } else {
            wrongs.add(w);
          }
        }
      }
      return { event: c.event, correctYear: cy, options: [cy, ...wrongs].sort(() => Math.random() - 0.5) };
    });
    setQuestions(qs);
    setStartTime(Date.now());
  }, [targetEra]);

  useEffect(() => {
    if (!targetEra) { navigate('/', { replace: true }); return; }
    if (isEraUnlocked(targetEra.id)) { navigate(`/era/${targetEra.id}`, { replace: true }); return; }
    if (!canAttemptDiagnostic(targetEra.id)) { navigate('/', { replace: true }); return; }
    generate();
  }, []);

  const handleAnswer = useCallback((a: string) => {
    if (selected !== null || !questions[index]) return;
    const correctAns = a === questions[index].correctYear;
    setSelected(a);
    setIsCorrect(correctAns);
    if (correctAns) {
      setCorrect(p => p + 1);
      soundCorrect();
    } else {
      soundWrong();
    }

    timerRef.current = setTimeout(() => {
      if (index < questions.length - 1) {
        setIndex(p => p + 1);
        setSelected(null);
        setIsCorrect(null);
      } else {
        const finalCorrect = correctAns ? correctRef.current + 1 : correctRef.current;
        const score = Math.round((finalCorrect / questions.length) * 100);
        submitDiagnosticResult(targetEra!.id, score);
        if (score >= PASS_THRESHOLD) soundFinish(); else soundFail();
        setFinished(true);
      }
    }, 1400);
  }, [selected, questions, index, targetEra, submitDiagnosticResult]);

  // ─── Спиннер загрузки ─────────────────────────────────────────────
  if (!targetEra || !questions.length) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex flex-col items-center justify-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-primary-100 dark:border-primary-900" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin" />
        </div>
        <p className="text-surface-400 dark:text-surface-500 text-sm">Загружаем вопросы…</p>
      </div>
    );
  }

  // ─── ЭКРАН РЕЗУЛЬТАТА ──────────────────────────────────────────
  if (finished) {
    const finalCorrect = correctRef.current;
    const score = Math.round((finalCorrect / questions.length) * 100);
    const passed = score >= PASS_THRESHOLD;
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <TopBar />
        <div className="max-w-lg mx-auto px-4 pb-40">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 text-center">
            {/* Иконка результата */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className={`w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center relative ${
                passed
                  ? 'bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600'
                  : 'bg-gradient-to-br from-error-400 via-error-500 to-error-600'
              }`}
            >
              {passed ? (
                <Trophy className="w-16 h-16 text-white drop-shadow-lg" />
              ) : (
                <AlertCircle className="w-16 h-16 text-white drop-shadow-lg" />
              )}
              <motion.div
                initial={{ scale: 1.5, opacity: 0.5 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute inset-0 rounded-full bg-white/20"
              />
            </motion.div>

            {/* Заголовок */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-2"
            >
              {passed ? 'Диагностика пройдена! 🎉' : 'Нужно подтянуть знания'}
            </motion.h1>

            {/* Процент */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 150 }}
              className={`text-7xl font-black my-4 ${passed ? 'text-primary-500' : 'text-error-500'}`}
            >
              {score}%
            </motion.div>

            {/* Статистика */}
            <div className="flex justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-surface-700 dark:text-surface-200">{finalCorrect}/{questions.length}</div>
                <div className="text-xs text-surface-400 dark:text-surface-500">Правильно</div>
              </div>
              <div className="w-px bg-surface-200 dark:bg-surface-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-surface-700 dark:text-surface-200">{questions.length - finalCorrect}</div>
                <div className="text-xs text-surface-400 dark:text-surface-500">Ошибок</div>
              </div>
              <div className="w-px bg-surface-200 dark:bg-surface-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-surface-700 dark:text-surface-200">{minutes}:{seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-surface-400 dark:text-surface-500">Время</div>
              </div>
            </div>

            <p className="text-surface-400 dark:text-surface-500 text-sm mb-8">
              {passed
                ? `Эпоха «${targetEra.name}» разблокирована! +50 XP`
                : `Нужно набрать ${PASS_THRESHOLD}% для разблокировки`}
            </p>

            {passed ? (
              <Link to={`/era/${targetEra.id}`}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
                <BookOpen className="w-5 h-5" /> К урокам эпохи
              </Link>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIndex(0); setCorrect(0); setSelected(null); setIsCorrect(null);
                    setFinished(false); generate();
                  }}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base"
                >
                  <Zap className="w-5 h-5" /> Попробовать ещё раз
                </button>
                <Link to="/" className="block text-center text-surface-400 dark:text-surface-500 text-sm hover:text-surface-600 dark:hover:text-surface-300 transition-colors py-2">
                  Вернуться на главную
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── ЭКРАН ВОПРОСА ────────────────────────────────────────────
  const q = questions[index];
  const progress = questions.length > 0 ? ((index) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-50 to-white dark:from-surface-900 dark:to-surface-850">
      <TopBar />
      <div className="max-w-lg mx-auto px-4 pb-40">
        {/* Навигация + заголовок */}
        <div className="flex items-center justify-between mt-4 mb-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Выйти</span>
          </button>
          <div className="flex items-center gap-2 text-surface-400 dark:text-surface-500">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">{targetEra.name}</span>
          </div>
        </div>

        {/* Прогресс */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-surface-700 dark:text-surface-200">Вопрос {index + 1}</div>
              <div className="text-xs text-surface-400 dark:text-surface-500">из {questions.length}</div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div key={correct} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
                className="bg-success-50 dark:bg-success-900/30 text-success-600 dark:text-success-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                ✓ {correct}
              </motion.div>
              <div className="bg-error-50 dark:bg-error-900/30 text-error-500 dark:text-error-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                ✗ {index - correct}
              </div>
            </div>
          </div>
          <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Карточка вопроса */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 60, rotateY: 5 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -60, rotateY: -5 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="bg-white dark:bg-surface-800 rounded-3xl shadow-xl shadow-surface-200/50 dark:shadow-black/20 p-6 mb-6 relative overflow-hidden"
          >
            {/* Индикатор правильности (цветная полоса сверху) */}
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: isCorrect === null ? 0 : '100%',
                backgroundColor: isCorrect === true ? '#22c55e' : '#ef4444',
              }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 h-1"
            />

            {/* Бейдж правильности */}
            <AnimatePresence>
              {isCorrect !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute right-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-lg ${
                    isCorrect ? 'bg-success-500 text-white' : 'bg-error-500 text-white'
                  }`}
                >
                  {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  {isCorrect ? 'Верно!' : 'Неверно'}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Вопрос */}
            <div className="mb-6">
              <div className="text-xs text-surface-400 dark:text-surface-500 uppercase tracking-widest font-medium mb-2">В каком году произошло?</div>
              <p className="text-lg md:text-xl font-semibold text-surface-800 dark:text-surface-100 leading-relaxed">{q.event}</p>
            </div>

            {/* Кнопки ответов */}
            <div className="grid grid-cols-2 gap-3">
              {q.options.map(opt => {
                let style = 'bg-white dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-200 hover:border-primary-400 hover:shadow-md hover:-translate-y-0.5 dark:hover:border-primary-500';
                if (selected !== null) {
                  if (opt === selected && opt !== q.correctYear) {
                    // Выбранный неправильный ответ — красный
                    style = 'bg-error-500 text-white border-error-500 shadow-lg shadow-error-200 dark:shadow-error-800/50 scale-[0.96]';
                  } else {
                    // Правильный и все остальные — бледные (замазаны)
                    style = 'bg-surface-50 dark:bg-surface-700 text-surface-300 dark:text-surface-500 border-surface-100 dark:border-surface-600';
                  }
                }

                return (
                  <motion.button
                    key={opt}
                    whileHover={selected === null ? { scale: 1.02 } : {}}
                    whileTap={selected === null ? { scale: 0.97 } : {}}
                    animate={opt === selected && opt !== q.correctYear ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                    transition={{ x: { duration: 0.4 } }}
                    onClick={() => handleAnswer(opt)}
                    disabled={selected !== null}
                    className={`relative h-16 rounded-2xl font-bold text-lg transition-all duration-200 ${style}`}
                  >
                    <span className="relative z-10">{opt}</span>
                    {opt === q.correctYear && selected !== null && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0.4 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 rounded-full bg-white/30"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Подсказка */}
            {selected === null && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-xs text-surface-300 dark:text-surface-600 mt-4"
              >
                Выбери правильный год
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Мини-навигация по вопросам */}
        <div className="flex justify-center gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === index ? 'bg-primary-500 scale-125' : i < index ? 'bg-primary-200 dark:bg-primary-700' : 'bg-surface-200 dark:bg-surface-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage;