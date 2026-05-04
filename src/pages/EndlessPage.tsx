import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Check, X, RefreshCw, Trophy, ArrowLeft, Flame } from 'lucide-react';
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

const EndlessPage: React.FC = () => {
  const navigate = useNavigate();
  const { hearts, answerQuestion, completeLesson, endlessRecord, updateEndlessRecord } = useStore();

  // Состояние
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState<{ cardId: string; wrongAnswer: string }[]>([]);
  const [startTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const [endlessStreak, setEndlessStreak] = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const endlessRef = useRef(false);

  // === СТАРТ ===
  const startGame = useCallback(() => {
    const generated = generateDateMemoryQuestions(historyCards, 9999);

    if (generated.length === 0) return;

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
    setMistakes([]);
    setIsComplete(false);
    setEndlessStreak(0);
    setNewRecord(false);
    endlessRef.current = false;
  }, []);

  // Автостарт
  useEffect(() => {
    startGame();
  }, [startGame]);

  const currentQuestion = questions[currentIndex] || null;

  // === ОБРАБОТКА ОТВЕТА ===
  const handleAnswer = useCallback((answer: string) => {
    if (showResult || !currentQuestion) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    let correct = false;
    if (currentQuestion.type === 'input-year') {
      correct = normalizeYearAnswer(answer) === normalizeYearAnswer(currentQuestion.correctAnswer as string);
    } else if (isTextQuestion(currentQuestion.type)) {
      correct = checkTextAnswer(answer, currentQuestion.correctAnswer as string);
    } else {
      correct = answer === currentQuestion.correctAnswer;
    }

    setIsCorrect(correct);

    if (correct) {
      soundManager.correct();
      setCorrectCount(prev => prev + 1);
      setEndlessStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > endlessRecord) {
          updateEndlessRecord(newStreak);
          setNewRecord(true);
        }
        return newStreak;
      });
    } else {
      soundManager.incorrect();
      setMistakes(prev => [...prev, { cardId: currentQuestion.id, wrongAnswer: answer }]);
      // В бесконечном режиме заканчиваем при первой ошибке
      endlessRef.current = true;
    }
  }, [showResult, currentQuestion, endlessRecord, updateEndlessRecord]);

  // === ПРОДОЛЖИТЬ ===
  const handleContinue = useCallback(() => {
    if (endlessRef.current) {
      finishGame();
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      finishGame();
    }
  }, [currentIndex, questions.length]);

  const finishGame = useCallback(() => {
    setIsComplete(true);

    const result: LessonResult = {
      lessonId: 'date-memory-endless',
      correctAnswers: correctCount,
      totalQuestions: correctCount + mistakes.length,
      xpEarned: 0,
      heartsLost: mistakes.length,
      perfectLesson: mistakes.length === 0,
      mistakes,
      duration: Math.floor((Date.now() - startTime) / 1000),
    };

    completeLesson(result);
    soundManager.lessonComplete();
  }, [correctCount, mistakes, startTime, completeLesson]);

  const handleMatchPairsComplete = useCallback((pairs: { date: string; event: string }[]) => {
    handleAnswer(JSON.stringify(pairs));
  }, [handleAnswer]);

  // === ЭКРАН ЗАВЕРШЕНИЯ ===
  if (isComplete) {
    const totalQuestions = correctCount + mistakes.length;
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
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-gold-500/30"
          >
            {newRecord ? <Trophy className="w-10 h-10 text-white" /> : <Flame className="w-10 h-10 text-white" />}
          </motion.div>

          <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-2">
            {newRecord ? 'Новый рекорд! 🏆' : 'Поток завершён! 💪'}
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            Ты ответил{endlessStreak > 0 ? 'а' : ''} на {endlessStreak} вопросов подряд!
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

          {/* Рекорд */}
          <div className="mb-6 p-3 rounded-xl bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800/50">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-gold-500" />
              <span className="text-sm font-medium text-gold-700 dark:text-gold-300">
                Рекорд: {endlessRecord} правильных подряд
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startGame}
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

      <div className="max-w-lg mx-auto px-4 py-6 pb-40">
        {/* Endless Streak */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4"
        >
          <div className="flex items-center justify-center gap-2">
            <Flame className={`w-5 h-5 ${endlessStreak >= 10 ? 'text-gold-500' : 'text-primary-500'}`} />
            <span className={`text-lg font-bold ${endlessStreak >= 10 ? 'text-gold-600 dark:text-gold-400' : 'text-surface-700 dark:text-surface-200'}`}>
              {endlessStreak}
            </span>
            <span className="text-sm text-surface-500 dark:text-surface-400">подряд</span>
            {endlessRecord > 0 && (
              <span className="text-xs text-surface-400 dark:text-surface-500 ml-2">
                рекорд: {endlessRecord}
              </span>
            )}
          </div>
          <div className="progress-bar mt-2">
            <div
              className="progress-bar-fill bg-gradient-to-r from-primary-500 to-gold-500"
              style={{ width: `${Math.min(100, (endlessStreak / 20) * 100)}%` }}
            />
          </div>
        </motion.div>

        {/* Режим */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium px-2 py-1 rounded-full text-gold-500 bg-gold-50 dark:text-gold-400 dark:bg-gold-900/30">
            ♾️ Бесконечный поток
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
      </div>
    </div>
  );
};

export default EndlessPage;