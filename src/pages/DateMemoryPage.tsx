import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Check, X, RefreshCw, Sparkles, Clock, Trophy, ArrowLeft, Zap, Infinity, Flame } from 'lucide-react';
import { useStore } from '../store/useStore';
import { historyCards } from '../data/historyDates';
import { generateDateMemoryQuestions, getDateGeneratorName } from '../utils/dateMemoryEngine';
import { checkTextAnswer, isTextQuestion, normalizeYearAnswer } from '../utils/answerNormalizer';
import { soundManager } from '../utils/sounds';
import { Question, LessonResult } from '../types';
import {
  LessonHeader,
  AnswerOptions,
  InputTask,
  TrueFalseTask,
  MatchPairsTask,
  FeedbackBar,
} from '../components/ui/LessonComponents';

type GameMode = 'all' | 'quick' | 'blitz';

const GAME_LENGTHS: Record<GameMode, number> = {
  all: 15,
  quick: 8,
  blitz: 5,
};

const GAME_LABELS: Record<GameMode, { title: string; subtitle: string; icon: string }> = {
  all: { title: 'Полный зачёт', subtitle: '15 вопросов, все типы заданий', icon: '🧠' },
  quick: { title: 'Быстрый зачёт', subtitle: '8 вопросов для разминки', icon: '⚡' },
  blitz: { title: 'Блиц-опрос', subtitle: '5 вопросов на время', icon: '🔥' },
};

const DateMemoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { hearts, answerQuestion, completeLesson } = useStore();

  // Состояние
  const [mode, setMode] = useState<GameMode | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState<{ cardId: string; wrongAnswer: string }[]>([]);
  const [startTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const [blitzTimer, setBlitzTimer] = useState(60);
  const [blitzActive, setBlitzActive] = useState(false);

  // === BLITZ TIMER ===
  useEffect(() => {
    if (mode !== 'blitz' || !blitzActive) return;
    if (blitzTimer <= 0) {
      finishGame();
      return;
    }
    const interval = setInterval(() => {
      setBlitzTimer(prev => {
        if (prev <= 1) {
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, blitzActive, blitzTimer]);

  // === СТАРТ ===
  const startGame = useCallback((gameMode: GameMode) => {
    const count = GAME_LENGTHS[gameMode];
    const generated = generateDateMemoryQuestions(historyCards, count);

    if (generated.length === 0) return;

    setMode(gameMode);
    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
    setMistakes([]);
    setIsComplete(false);

    if (gameMode === 'blitz') {
      setBlitzTimer(60);
      setBlitzActive(true);
    }
  }, []);

  const currentQuestion = questions[currentIndex];

  // === ОБРАБОТКА ОТВЕТА ===
  const handleAnswer = useCallback((answer: string) => {
    if (showResult || !currentQuestion) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    let correct = false;

    if (currentQuestion.type === 'match-pairs') {
      try {
        const correctPairs = JSON.parse(currentQuestion.correctAnswer as string);
        const userPairs = JSON.parse(answer);
        correct = JSON.stringify(correctPairs) === JSON.stringify(userPairs);
      } catch {
        correct = false;
      }
    } else if (currentQuestion.type === 'timeline-order') {
      try {
        const correctOrder = currentQuestion.correctAnswer as string[];
        const userOrder = JSON.parse(answer);
        correct = JSON.stringify(correctOrder) === JSON.stringify(userOrder);
      } catch {
        correct = false;
      }
    } else if (currentQuestion.type === 'true-false') {
      correct = answer === currentQuestion.correctAnswer;
    } else if (isTextQuestion(currentQuestion.type)) {
      correct = checkTextAnswer(
        answer,
        currentQuestion.correctAnswer as string,
        currentQuestion.acceptableAnswers,
        currentQuestion.aliases
      );
    } else if (currentQuestion.type === 'input-year') {
      const userYear = normalizeYearAnswer(answer);
      const correctYear = normalizeYearAnswer(currentQuestion.correctAnswer as string);
      correct = userYear === correctYear;
    } else {
      correct = answer === currentQuestion.correctAnswer;
    }

    setIsCorrect(correct);

    if (correct) {
      soundManager.correct();
      setCorrectCount(prev => prev + 1);
    } else {
      soundManager.incorrect();
      setMistakes(prev => [...prev, {
        cardId: currentQuestion.cardId,
        wrongAnswer: answer,
      }]);
    }

    answerQuestion(correct, currentQuestion.cardId, false, correct ? '' : answer);
  }, [showResult, currentQuestion, answerQuestion]);

  // === ПРОДОЛЖИТЬ ===
  const handleContinue = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      finishGame();
    }
  }, [currentIndex, questions.length]);

  const finishGame = useCallback(() => {
    setBlitzActive(false);
    const totalQuestions = questions.length || GAME_LENGTHS[mode || 'quick'];
    const perfectGame = correctCount >= totalQuestions;

    setIsComplete(true);

    // Начисляем XP и завершаем
    const result: LessonResult = {
      lessonId: `date-memory-${mode}`,
      correctAnswers: correctCount,
      totalQuestions,
      xpEarned: 0,
      heartsLost: totalQuestions - correctCount,
      perfectLesson: perfectGame,
      mistakes,
      duration: Math.floor((Date.now() - startTime) / 1000),
    };

    completeLesson(result);
    soundManager.lessonComplete();
  }, [correctCount, questions.length, mode, mistakes, startTime, completeLesson]);

  const handleMatchPairsComplete = useCallback((pairs: { date: string; event: string }[]) => {
    handleAnswer(JSON.stringify(pairs));
  }, [handleAnswer]);

  // === ЭКРАН ВЫБОРА РЕЖИМА ===
  if (!mode) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <div className="max-w-lg mx-auto px-4 pb-40">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center hover:bg-surface-200 transition-colors dark:bg-surface-800 dark:hover:bg-surface-700"
            >
              <ArrowLeft className="w-5 h-5 text-surface-600 dark:text-surface-300" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100">Чистый зачёт</h1>
              <p className="text-sm text-surface-500 dark:text-surface-400">Заучивание дат без теории</p>
            </div>
          </div>

          {/* Статистика */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-6 bg-gradient-to-br from-primary-500 to-primary-700 text-white overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-6 -mb-6" />
            <div className="relative z-10">
              <Brain className="w-10 h-10 mb-3 text-primary-200" />
              <h2 className="text-xl font-bold mb-1">Режим чистого заучивания</h2>
              <p className="text-primary-100 text-sm mb-4">
                10 типов заданий по датам: хронология, века, десятилетия, сопоставления и многое другое
              </p>
              <div className="flex items-center gap-4 text-sm text-primary-100">
                <span className="flex items-center gap-1"><Sparkles className="w-4 h-4" /> {historyCards.length} дат</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Без ограничений</span>
              </div>
            </div>
          </motion.div>

          {/* Режимы */}
          <div className="space-y-3">
            {(Object.entries(GAME_LABELS) as [GameMode, typeof GAME_LABELS['all']][]).map(([gameMode, label]) => (
              <motion.button
                key={gameMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startGame(gameMode)}
                className="w-full card card-hover text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40">
                    {label.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-surface-800 dark:text-surface-100">{label.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{label.subtitle}</p>
                  </div>
                  <div className="text-surface-300 dark:text-surface-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // === ЭКРАН ЗАВЕРШЕНИЯ ===
  if (isComplete) {
    const totalQuestions = questions.length || GAME_LENGTHS[mode];
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const totalXp = correctCount * 10 + (correctCount === totalQuestions ? 50 : 0);
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-primary-500/30"
          >
            {accuracy >= 80 ? <Trophy className="w-10 h-10 text-white" /> : <Brain className="w-10 h-10 text-white" />}
          </motion.div>

          <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-2">
            {accuracy === 100 ? 'Идеально! 🎉' : accuracy >= 80 ? 'Отлично! 🌟' : accuracy >= 60 ? 'Хорошо! 💪' : 'Потренируйся ещё! 📚'}
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            {mode === 'blitz' && 'Блиц-опрос завершён!'}
            {mode === 'quick' && 'Быстрый зачёт пройден!'}
            {mode === 'all' && 'Полный зачёт пройден!'}
          </p>

          <div className="grid grid-cols-4 gap-2 mb-6">
            <div className="bg-primary-50 rounded-xl p-3 dark:bg-primary-900/30">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{totalXp}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400">XP</div>
            </div>
            <div className="bg-surface-100 rounded-xl p-3 dark:bg-surface-700">
              <div className="text-2xl font-bold text-surface-700 dark:text-surface-200">{accuracy}%</div>
              <div className="text-xs text-surface-500 dark:text-surface-400">Точность</div>
            </div>
            <div className="bg-gold-50 rounded-xl p-3 dark:bg-gold-900/30">
              <div className="text-2xl font-bold text-gold-600 dark:text-gold-400">{correctCount}/{totalQuestions}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400">Верно</div>
            </div>
            <div className="bg-surface-100 rounded-xl p-3 dark:bg-surface-700">
              <div className="text-2xl font-bold text-surface-700 dark:text-surface-200">{minutes}:{seconds.toString().padStart(2, '0')}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400">Время</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => startGame(mode)}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Ещё раз
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary flex-1"
            >
              На главную
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // === ЭКРАН ВОПРОСА ===
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <p className="text-surface-500 dark:text-surface-400">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <LessonHeader
        current={currentIndex + 1}
        total={questions.length}
        hearts={hearts}
        onClose={() => navigate('/')}
      />

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Blitz Timer */}
        {mode === 'blitz' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-surface-600 dark:text-surface-300">⏱ Осталось времени</span>
              <span className={`text-lg font-bold ${blitzTimer <= 10 ? 'text-error-500 animate-pulse' : 'text-surface-700 dark:text-surface-200'}`}>
                {blitzTimer}с
              </span>
            </div>
            <div className="progress-bar">
              <div
                className={`progress-bar-fill transition-all duration-1000 ${blitzTimer <= 10 ? 'bg-error-500' : 'bg-primary-500'}`}
                style={{ width: `${(blitzTimer / 60) * 100}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* Режим */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium px-2 py-1 rounded-full text-primary-500 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/30">
            {GAME_LABELS[mode].icon} {GAME_LABELS[mode].title}
          </span>
          <span className="text-xs font-medium text-surface-400 bg-surface-100 px-2 py-1 rounded-full dark:text-surface-500 dark:bg-surface-800">
            {getDateGeneratorName(currentQuestion.id)}
          </span>
          {/* Счётчик правильных */}
          <span className="text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full ml-auto dark:text-emerald-400 dark:bg-emerald-900/30">
            ✓ {correctCount}
          </span>
        </div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-surface-800 dark:text-surface-100 mb-6 whitespace-pre-line">
            {currentQuestion.prompt}
          </h2>

          {/* Рендер в зависимости от типа вопроса */}
          {(['select-date', 'select-event', 'odd-one-out'].includes(currentQuestion.type)) ? (
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
          ) : currentQuestion.type === 'match-pairs' && currentQuestion.pairs ? (
            <MatchPairsTask
              pairs={currentQuestion.pairs}
              onComplete={handleMatchPairsComplete}
              disabled={showResult}
              showResult={showResult}
            />
          ) : currentQuestion.type === 'input-year' ? (
            <InputTask
              onSubmit={handleAnswer}
              correctAnswer={currentQuestion.correctAnswer as string}
              showResult={showResult}
              disabled={false}
              inputMode="year"
            />
          ) : (
            <AnswerOptions
              options={currentQuestion.options || []}
              onSelect={handleAnswer}
              selectedAnswer={selectedAnswer}
              correctAnswer={currentQuestion.correctAnswer as string}
              showResult={showResult}
              disabled={false}
            />
          )}
        </motion.div>

        {showResult && (
          <FeedbackBar
            correct={isCorrect}
            explanation={currentQuestion.explanation}
            onContinue={handleContinue}
          />
        )}

        {/* Спейсер для прокрутки над нижним навбаром */}
        <div className="h-32" />
      </div>
    </div>
  );
};

export default DateMemoryPage;