import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Brain, Zap, AlertTriangle, X } from 'lucide-react';
import { TopBar } from '../components/ui/TopBar';
import { useStore } from '../store/useStore';
import { historyCards } from '../data/historyDates';
import { generateQuestions, normalizeQuestion } from '../utils/questionGenerator';
import { checkTextAnswer, isTextQuestion, normalizeYearAnswer } from '../utils/answerNormalizer';
import { getTopWeakCards } from '../utils/cardAnalysis';
import { Question, LessonResult } from '../types';
import { soundManager } from '../utils/sounds';
import { AnswerOptions, InputTask, TrueFalseTask, MatchPairsTask, TimelineOrderTask, FeedbackBar } from '../components/ui/LessonComponents';

const ReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { hearts, cardProgress, answerQuestion, completeLesson, canStartLesson, mistakes } = useStore();
  
  const [isReviewing, setIsReviewing] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [lessonMistakes, setLessonMistakes] = useState<{ cardId: string; wrongAnswer: string }[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Топ-20 слабых карточек на основе реальной статистики
  const weakCardEntries = useMemo(() => {
    return getTopWeakCards(historyCards, cardProgress, 20);
  }, [cardProgress]);

  const reviewCards = useMemo(() => {
    return weakCardEntries.map(e => e.card);
  }, [weakCardEntries]);

  // Выжимка последних 5 ошибок для показа
  const recentMistakes = useMemo(() => {
    return mistakes.slice(-5).reverse().map(m => {
      const card = historyCards.find(c => c.id === m.cardId);
      return {
        cardId: m.cardId,
        event: card?.event || 'неизвестно',
        wrongAnswer: m.wrongAnswer,
        timestamp: m.timestamp,
      };
    });
  }, [mistakes]);

  const startReview = () => {
    if (reviewCards.length === 0) return;

    const cardIds = reviewCards.map(c => c.id);
    const questionCount = Math.min(reviewCards.length * 2, 20);
    const rawQuestions = generateQuestions(cardIds, historyCards, { count: questionCount, includeAdvanced: true });
    const generatedQuestions = rawQuestions.map(normalizeQuestion);
    
    setQuestions(generatedQuestions);
    setIsReviewing(true);
    setStartTime(Date.now());
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrect(false);
    setLessonMistakes([]);
    setCorrectCount(0);
    setIsComplete(false);
  };

  const handleAnswer = (answer: string) => {
    if (showResult || !questions[currentIndex]) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const currentQuestion = questions[currentIndex];
    let isAnswerCorrect = false;

    // Проверка в зависимости от типа вопроса
    if (currentQuestion.type === 'match-pairs') {
      try {
        const correctPairs = JSON.parse(currentQuestion.correctAnswer as string);
        const userPairs = JSON.parse(answer);
        isAnswerCorrect = JSON.stringify(correctPairs) === JSON.stringify(userPairs);
      } catch {
        isAnswerCorrect = false;
      }
    } else if (currentQuestion.type === 'timeline-order') {
      try {
        const correctOrder = currentQuestion.correctAnswer as string[];
        const userOrder = JSON.parse(answer);
        isAnswerCorrect = JSON.stringify(correctOrder) === JSON.stringify(userOrder);
      } catch {
        isAnswerCorrect = false;
      }
    } else if (currentQuestion.type === 'true-false') {
      isAnswerCorrect = answer === currentQuestion.correctAnswer;
    } else if (isTextQuestion(currentQuestion.type)) {
      isAnswerCorrect = checkTextAnswer(
        answer,
        currentQuestion.correctAnswer as string,
        currentQuestion.acceptableAnswers,
        currentQuestion.aliases
      );
    } else if (currentQuestion.type === 'input-year') {
      const userYear = normalizeYearAnswer(answer);
      const correctYear = normalizeYearAnswer(currentQuestion.correctAnswer as string);
      isAnswerCorrect = userYear === correctYear;
    } else if (currentQuestion.type === 'fill-blank' || currentQuestion.type === 'missing-word') {
      // Определяем по inputMode вопроса
      const qInputMode = (currentQuestion as any).inputMode || 'text';
      if (qInputMode === 'year') {
        const userYear = normalizeYearAnswer(answer);
        const correctYear = normalizeYearAnswer(currentQuestion.correctAnswer as string);
        isAnswerCorrect = userYear === correctYear;
      } else {
        isAnswerCorrect = checkTextAnswer(
          answer,
          currentQuestion.correctAnswer as string,
          currentQuestion.acceptableAnswers,
          currentQuestion.aliases
        );
      }
    } else {
      isAnswerCorrect = answer.trim().toLowerCase() === currentQuestion.correctAnswer.toString().trim().toLowerCase();
    }

    setCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      soundManager.correct();
      setCorrectCount(prev => prev + 1);
    } else {
      soundManager.incorrect();
    }

    // Обновляем статистику карточки в сторе
    const cardId = currentQuestion.cardId;
    if (cardId) {
      answerQuestion(isAnswerCorrect, cardId, true, isAnswerCorrect ? undefined : answer);
    }

    // Если неправильно, сохраняем ошибку
    if (!isAnswerCorrect && cardId) {
      setLessonMistakes(prev => [...prev, { cardId, wrongAnswer: answer }]);
    }
  };

  // ===== Обработчики для match-pairs и timeline =====
  const handleMatchPairsComplete = (pairs: { date: string; event: string }[]) => {
    const answer = JSON.stringify(pairs);
    handleAnswer(answer);
  };

  const handleTimelineComplete = (ordered: string[]) => {
    const answer = JSON.stringify(ordered);
    handleAnswer(answer);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setCorrect(false);
    } else {
      finishReview();
    }
  };

  const finishReview = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    const totalQuestions = questions.length;
    const correct = correctCount;
    const mistakesArray = lessonMistakes;

    const result: LessonResult = {
      lessonId: 'review-session',
      correctAnswers: correct,
      totalQuestions,
      mistakes: mistakesArray,
      perfectLesson: mistakesArray.length === 0,
      duration: elapsed,
      xpEarned: correct * 5,
      heartsLost: 0,
    };

    completeLesson(result);
    setIsComplete(true);
  };

  const currentQuestion = questions[currentIndex];

  if (isComplete) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <TopBar />
        <div className="max-w-lg mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-primary-500" />
            </div>
            <h2 className="text-xl font-bold text-surface-800 dark:text-surface-100 mb-2">
              Повторение завершено!
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mb-4">
              {correctCount}/{questions.length} правильных
            </p>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
              {correctCount * 5} XP получено
            </p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              На главную
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isReviewing && currentQuestion) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <TopBar />
        <div className="max-w-lg mx-auto px-4 py-4 pb-40">
          {/* Header с прогрессом */}
          <div className="sticky top-0 z-40 bg-white/90 dark:bg-surface-900/90 backdrop-blur-lg border-b border-surface-100 dark:border-surface-800 px-4 py-3 -mx-4 mb-4">
            <div className="max-w-lg mx-auto flex items-center gap-3">
              <button
                onClick={() => setIsReviewing(false)}
                className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <X className="w-5 h-5 text-surface-500" />
              </button>
              <div className="flex-1 h-2.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-400 rounded-full transition-all"
                  style={{ width: `${(currentIndex / questions.length) * 100}%` }}
                />
              </div>
              <div className="text-xs text-surface-400 whitespace-nowrap">{hearts} ♥</div>
            </div>
          </div>

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-2"
          >
            <div className="card mb-4">
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-2">
                {currentQuestion.type === 'who-is' && 'Кто это?'}
                {currentQuestion.type === 'quote-author' && 'Кто автор цитаты?'}
                {currentQuestion.type === 'true-false' && 'Правда или ложь?'}
                {currentQuestion.type === 'match-pairs' && 'Сопоставьте пары'}
                {currentQuestion.type === 'timeline-order' && 'Расставьте в хронологическом порядке'}
                {currentQuestion.type === 'input-year' && 'Введите год'}
                {currentQuestion.type === 'input-text' && 'Введите ответ'}
                {currentQuestion.type === 'fill-blank' && 'Заполните пропуск'}
                {currentQuestion.type === 'select-date' && 'Выберите дату'}
                {currentQuestion.type === 'select-event' && 'Выберите событие'}
                {currentQuestion.type === 'odd-one-out' && 'Выберите лишнее'}
              </p>
              <p className="text-lg font-semibold text-surface-800 dark:text-surface-100">
                {currentQuestion.prompt}
              </p>
            </div>

            {currentQuestion.type === 'select-date' || currentQuestion.type === 'select-event' || currentQuestion.type === 'odd-one-out' || currentQuestion.type === 'who-is' || currentQuestion.type === 'quote-author' ? (
              <AnswerOptions
                options={currentQuestion.options || []}
                onSelect={handleAnswer}
                selectedAnswer={selectedAnswer}
                correctAnswer={typeof currentQuestion.correctAnswer === 'string' ? currentQuestion.correctAnswer : String(currentQuestion.correctAnswer)}
                showResult={showResult}
                disabled={showResult}
              />
            ) : currentQuestion.type === 'true-false' ? (
              <TrueFalseTask
                onSelect={handleAnswer}
                showResult={showResult}
                disabled={showResult}
                correctAnswer={String(currentQuestion.correctAnswer)}
                selectedAnswer={selectedAnswer}
              />
            ) : currentQuestion.type === 'match-pairs' ? (
              <MatchPairsTask
                pairs={currentQuestion.pairs || []}
                onComplete={handleMatchPairsComplete}
                disabled={showResult}
                showResult={showResult}
              />
            ) : currentQuestion.type === 'timeline-order' ? (
              <TimelineOrderTask
                items={currentQuestion.timelineItems || []}
                onComplete={handleTimelineComplete}
                disabled={showResult}
                showResult={showResult}
              />
            ) : currentQuestion.type === 'input-year' ? (
              <InputTask
                onSubmit={handleAnswer}
                correctAnswer={typeof currentQuestion.correctAnswer === 'string' ? currentQuestion.correctAnswer : String(currentQuestion.correctAnswer)}
                showResult={showResult}
                disabled={showResult}
                inputMode="year"
                placeholder="Введите год..."
              />
            ) : currentQuestion.type === 'input-text' || currentQuestion.type === 'fill-blank' ? (
              <InputTask
                onSubmit={handleAnswer}
                correctAnswer={typeof currentQuestion.correctAnswer === 'string' ? currentQuestion.correctAnswer : String(currentQuestion.correctAnswer)}
                showResult={showResult}
                disabled={showResult}
                inputMode="text"
                placeholder="Введите ответ..."
              />
            ) : (
              <AnswerOptions
                options={currentQuestion.options || []}
                onSelect={handleAnswer}
                selectedAnswer={selectedAnswer}
                correctAnswer={typeof currentQuestion.correctAnswer === 'string' ? currentQuestion.correctAnswer : String(currentQuestion.correctAnswer)}
                showResult={showResult}
                disabled={showResult}
              />
            )}

            {showResult && (
              <FeedbackBar
                correct={correct}
                explanation={currentQuestion.explanation || ''}
                onContinue={nextQuestion}
                showHint={false}
              />
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Стартовый экран
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <TopBar />
      <div className="max-w-lg mx-auto px-4 py-8">
        <Link to="/" className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">На главную</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-surface-800 dark:text-surface-100">Повторение</h2>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {reviewCards.length === 0
                  ? 'Нет карточек для повторения'
                  : `${reviewCards.length} карточек для повторения`}
              </p>
            </div>
          </div>

          {reviewCards.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-16 h-16 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
              <p className="text-surface-500 dark:text-surface-400 font-medium">
                Пока нет карточек для повторения. Продолжайте обучение.
              </p>
              <p className="text-sm text-surface-400 dark:text-surface-500 mt-2">
                Карточки появятся здесь, когда вы начнёте ошибаться в ответах.
              </p>
            </div>
          ) : (
            <>
              {/* Список слабых карточек */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-surface-600 dark:text-surface-300 mb-3">
                  Топ-{Math.min(weakCardEntries.length, 30)} карточек с ошибками
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {weakCardEntries.slice(0, 30).map((entry) => (
                    <div
                      key={entry.card.id}
                      className="flex items-start gap-2 p-2 rounded-lg bg-surface-50 dark:bg-surface-800"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-700 dark:text-surface-200 truncate">
                          {entry.card.event}
                        </p>
                        <p className="text-xs text-surface-400 dark:text-surface-500">
                          {entry.card.year} • {entry.wrongCount} ошибок • точность {Math.round(entry.accuracy * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Выжимка последних ошибок */}
              {recentMistakes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-surface-600 dark:text-surface-300 mb-3 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-error-400" />
                    Последние ошибки
                  </h3>
                  <div className="space-y-2">
                    {recentMistakes.map((m, i) => (
                      <div
                        key={`${m.cardId}-${i}`}
                        className="flex items-start gap-2 p-2 rounded-lg bg-error-50 dark:bg-error-900/10"
                      >
                        <div className="w-1.5 h-full min-h-[2rem] rounded bg-error-400 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-surface-700 dark:text-surface-200">
                            {m.event}
                          </p>
                          {m.wrongAnswer && (
                            <p className="text-xs text-error-500 mt-0.5">
                              Ваш ответ: {m.wrongAnswer}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={startReview}
                className="btn-primary w-full flex items-center justify-center gap-2"
                disabled={!canStartLesson()}
              >
                <Zap className="w-5 h-5" />
                Начать повторение ({Math.min(reviewCards.length * 2, 20)} вопросов)
              </button>

              {!canStartLesson() && (
                <p className="text-xs text-error-500 text-center mt-2">
                  Нет сердечек для повторения. Восстановите сердца.
                </p>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ReviewPage;