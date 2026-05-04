import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Zap, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { historyCards } from '../data/historyDates';
import { generateQuestions, normalizeQuestion } from '../utils/questionGenerator';
import { soundManager } from '../utils/sounds';
import { Question } from '../types';
import { LessonHeader, AnswerOptions, TrueFalseTask, FeedbackBar } from '../components/ui/LessonComponents';

// Типы вопросов для тренировки: простые, без ввода текста, без drag-and-drop, без сложных механик
const RECOVERY_QUESTION_TYPES = new Set([
  'select-date',
  'select-event',
  'true-false',
  'odd-one-out',
  'who-is',
  'quote-author',
  'define-term',
  'identify-term',
  'select-term-by-era',
]);

/** Собирает список id карточек с наибольшей долей ошибок */
function getWeakestCardIds(
  cardProgress: Record<string, { correctCount: number; incorrectCount: number; mastery: string }>,
  weakCards: string[],
  mistakes: { cardId: string }[],
  maxCount: number = 10
): string[] {
  // Строим статистику из cardProgress
  const stats: Record<string, { correct: number; incorrect: number }> = {};
  for (const [id, p] of Object.entries(cardProgress)) {
    const total = p.correctCount + p.incorrectCount;
    if (total > 0) {
      stats[id] = { correct: p.correctCount, incorrect: p.incorrectCount };
    }
  }

  // Дополняем из mistakes — если карточка есть в ошибках, но не в stats
  for (const m of mistakes) {
    if (!stats[m.cardId]) {
      stats[m.cardId] = { correct: 0, incorrect: 1 };
    }
  }

  // Сортируем по доле ошибок (incorrect / total)
  const sorted = Object.entries(stats)
    .filter(([_, s]) => s.correct + s.incorrect >= 2)
    .sort(([_, a], [__, b]) => {
      const rateA = a.incorrect / Math.max(1, a.correct + a.incorrect);
      const rateB = b.incorrect / Math.max(1, b.correct + b.incorrect);
      return rateB - rateA; // больше ошибок → выше
    })
    .map(([id]) => id);

  // Объединяем с weakCards, убираем дубли
  const result = [...sorted];
  for (const w of weakCards) {
    if (!result.includes(w)) result.push(w);
  }

  return result.slice(0, maxCount);
}

const HeartRecoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const { hearts, maxHearts, awardHeartFromPractice, answerQuestion, cardProgress, weakCards, mistakes, formatHeartTimer } = useStore();

  const [isPractice, setIsPractice] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [heartAwarded, setHeartAwarded] = useState(false);

  // Таймер обновления
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const timerStr = formatHeartTimer();
  const isFull = hearts >= maxHearts;

  // Карточки с наибольшим числом ошибок
  const weakCardIds = useMemo(
    () => getWeakestCardIds(cardProgress, weakCards, mistakes),
    [cardProgress, weakCards, mistakes]
  );

  const startPractice = () => {
    let cardIds: string[];
    if (weakCardIds.length >= 3) {
      cardIds = weakCardIds;
    } else {
      cardIds = historyCards.slice(0, 8).map(c => c.id);
    }

    const rawQs = generateQuestions(cardIds, historyCards, { count: 12 });
    if (rawQs.length === 0) return;

    // Отбираем только подходящие типы
    const qs = rawQs
      .map(normalizeQuestion)
      .filter(q => RECOVERY_QUESTION_TYPES.has(q.type))
      .slice(0, 5);

    if (qs.length < 3) {
      const moreQs = generateQuestions(cardIds, historyCards, { count: 20 })
        .map(normalizeQuestion)
        .filter(q => RECOVERY_QUESTION_TYPES.has(q.type));
      qs.push(...moreQs);
    }

    setQuestions(qs.slice(0, 5));
    setIsPractice(true);
    setCurrentIndex(0);
    setCorrectCount(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsComplete(false);
    setHeartAwarded(false);
  };

  const handleAnswer = useCallback(
    (answer: string) => {
      if (showResult || !questions[currentIndex]) return;
      setSelectedAnswer(answer);
      setShowResult(true);

      const q = questions[currentIndex];
      const correct = answer === q.correctAnswer;

      setIsCorrect(correct);
      if (correct) {
        soundManager.correct();
        setCorrectCount(prev => prev + 1);
      } else {
        soundManager.incorrect();
      }
      answerQuestion(correct, q.cardId, true);
    },
    [showResult, questions, currentIndex, answerQuestion]
  );

  const handleContinue = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const success = correctCount >= 3;
      if (success) {
        const awarded = awardHeartFromPractice();
        setHeartAwarded(awarded);
        if (awarded) soundManager.achievement();
      }
      soundManager.lessonComplete();
      setIsComplete(true);
    }
  }, [currentIndex, questions.length, correctCount, awardHeartFromPractice]);

  const currentQuestion = questions[currentIndex];

  // === Экран результата ===
  if (isComplete) {
    const success = correctCount >= 3;
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ${success ? 'bg-gradient-to-br from-primary-400 to-primary-600 shadow-primary-500/30' : 'bg-surface-200 dark:bg-surface-700 shadow-surface-300/30 dark:shadow-black/20'}`}
          >
            <span className="text-4xl">{success ? '💚' : '📖'}</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-2">
            {success ? 'Тренировка пройдена!' : 'Нужно ещё повторить'}
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mb-4">
            {success ? 'Отличная работа! Ты заработал сердце!' : 'Не расстраивайся. Повтори материал и попробуй снова!'}
          </p>
          <div className="bg-surface-100 dark:bg-surface-700 rounded-xl p-4 mb-4">
            <div className="text-lg font-bold text-surface-700 dark:text-surface-200">{correctCount}/{questions.length} верных</div>
            <div className="text-xs text-surface-400 dark:text-surface-500">Нужно минимум 3 для получения сердца</div>
          </div>
          {success && heartAwarded ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-2 mb-4 text-primary-600 dark:text-primary-400 font-semibold">
              <Heart className="w-6 h-6 fill-primary-500" />
              <span>+1 сердце восстановлено!</span>
            </motion.div>
          ) : success && isFull ? (
            <div className="mb-4 text-surface-400 dark:text-surface-500 text-sm">У тебя уже полные сердца — тренировка всё равно была полезной!</div>
          ) : null}
          <button onClick={() => navigate('/')} className="btn-primary w-full">На главную</button>
          {!success && (
            <button onClick={startPractice} className="btn-secondary w-full mt-3">Попробовать снова</button>
          )}
        </motion.div>
      </div>
    );
  }

  // === Экран выбора (старт или ожидание) ===
  if (!isPractice) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <div className="max-w-lg mx-auto px-4 pb-40">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 mb-6 mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/25">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-2">Восстановление сердец</h1>
            <p className="text-surface-500 dark:text-surface-400">
              {isFull ? 'У тебя полные сердца! Тренировка поможет закрепить знания.' : 'Сердечки закончились, но обучение не останавливается.'}
            </p>
            {weakCardIds.length >= 3 && (
              <p className="text-xs text-surface-400 dark:text-surface-500 mt-2">
                Тренировка по твоим частым ошибкам ({weakCardIds.length} карточек)
              </p>
            )}
          </motion.div>
          {isFull && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card text-center mb-6 bg-gold-50 dark:bg-gold-900/20 border-gold-200 dark:border-gold-800/50"
            >
              <Heart className="w-8 h-8 text-gold-500 fill-gold-500 mx-auto mb-2" />
              <p className="font-semibold text-gold-700 dark:text-gold-300">Все сердца на месте!</p>
              <p className="text-sm text-gold-600 dark:text-gold-400 mt-1">Пройди тренировку для закрепления знаний</p>
            </motion.div>
          )}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={startPractice}
            className="btn-primary w-full flex items-center justify-center gap-2 mb-4"
          >
            <Zap className="w-5 h-5" />
            Пройти тренировку (5 заданий)
          </motion.button>
          <p className="text-center text-xs text-surface-400 dark:text-surface-500 mb-4">Минимум 3 правильных ответа = +1 сердце</p>
          {!isFull && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card text-center"
            >
              <Clock className="w-6 h-6 text-surface-400 dark:text-surface-500 mx-auto mb-2" />
              <p className="text-sm text-surface-600 dark:text-surface-300">Или подожди: 1 сердце восстановится через</p>
              <p className="text-2xl font-bold text-primary-500 my-2 tabular-nums">{timerStr}</p>
              <p className="text-xs text-surface-400 dark:text-surface-500">1 сердце каждые 30 минут</p>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // === Экран тренировки ===
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <p className="text-surface-500 dark:text-surface-400">Загрузка...</p>
      </div>
    );
  }

  const isBasicChoice =
    currentQuestion.type === 'select-date' ||
    currentQuestion.type === 'select-event' ||
    currentQuestion.type === 'odd-one-out' ||
    currentQuestion.type === 'who-is' ||
    currentQuestion.type === 'quote-author' ||
    currentQuestion.type === 'define-term' ||
    currentQuestion.type === 'identify-term' ||
    currentQuestion.type === 'select-term-by-era';

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <LessonHeader current={currentIndex + 1} total={questions.length} hearts={hearts} onClose={() => navigate('/')} />
      <div className="max-w-lg mx-auto px-4 py-6 pb-40">
        <div className="mb-3">
          <span className="badge badge-success">💚 Тренировка восстановления</span>
        </div>
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card">
          <h2 className="text-xl font-bold text-surface-800 dark:text-surface-100 mb-6">{currentQuestion.prompt}</h2>
          {isBasicChoice ? (
            <AnswerOptions
              options={currentQuestion.options || []}
              onSelect={handleAnswer}
              selectedAnswer={selectedAnswer}
              correctAnswer={currentQuestion.correctAnswer as string}
              showResult={showResult}
              disabled={false}
            />
          ) : currentQuestion.type === 'true-false' ? (
            <TrueFalseTask
              onSelect={handleAnswer}
              showResult={showResult}
              disabled={false}
              correctAnswer={currentQuestion.correctAnswer as string}
              selectedAnswer={selectedAnswer}
            />
          ) : (
            <p className="text-surface-500 text-sm text-center py-4">Этот тип вопросов пока не поддерживается в тренировке</p>
          )}
          </motion.div>
          {showResult && <FeedbackBar correct={isCorrect} explanation={currentQuestion.explanation} onContinue={handleContinue} />}
        </div>
    </div>
  );
};

export default HeartRecoveryPage;