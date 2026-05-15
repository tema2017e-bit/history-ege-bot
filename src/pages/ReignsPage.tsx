import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Crown, Trophy, Zap, Target, RefreshCw, Star, AlertTriangle, ChevronRight, Sparkles, Lock } from 'lucide-react';
import { useStore, FREE_ERAS_COUNT } from '../store/useStore';
import { reignClusters, getRulersInCluster, rulers, ReignCluster, Ruler } from '../data/reigns';
import { generateReignQuestions } from '../utils/reignQuestionGenerator';
import { checkTextAnswer, isTextQuestion, normalizeYearAnswer } from '../utils/answerNormalizer';
import { soundManager } from '../utils/sounds';
import { Question } from '../types';
import { LessonHeader, AnswerOptions, InputTask, TrueFalseTask, FeedbackBar } from '../components/ui/LessonComponents';

const ReignsPage: React.FC = () => {
  const navigate = useNavigate();
  const { completeReignTest, completedReignTests, reignMastery, xp, answerQuestion, confusedReignPairs, subscription, tgUser } = useStore();

  // Отладка
  console.log('ReignsPage render:', { subscription, tgUser: tgUser?.id, reignClusters: reignClusters.length });

  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const cluster = selectedCluster ? reignClusters.find(c => c.id === selectedCluster) : null;
  const clusterRulers = selectedCluster ? getRulersInCluster(selectedCluster) : [];
  const isCompleted = selectedCluster ? completedReignTests.includes(`reign-${selectedCluster}`) : false;
  const mastery = selectedCluster ? (reignMastery[selectedCluster] || 0) : 0;

  // Находим путаемые пары для этого кластера
  const confusedRulerIds = React.useMemo(() => {
    if (!selectedCluster || confusedReignPairs.length === 0) return [];
    const clusterRulerIds = reignClusters.find(c => c.id === selectedCluster)?.rulerIds || [];
    const result: string[] = [];
    for (const pairStr of confusedReignPairs) {
      const [a, b] = pairStr.split('|');
      if (clusterRulerIds.includes(a) && clusterRulerIds.includes(b)) {
        result.push(a, b);
      }
    }
    return [...new Set(result)];
  }, [selectedCluster, confusedReignPairs]);

  const startTest = () => {
    if (clusterRulers.length === 0) return;
    const qs = generateReignQuestions(selectedCluster!, Math.max(6, Math.min(clusterRulers.length * 2, 12)), confusedRulerIds);
    if (qs.length === 0) return;
    setQuestions(qs);
    setIsTesting(true);
    setShowTimeline(false);
    setCurrentIndex(0);
    setCorrectCount(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsComplete(false);
  };

  const handleAnswer = useCallback((answer: string) => {
    if (showResult || !questions[currentIndex]) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const q = questions[currentIndex];
    let correct: boolean;
    if (isTextQuestion(q.type)) {
      correct = checkTextAnswer(answer, q.correctAnswer as string, q.acceptableAnswers, q.aliases);
    } else if (q.type === 'input-year' || q.type === 'fill-blank') {
      const userYear = normalizeYearAnswer(answer);
      const correctYear = normalizeYearAnswer(q.correctAnswer as string);
      correct = userYear === correctYear;
    } else {
      correct = answer === q.correctAnswer;
    }
    
    setIsCorrect(correct);
    if (correct) {
      soundManager.correct();
      setCorrectCount(prev => prev + 1);
    } else {
      soundManager.incorrect();
    }
    answerQuestion(correct, questions[currentIndex].cardId, true);
  }, [showResult, questions, currentIndex, answerQuestion]);

  const handleContinue = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      if (selectedCluster) {
        completeReignTest(selectedCluster, correctCount, questions.length);
      }
      soundManager.lessonComplete();
      setIsComplete(true);
    }
  }, [currentIndex, questions.length, correctCount, selectedCluster, completeReignTest]);

  const currentQuestion = questions[currentIndex];

  // === РЕЗУЛЬТАТ ===
  if (isComplete) {
    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const xpEarned = correctCount * 8;
    const isPerfect = accuracy === 100;

    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card max-w-md w-full text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ${isPerfect ? 'bg-gradient-to-br from-gold-400 to-gold-600 shadow-gold-500/30' : accuracy >= 70 ? 'bg-gradient-to-br from-primary-400 to-primary-600 shadow-primary-500/30' : 'bg-surface-200 dark:bg-surface-700 shadow-surface-300/30 dark:shadow-black/20'}`}>
            {isPerfect ? <Crown className="w-10 h-10 text-white" /> : accuracy >= 70 ? <Trophy className="w-10 h-10 text-white" /> : <Target className="w-10 h-10 text-surface-500 dark:text-surface-400" />}
          </motion.div>
          <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-2">
            {isPerfect ? 'Безупречно! 👑' : accuracy >= 70 ? 'Отличный результат!' : 'Нужно подтянуть'}
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mb-6">{cluster?.name} — {accuracy >= 70 ? 'ты хорошо различаешь правителей!' : 'повтори ленту и попробуй снова.'}</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gold-50 dark:bg-gold-900/30 rounded-xl p-3">
              <div className="text-xl font-bold text-gold-600 dark:text-gold-400">{xpEarned}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400">XP</div>
            </div>
            <div className="bg-surface-100 dark:bg-surface-700 rounded-xl p-3">
              <div className="text-xl font-bold text-surface-700 dark:text-surface-200">{accuracy}%</div>
              <div className="text-xs text-surface-500 dark:text-surface-400">Точность</div>
            </div>
            <div className="bg-primary-50 dark:bg-primary-900/30 rounded-xl p-3">
              <div className="text-xl font-bold text-primary-600 dark:text-primary-400">{correctCount}/{questions.length}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400">Верно</div>
            </div>
          </div>
          {selectedCluster && (
            <div className="bg-surface-100 dark:bg-surface-700 rounded-xl p-3 mb-4">
              <div className="text-sm font-medium text-surface-600 dark:text-surface-300">Mastery: {Math.max(mastery, accuracy)}%</div>
              <div className="progress-bar mt-1.5">
                <div className="progress-bar-fill" style={{ width: `${Math.max(mastery, accuracy)}%`, backgroundColor: cluster?.color || '#22c55e' }} />
              </div>
            </div>
          )}
          <button onClick={() => { setIsTesting(false); setSelectedCluster(null); setIsComplete(false); setShowTimeline(false); }} className="btn-primary w-full">К списку блоков</button>
          <button onClick={() => navigate('/')} className="btn-secondary w-full mt-2">На главную</button>
        </motion.div>
      </div>
    );
  }

  // === ТЕСТИРОВАНИЕ ===
  if (isTesting && currentQuestion) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <LessonHeader current={currentIndex + 1} total={questions.length} hearts={5} onClose={() => { setIsTesting(false); }} />
        <div className="max-w-lg mx-auto px-4 py-6 pb-40">
          <div className="mb-3">
            <span className="badge badge-warning">👑 {cluster?.name}</span>
          </div>
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card">
            <h2 className="text-lg font-bold text-surface-800 dark:text-surface-100 mb-6 whitespace-pre-line leading-relaxed">{currentQuestion.prompt}</h2>
            {currentQuestion.type === 'select-date' || currentQuestion.type === 'select-event' || currentQuestion.type === 'odd-one-out' ? (
              <AnswerOptions options={currentQuestion.options || []} onSelect={handleAnswer} selectedAnswer={selectedAnswer} correctAnswer={currentQuestion.correctAnswer as string} showResult={showResult} disabled={false} />
            ) : currentQuestion.type === 'true-false' ? (
              <TrueFalseTask onSelect={handleAnswer} showResult={showResult} disabled={false} correctAnswer={currentQuestion.correctAnswer as string} selectedAnswer={selectedAnswer} />
            ) : (
              <InputTask onSubmit={handleAnswer} correctAnswer={currentQuestion.correctAnswer as string} showResult={showResult} disabled={false} inputMode={currentQuestion.inputMode || 'year'} />
            )}
          </motion.div>
          {showResult && <FeedbackBar correct={isCorrect} explanation={currentQuestion.explanation} onContinue={handleContinue} />}
        </div>
      </div>
    );
  }

  // === ТАЙМЛАЙН КЛАСТЕРА ===
  if (showTimeline && cluster) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <div className="max-w-lg mx-auto px-4 pb-40">
          <button onClick={() => setShowTimeline(false)} className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 mb-6 mt-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Назад к {cluster.name}</span>
          </button>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <h1 className="text-xl font-bold text-surface-800 dark:text-surface-100">{cluster.name}</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400">{cluster.yearRange} — {cluster.subtitle}</p>
          </motion.div>

          {/* Timeline */}
          <div className="relative space-y-0">
            {clusterRulers.map((ruler, i) => (
              <motion.div key={ruler.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="flex gap-3">
                {/* Vertical line */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full flex-shrink-0 mt-4" style={{ backgroundColor: cluster.color }} />
                  {i < clusterRulers.length - 1 && <div className="w-0.5 flex-1 bg-surface-200 dark:bg-surface-700" />}
                </div>
                {/* Card */}
                <div className="flex-1 pb-4">
                  <div className="bg-white dark:bg-surface-800 rounded-xl p-3 border border-surface-100 dark:border-surface-700">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-surface-800 dark:text-surface-100 text-sm">{ruler.name}</span>
                      <span className="text-xs text-surface-400 dark:text-surface-500 tabular-nums font-mono">{ruler.startYear}–{ruler.endYear || '…'}</span>
                    </div>
                    {ruler.keyEvents.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {ruler.keyEvents.map((ev, j) => (
                          <span key={j} className="text-[10px] bg-surface-50 dark:bg-surface-700 text-surface-500 dark:text-surface-400 px-1.5 py-0.5 rounded border border-surface-100 dark:border-surface-600">{ev}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            onClick={startTest} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            {isCompleted ? `Пройти снова (лучший: ${mastery}%)` : 'Проверить знания'}
          </motion.button>
        </div>
      </div>
    );
  }

  // === ДЕТАЛИ КЛАСТЕРА (выбранный блок) ===
  if (selectedCluster && cluster) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <div className="max-w-lg mx-auto px-4 pb-40">
          <button onClick={() => { setSelectedCluster(null); setShowTimeline(false); }} className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 mb-6 mt-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl" style={{ backgroundColor: `${cluster.color}15` }}>
              {cluster.icon}
            </div>
            <h1 className="text-xl font-bold text-surface-800 dark:text-surface-100">{cluster.name}</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{cluster.subtitle}</p>
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">{clusterRulers.length} правителей • {cluster.yearRange}</p>
          </motion.div>

          {/* Мини-превью правителей */}
          <div className="space-y-2 mb-6">
            {clusterRulers.map((ruler, i) => (
              <motion.div key={ruler.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-surface-800 rounded-lg px-3 py-2 border border-surface-100 dark:border-surface-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cluster.color }} />
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-200">{ruler.name}</span>
                </div>
                <span className="text-xs text-surface-400 dark:text-surface-500 tabular-nums font-mono">{ruler.startYear}–{ruler.endYear || '…'}</span>
              </motion.div>
            ))}
          </div>

          {/* Кнопки */}
          <button onClick={() => setShowTimeline(true)} className="btn-secondary w-full mb-3 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Ознакомиться с лентой
          </button>
          <button onClick={startTest} className="btn-primary w-full flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            {isCompleted ? `Пройти снова (лучший: ${mastery}%)` : 'Начать тест'}
          </button>
          <p className="text-center text-xs text-surface-400 dark:text-surface-500 mt-3">
            {Math.max(6, Math.min(clusterRulers.length * 2, 12))} заданий • ~{Math.max(6, Math.min(clusterRulers.length * 2, 12)) * 8} XP • Не просто помни дату — понимай, кто правил
          </p>

          {/* Часто путаемые пары */}
          {confusedRulerIds.length > 0 && (
            <div className="mt-6 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-error-500" />
                <span className="text-sm font-semibold text-error-700 dark:text-error-300">Путаешь чаще всего</span>
              </div>
              <div className="space-y-1.5">
                {confusedReignPairs.filter(pairStr => {
                  const [a, b] = pairStr.split('|');
                  return confusedRulerIds.includes(a);
                }).slice(0, 3).map(pairStr => {
                  const [a, b] = pairStr.split('|');
                  const rA = rulers[a];
                  const rB = rulers[b];
                  if (!rA || !rB) return null;
                  return (
                    <div key={pairStr} className="flex items-center justify-between text-xs text-error-600 dark:text-error-400">
                      <span>{rA.name} ({rA.startYear}–{rA.endYear || '…'})</span>
                      <span className="mx-1 text-error-300 dark:text-error-500">↔</span>
                      <span>{rB.name} ({rB.startYear}–{rB.endYear || '…'})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // === СПИСОК КЛАСТЕРОВ ===

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <div className="max-w-lg mx-auto px-4 pb-40">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 mb-6 mt-4">
          <ArrowLeft className="w-4 h-4" />
          <span>На главную</span>
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-3 shadow-xl shadow-gold-500/25">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100">Лента правлений</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Свяжи правителей, даты и эпохи</p>
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">Не путай соседние правления — ключ к высоким баллам</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white dark:bg-surface-800 rounded-xl p-3 text-center border border-surface-100 dark:border-surface-700">
            <Crown className="w-5 h-5 text-gold-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-surface-700 dark:text-surface-200">{completedReignTests.length}/{reignClusters.length}</div>
            <div className="text-[10px] text-surface-400 dark:text-surface-500">Блоков пройдено</div>
          </div>
          <div className="bg-white dark:bg-surface-800 rounded-xl p-3 text-center border border-surface-100 dark:border-surface-700">
            <Target className="w-5 h-5 text-primary-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-surface-700 dark:text-surface-200">{Object.values(rulers).length}</div>
            <div className="text-[10px] text-surface-400 dark:text-surface-500">Правителей</div>
          </div>
          <div className="bg-white dark:bg-surface-800 rounded-xl p-3 text-center border border-surface-100 dark:border-surface-700">
            <Star className="w-5 h-5 text-primary-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-surface-700 dark:text-surface-200">{xp}</div>
            <div className="text-[10px] text-surface-400 dark:text-surface-500">XP</div>
          </div>
        </motion.div>

        {/* Кластеры */}
        <div className="space-y-3">
          {reignClusters.map((cl, index) => {
            const clRulers = getRulersInCluster(cl.id);
            const isDone = completedReignTests.includes(`reign-${cl.id}`);
            const clMastery = reignMastery[cl.id] || 0;
            // С подпиской все кластеры доступны, без подписки — только первые 4
            const isLocked = !subscription && index >= FREE_ERAS_COUNT - 1;

            if (isLocked) {
              return (
                <div key={cl.id} className="block w-full bg-white dark:bg-surface-800 rounded-xl p-4 border border-gold-200 dark:border-gold-800/30 opacity-60 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-surface-200 dark:bg-surface-700">
                      <Sparkles className="w-5 h-5 text-gold-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-surface-500 dark:text-surface-400 text-sm">{cl.name}</span>
                        <Sparkles className="w-4 h-4 text-gold-500" />
                      </div>
                      <p className="text-xs text-surface-400 dark:text-surface-500">{clRulers.length} правителей • {cl.yearRange}</p>
                      <Link to="/profile" className="mt-2 inline-block">
                        <div className="bg-gold-500 text-white text-xs py-1.5 px-3 flex items-center gap-1 rounded-lg font-medium">
                          <Sparkles className="w-3 h-3" />
                          Оформить подписку
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <motion.button key={cl.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}
                onClick={() => setSelectedCluster(cl.id)}
                className="w-full bg-white dark:bg-surface-800 rounded-xl p-4 border border-surface-100 dark:border-surface-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: `${cl.color}15` }}>
                    {cl.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-surface-700 dark:text-surface-200 text-sm">{cl.name}</span>
                      <div className="flex items-center gap-1">
                        {isDone && <span className="badge badge-warning">{clMastery}%</span>}
                        <ChevronRight className="w-4 h-4 text-surface-300 dark:text-surface-500" />
                      </div>
                    </div>
                    <p className="text-xs text-surface-400 dark:text-surface-500">{clRulers.length} правителей • {cl.yearRange}</p>
                    {isDone && (
                      <div className="progress-bar mt-1.5">
                        <div className="progress-bar-fill" style={{ width: `${clMastery}%`, backgroundColor: cl.color }} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReignsPage;