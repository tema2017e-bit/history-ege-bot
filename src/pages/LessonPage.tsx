import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { historyCards, lessons, eras } from '../data/historyDates';
import { generateLessonQuestions, generateStruggleQuestion } from '../utils/questionGenerator';
import { checkTextAnswer, isTextQuestion, normalizeYearAnswer } from '../utils/answerNormalizer';
import { soundManager } from '../utils/sounds';
import { Question, HistoryCard, LessonResult, QuestionType } from '../types';
import {
  LessonHeader,
  AnswerOptions,
  InputTask,
  TrueFalseTask,
  MatchPairsTask,
  TimelineOrderTask,
  FeedbackBar,
  ContextBanner,
  GroupingTask,
  MultipleCorrectTask,
  DialogCard,
} from '../components/ui/LessonComponents';

// Типы вопросов, для которых struggle mode НЕ работает
const NON_STRUGGLE_TYPES: QuestionType[] = [
  'match-pairs',
  'timeline-order',
  'grouping',
  'multiple-correct',
  'dialog-card',
  'select-event',
  'select-date',
  'term-by-context',
  'term-by-function',
  'term-distinguish',
  'term-odd-one-out',
  'term-by-consequence',
  'term-scenario',
];

const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  
  const { hearts, answerQuestion, completeLesson, loseHeart, canStartLesson } = useStore();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lessonMistakes, setLessonMistakes] = useState<{ cardId: string; wrongAnswer: string }[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);

  // Struggle Mode: после ошибки показываем упрощённый вопрос
  const [struggleQuestion, setStruggleQuestion] = useState<Question | null>(null);
  const [showStruggle, setShowStruggle] = useState(false);

  // Инициализация вопросов — СТАРТУЕТ ТОЛЬКО ОДИН РАЗ
  const initializedRef = React.useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) {
      navigate('/');
      return;
    }

    // Проверка сердец (без пересчёта — пересчёт уже сделан на rehydrate)
    const state = useStore.getState();
    if (state.hearts <= 0) {
      navigate('/');
      return;
    }

    // Сердца отнимаются автоматически за НЕПРАВИЛЬНЫЕ ответы внутри answerQuestion()
    // При старте урока сердце НЕ списываем

    const generatedQuestions = generateLessonQuestions(
      lesson.cardIds,
      historyCards,
      { count: Math.max(8, lesson.cardIds.length * 2) }
    );

    setQuestions(generatedQuestions);
  }, [lessonId, navigate]);

  const currentQuestion = struggleQuestion || questions[currentIndex];
  const allCards = historyCards;

  // Поиск карточки для ContextBanner
  const findCardForContext = (q: Question): HistoryCard | undefined => {
    return allCards.find(c => c.id === q.cardId);
  };
  const currentCard = currentQuestion ? findCardForContext(currentQuestion) : undefined;

  // Проверка, поддерживает ли тип вопроса struggle mode
  const canUseStruggleMode = useCallback((q: Question): boolean => {
    return !NON_STRUGGLE_TYPES.includes(q.type);
  }, []);

  const handleAnswer = useCallback((answer: string) => {
    if (showResult || !currentQuestion) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    // Для match-pairs и timeline-order проверка иная
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
    } else if (currentQuestion.type === 'grouping') {
      try {
        const correctGroups = currentQuestion.groupAnswer || {};
        const userGroups = JSON.parse(answer);
        // Сравниваем с сортировкой массивов, чтобы порядок элементов не влиял
        const normalizeGroups = (groups: Record<string, string[]>) => {
          const result: Record<string, string[]> = {};
          for (const key of Object.keys(groups).sort()) {
            result[key] = [...groups[key]].sort();
          }
          return result;
        };
        correct = JSON.stringify(normalizeGroups(correctGroups)) === JSON.stringify(normalizeGroups(userGroups));
      } catch {
        correct = false;
      }
    } else if (currentQuestion.type === 'multiple-correct') {
      try {
        const correctArray = currentQuestion.multiCorrectAnswers || [];
        const userArray = JSON.parse(answer);
        correct = Array.isArray(correctArray) && Array.isArray(userArray) &&
          correctArray.length === userArray.length &&
          correctArray.every((v: string) => userArray.includes(v));
      } catch {
        correct = false;
      }
    } else if (isTextQuestion(currentQuestion.type)) {
      correct = checkTextAnswer(
        answer,
        currentQuestion.correctAnswer as string,
        currentQuestion.acceptableAnswers,
        currentQuestion.aliases
      );
    } else if (currentQuestion.type === 'input-year' || currentQuestion.type === 'fill-blank') {
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
      setLessonMistakes(prev => [...prev, {
        cardId: currentQuestion.cardId,
        wrongAnswer: answer,
      }]);

      // Struggle Mode: создаём упрощённый вопрос ТОЛЬКО для поддерживаемых типов
      if (!struggleQuestion && currentCard && canUseStruggleMode(currentQuestion)) {
        const struggleQ = generateStruggleQuestion(currentCard, allCards);
        setStruggleQuestion(struggleQ);
      }
    }

    answerQuestion(correct, currentQuestion.cardId, false, correct ? '' : answer);
  }, [showResult, currentQuestion, answerQuestion, struggleQuestion, currentCard, allCards, canUseStruggleMode]);

  const handleContinue = useCallback(() => {
    // Если была ошибка и есть Struggle Mode — показать его
    if (!isCorrect && struggleQuestion && !showStruggle) {
      setShowStruggle(true);
      setSelectedAnswer(null);
      setShowResult(false);
      setStruggleQuestion(struggleQuestion);
      return;
    }

    // Сбрасываем Struggle Mode
    setStruggleQuestion(null);
    setShowStruggle(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Урок завершён
      const perfectLesson = correctCount === questions.length;

      const result: LessonResult = {
        lessonId: lessonId!,
        correctAnswers: correctCount,
        totalQuestions: questions.length,
        xpEarned: 0, // XP уже начислен per-question в answerQuestion
        heartsLost: questions.length - correctCount,
        perfectLesson,
        mistakes: lessonMistakes,
        duration: Math.floor((Date.now() - startTime) / 1000),
      };

      completeLesson(result);
      soundManager.lessonComplete();
      setIsComplete(true);
    }
  }, [currentIndex, questions.length, correctCount, lessonMistakes, startTime, completeLesson, lessonId, isCorrect, struggleQuestion, showStruggle]);

  const handleMatchPairsComplete = useCallback((pairs: { date: string; event: string }[]) => {
    handleAnswer(JSON.stringify(pairs));
  }, [handleAnswer]);

  const handleTimelineComplete = useCallback((ordered: string[]) => {
    handleAnswer(JSON.stringify(ordered));
  }, [handleAnswer]);

  if (isComplete) {
    const perfectLesson = correctCount === questions.length;
    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    // XP за урок: correctCount * 10 (per-question) + 50 за идеальный + бонус за эпоху
    const totalXp = correctCount * 10 + (perfectLesson ? 50 : 0);

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
            className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/30"
          >
            <span className="text-4xl">🎉</span>
          </motion.div>

          <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-2">
            {perfectLesson ? 'Идеальный урок!' : 'Урок завершён!'}
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            {perfectLesson ? 'Без единой ошибки! Ты молодец!' : 'Хорошая работа! Продолжай в том же духе!'}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-primary-50 rounded-xl p-3 dark:bg-primary-900/30">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{totalXp}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400">XP</div>
            </div>
            <div className="bg-surface-100 rounded-xl p-3 dark:bg-surface-700">
              <div className="text-2xl font-bold text-surface-700 dark:text-surface-200">{accuracy}%</div>
              <div className="text-xs text-surface-500 dark:text-surface-400">Точность</div>
            </div>
            <div className="bg-gold-50 rounded-xl p-3 dark:bg-gold-900/30">
              <div className="text-2xl font-bold text-gold-600 dark:text-gold-400">{correctCount}/{questions.length}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400">Верно</div>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="btn-primary w-full"
          >
            Продолжить
          </button>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-surface-500 dark:text-surface-400">Загрузка урока...</p>
        </div>
      </div>
    );
  }

  const questionType = currentQuestion.type;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <LessonHeader
        current={currentIndex + 1}
        total={questions.length}
        hearts={hearts}
        onClose={() => navigate('/')}
      />

      <div className="max-w-lg mx-auto px-4 py-6 pb-40">
        <motion.div
          key={currentIndex + (showStruggle ? '-struggle' : '')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="card"
        >
          {/* Struggle Indicator */}
          {showStruggle && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-orange-50 to-warning-50 rounded-xl p-3 mb-4 border border-orange-200 dark:from-orange-900/30 dark:to-warning-900/30 dark:border-orange-800/50"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-orange-700 dark:text-orange-300">
                <RefreshCw className="w-4 h-4" />
                <span>Попробуем ещё раз, но проще!</span>
              </div>
            </motion.div>
          )}

          {/* Badge */}
          <div className="mb-6">
            <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2 py-1 rounded-full dark:text-primary-400 dark:bg-primary-900/30">
              {questionType === 'select-date' && '📅 Выбери дату'}
              {questionType === 'select-event' && '📜 Выбери событие'}
              {questionType === 'input-year' && '✍️ Введи год'}
              {questionType === 'input-text' && '✍️ Введи ответ'}
              {questionType === 'true-false' && '✅ Правда или ложь'}
              {questionType === 'fill-blank' && '✏️ Заполни пропуск'}
              {questionType === 'odd-one-out' && '🔍 Найди лишнее'}
              {questionType === 'match-pairs' && '🔗 Соответствие'}
              {questionType === 'timeline-order' && '📊 Хронология'}
              {questionType === 'who-is' && '👤 Историческая личность'}
              {questionType === 'quote-author' && '✍️ Автор цитаты'}
              {questionType === 'define-term' && '📖 Определение термина'}
              {questionType === 'identify-term' && '🔎 Назови термин'}
              {questionType === 'select-term-by-era' && '📌 Термин эпохи'}
              {questionType === 'term-by-context' && '🧩 Термин в контексте'}
              {questionType === 'term-by-function' && '⚙️ Функция термина'}
              {questionType === 'term-distinguish' && '🔀 Отличие терминов'}
              {questionType === 'term-odd-one-out' && '🔍 Найди лишний термин'}
              {questionType === 'term-by-consequence' && '📋 Последствия термина'}
              {questionType === 'term-scenario' && '🎯 Примени термин'}
              {questionType === 'grouping' && '📂 Распредели по категориям'}
              {questionType === 'missing-word' && '✍️ Вставь пропущенное слово'}
              {questionType === 'multiple-correct' && '✅ Выбери все верные'}
              {questionType === 'dialog-card' && '🧠 Флип-карточка'}
            </span>
          </div>

          {/* ContextBanner — показывает век, эпоху, правителя ДО ответа */}
          {currentCard && (
            <ContextBanner
              period={currentCard.period}
              eraName={eras.find(e => e.id === currentCard.era)?.name}
              ruler={currentCard.ruler}
            />
          )}

          <h2 className="text-xl font-bold text-surface-800 dark:text-surface-100 mb-6">
            {currentQuestion.prompt}
          </h2>

          {/* Рендер в зависимости от типа вопроса */}
          {(questionType === 'select-date' || questionType === 'select-event' || questionType === 'odd-one-out' || questionType === 'who-is' || questionType === 'quote-author' || questionType === 'define-term' || questionType === 'identify-term' || questionType === 'select-term-by-era' || questionType === 'term-by-context' || questionType === 'term-by-function' || questionType === 'term-distinguish' || questionType === 'term-odd-one-out' || questionType === 'term-by-consequence' || questionType === 'term-scenario') ? (
            <AnswerOptions
              options={currentQuestion.options || []}
              onSelect={handleAnswer}
              selectedAnswer={selectedAnswer}
              correctAnswer={currentQuestion.correctAnswer as string}
              showResult={showResult}
              disabled={false}
            />
          ) : questionType === 'true-false' ? (
            <TrueFalseTask
              onSelect={handleAnswer}
              showResult={showResult}
              disabled={false}
              correctAnswer={currentQuestion.correctAnswer as string}
              selectedAnswer={selectedAnswer}
            />
          ) : questionType === 'match-pairs' && currentQuestion.pairs ? (
            <MatchPairsTask
              pairs={currentQuestion.pairs}
              onComplete={handleMatchPairsComplete}
              disabled={showResult}
              showResult={showResult}
            />
          ) : questionType === 'timeline-order' && currentQuestion.timelineItems ? (
            <TimelineOrderTask
              items={currentQuestion.timelineItems}
              onComplete={handleTimelineComplete}
              disabled={showResult}
              showResult={showResult}
            />
          ) : questionType === 'input-text' || questionType === 'fill-blank' ? (
            <InputTask
              onSubmit={handleAnswer}
              correctAnswer={currentQuestion.correctAnswer as string}
              showResult={showResult}
              disabled={false}
              inputMode={currentQuestion.inputMode || 'year'}
              placeholder={currentQuestion.inputMode === 'text' ? 'Введите ответ...' : undefined}
            />
          ) : questionType === 'missing-word' ? (
            <InputTask
              onSubmit={handleAnswer}
              correctAnswer={currentQuestion.correctAnswer as string}
              showResult={showResult}
              disabled={false}
              inputMode="text"
              placeholder="Введите слово..."
            />
          ) : questionType === 'grouping' && currentQuestion.categories && currentQuestion.groupItems ? (
            <GroupingTask
              categories={currentQuestion.categories}
              items={currentQuestion.groupItems}
              onComplete={(answer) => handleAnswer(JSON.stringify(answer))}
              correctAnswer={currentQuestion.groupAnswer || {}}
              disabled={showResult}
              showResult={showResult}
            />
          ) : questionType === 'multiple-correct' && currentQuestion.options ? (
            <MultipleCorrectTask
              options={currentQuestion.options}
              onComplete={(answers) => handleAnswer(JSON.stringify(answers))}
              correctAnswers={currentQuestion.multiCorrectAnswers || []}
              disabled={showResult}
              showResult={showResult}
            />
          ) : questionType === 'dialog-card' ? (
            <DialogCard
              frontText={currentQuestion.prompt}
              backText={currentQuestion.correctAnswer as string}
              onComplete={(known) => {
                setIsCorrect(known);
                setShowResult(true);
                setSelectedAnswer(known ? 'known' : 'unknown');
                if (known) {
                  soundManager.correct();
                  setCorrectCount(prev => prev + 1);
                  answerQuestion(true, currentQuestion.cardId, false, '');
                } else {
                  soundManager.incorrect();
                  answerQuestion(false, currentQuestion.cardId, false, '');
                }
              }}
              disabled={false}
            />
          ) : (
            <InputTask
              onSubmit={handleAnswer}
              correctAnswer={currentQuestion.correctAnswer as string}
              showResult={showResult}
              disabled={false}
              inputMode="year"
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

export default LessonPage;