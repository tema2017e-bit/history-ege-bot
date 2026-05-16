import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, RotateCw, Trophy, Star, Zap, Clock, Target } from 'lucide-react';
import { useStore } from '../store/useStore';
import { eras, historyCards } from '../data/historyDates';
import { normalizeYearAnswer } from '../utils/answerNormalizer';
import { soundManager } from '../utils/sounds';

// Типы заданий
type TaskType = 'select-date' | 'input-year' | 'match-pairs' | 'timeline' | 'odd-one-out' | 'fill-blank';

interface DateTask {
  id: string;
  type: TaskType;
  eraId: string;
  prompt: string;
  correctAnswer: string;
  options?: string[];
  pairs?: { date: string; event: string }[];
  timelineItems?: string[];
  explanation: string;
}

// Генератор заданий из карточек эпохи
function generateTasks(eraId: string, count: number = 10): DateTask[] {
  const eraCards = historyCards.filter(c => c.era === eraId);
  if (eraCards.length < 2) return [];

  const tasks: DateTask[] = [];
  const shuffled = [...eraCards].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const card = shuffled[i];
    const taskType = i % 6;

    switch (taskType) {
      case 0: // select-date
      case 1: {
        // Выбор даты для события
        const wrongDates = eraCards
          .filter(c => c.id !== card.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(c => c.year);
        const options = [card.year, ...wrongDates].sort(() => Math.random() - 0.5);
        tasks.push({
          id: `task-${card.id}-select`,
          type: 'select-date',
          eraId,
          prompt: `В каком году произошло: «${card.event}»?`,
          correctAnswer: card.year,
          options,
          explanation: `${card.event} — ${card.year} год. ${card.period}.`,
        });
        break;
      }
      case 2: {
        // Ввод года
        tasks.push({
          id: `task-${card.id}-input`,
          type: 'input-year',
          eraId,
          prompt: `Введите год: ${card.event}`,
          correctAnswer: card.year,
          explanation: `${card.event} — ${card.year} год. ${card.period}.`,
        });
        break;
      }
      case 3: {
        // Найди лишнее
        const sameEraCards = eraCards.filter(c => c.id !== card.id);
        if (sameEraCards.length >= 3) {
          const otherCards = sameEraCards.sort(() => Math.random() - 0.5).slice(0, 3);
          const allCards = [card, ...otherCards].sort(() => Math.random() - 0.5);
          tasks.push({
            id: `task-${card.id}-odd`,
            type: 'odd-one-out',
            eraId,
            prompt: `Какое событие произошло в другом веке?`,
            correctAnswer: card.event,
            options: allCards.map(c => c.event),
            explanation: `${card.event} — ${card.year} год, а остальные события произошли в другом веке.`,
          });
        }
        break;
      }
      case 4: {
        // Заполни пропуск
        const shortEvent = card.event.length > 50 ? card.event.substring(0, 50) + '...' : card.event;
        tasks.push({
          id: `task-${card.id}-blank`,
          type: 'fill-blank',
          eraId,
          prompt: `Событие «${shortEvent}» произошло в _____ году.`,
          correctAnswer: card.year,
          explanation: `${card.event} — ${card.year} год.`,
        });
        break;
      }
      case 5: {
        // Хронология
        const nearbyCards = eraCards
          .filter(c => c.id !== card.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        if (nearbyCards.length >= 2) {
          const allCards = [card, ...nearbyCards].sort(() => Math.random() - 0.5);
          tasks.push({
            id: `task-${card.id}-timeline`,
            type: 'timeline',
            eraId,
            prompt: `Расположите события в хронологическом порядке (от раннего к позднему):`,
            correctAnswer: allCards.map(c => c.event).join('|||'),
            timelineItems: allCards.map(c => `${c.year} — ${c.event}`),
            explanation: `Правильный порядок:\n${allCards.map((c, i) => `${i + 1}. ${c.year} — ${c.event}`).join('\n')}`,
          });
        }
        break;
      }
    }
  }

  return tasks;
}

const DateTrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const { subscription } = useStore();
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [tasks, setTasks] = useState<DateTask[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [timelineOrder, setTimelineOrder] = useState<string[]>([]);

  const hasSubscription = subscription;

  const startTraining = useCallback((eraId: string) => {
    const generated = generateTasks(eraId, 10);
    setTasks(generated);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setInputValue('');
    setShowResult(false);
    setCorrectCount(0);
    setIsComplete(false);
    setTimelineOrder([]);
    setSelectedEra(eraId);
  }, []);

  const currentTask = tasks[currentIndex];

  const handleAnswer = useCallback((answer: string) => {
    if (showResult || !currentTask) return;

    let correct = false;
    const normalizedAnswer = normalizeYearAnswer(answer);
    const normalizedCorrect = normalizeYearAnswer(currentTask.correctAnswer);

    switch (currentTask.type) {
      case 'select-date':
      case 'odd-one-out':
      case 'fill-blank':
        correct = normalizedAnswer === normalizedCorrect;
        break;
      case 'input-year':
        correct = normalizedAnswer === normalizedCorrect;
        break;
      case 'timeline':
        correct = answer === currentTask.correctAnswer;
        break;
      default:
        correct = normalizedAnswer === normalizedCorrect;
    }

    setSelectedAnswer(answer);
    setShowResult(true);
    setIsCorrect(correct);

    if (correct) {
      soundManager.correct();
      setCorrectCount(prev => prev + 1);
    } else {
      soundManager.incorrect();
    }
  }, [showResult, currentTask]);

  const handleContinue = useCallback(() => {
    if (currentIndex < tasks.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setInputValue('');
      setShowResult(false);
      setTimelineOrder([]);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, tasks.length]);

  const handleTimelineSubmit = useCallback(() => {
    if (timelineOrder.length === currentTask.timelineItems?.length) {
      const answer = timelineOrder.join('|||');
      handleAnswer(answer);
    }
  }, [timelineOrder, currentTask, handleAnswer]);

  // Экран выбора эпохи
  if (!selectedEra) {
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

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-2">
              📅 Тренировка дат
            </h1>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              Выбери эпоху и тренируйся определять даты событий
            </p>
          </motion.div>

          <div className="space-y-3">
            {eras.map((era, index) => {
              const eraCards = historyCards.filter(c => c.era === era.id);
              const isLocked = index >= 5 && !hasSubscription;

              return (
                <motion.button
                  key={era.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => !isLocked && startTraining(era.id)}
                  disabled={isLocked}
                  className={`w-full text-left card ${isLocked ? 'opacity-50' : 'card-hover'} dark:bg-surface-800`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: `${era.color}20` }}
                    >
                      {era.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-surface-800 dark:text-surface-100">{era.name}</h3>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        {era.yearRange} • {eraCards.length} дат
                      </p>
                    </div>
                    {isLocked && <span className="text-xs text-surface-400">🔒</span>}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Экран результатов
  if (isComplete) {
    const accuracy = Math.round((correctCount / tasks.length) * 100);
    const era = eras.find(e => e.id === selectedEra);

    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-2">
            Тренировка завершена!
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mb-6">{era?.name}</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-primary-50 rounded-xl p-3 dark:bg-primary-900/30">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{correctCount}/{tasks.length}</div>
              <div className="text-xs text-surface-500">Верно</div>
            </div>
            <div className="bg-surface-100 rounded-xl p-3 dark:bg-surface-700">
              <div className="text-2xl font-bold text-surface-700 dark:text-surface-200">{accuracy}%</div>
              <div className="text-xs text-surface-500">Точность</div>
            </div>
            <div className="bg-gold-50 rounded-xl p-3 dark:bg-gold-900/30">
              <div className="text-2xl font-bold text-gold-600 dark:text-gold-400">{correctCount * 5}</div>
              <div className="text-xs text-surface-500">XP</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => startTraining(selectedEra!)}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Ещё раз
            </button>
            <button
              onClick={() => setSelectedEra(null)}
              className="btn-secondary flex-1"
            >
              К эпохам
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Экран задания
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <div className="max-w-lg mx-auto px-4 py-6 pb-40">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedEra(null)}
            className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:text-surface-400"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-surface-500">{currentIndex + 1}/{tasks.length}</span>
            <span className="text-sm text-primary-500 font-medium">✓ {correctCount}</span>
          </div>
        </div>

        {/* Прогресс */}
        <div className="progress-bar mb-6">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentIndex + 1) / tasks.length) * 100}%` }}
          />
        </div>

        {/* Задание */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card"
          >
            {/* Тип задания */}
            <div className="mb-4">
              <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2 py-1 rounded-full dark:bg-primary-900/30">
                {currentTask.type === 'select-date' && '📅 Выбери дату'}
                {currentTask.type === 'input-year' && '✍️ Введи год'}
                {currentTask.type === 'odd-one-out' && '🔍 Найди лишнее'}
                {currentTask.type === 'fill-blank' && '✏️ Заполни пропуск'}
                {currentTask.type === 'timeline' && '📊 Хронология'}
              </span>
            </div>

            <h2 className="text-lg font-bold text-surface-800 dark:text-surface-100 mb-6">
              {currentTask.prompt}
            </h2>

            {/* Варианты ответов */}
            {(currentTask.type === 'select-date' || currentTask.type === 'odd-one-out') && currentTask.options && (
              <div className="space-y-3">
                {currentTask.options.map((option, i) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrectOption = normalizeYearAnswer(option) === normalizeYearAnswer(currentTask.correctAnswer);
                  const showCorrect = showResult && isCorrectOption;
                  const showIncorrect = showResult && isSelected && !isCorrectOption;

                  return (
                    <button
                      key={i}
                      onClick={() => !showResult && handleAnswer(option)}
                      disabled={showResult}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        showCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                        showIncorrect ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                        isSelected ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' :
                        'border-surface-200 hover:border-primary-300 dark:border-surface-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{option}</span>
                        {showCorrect && <Check className="w-5 h-5 text-green-500" />}
                        {showIncorrect && <X className="w-5 h-5 text-red-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Ввод года */}
            {currentTask.type === 'input-year' && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value.replace(/[^0-9–—-]/g, ''))}
                  placeholder="Введите год..."
                  className="input-field text-center text-xl"
                  disabled={showResult}
                  autoFocus
                />
                {!showResult && (
                  <button
                    onClick={() => handleAnswer(inputValue)}
                    disabled={!inputValue.trim()}
                    className="btn-primary w-full"
                  >
                    Проверить
                  </button>
                )}
                {showResult && (
                  <div className={`text-center p-4 rounded-xl ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    {isCorrect ? (
                      <span className="text-green-600 font-medium">✓ Верно!</span>
                    ) : (
                      <span className="text-red-600 font-medium">✗ Правильный ответ: {currentTask.correctAnswer}</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Заполни пропуск */}
            {currentTask.type === 'fill-blank' && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value.replace(/[^0-9–—-]/g, ''))}
                  placeholder="Введите год..."
                  className="input-field text-center text-xl"
                  disabled={showResult}
                  autoFocus
                />
                {!showResult && (
                  <button
                    onClick={() => handleAnswer(inputValue)}
                    disabled={!inputValue.trim()}
                    className="btn-primary w-full"
                  >
                    Проверить
                  </button>
                )}
                {showResult && (
                  <div className={`text-center p-4 rounded-xl ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    {isCorrect ? (
                      <span className="text-green-600 font-medium">✓ Верно!</span>
                    ) : (
                      <span className="text-red-600 font-medium">✗ Правильный ответ: {currentTask.correctAnswer}</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Хронология */}
            {currentTask.type === 'timeline' && currentTask.timelineItems && (
              <div className="space-y-3">
                <p className="text-sm text-surface-500">Нажимайте на события в правильном порядке:</p>
                <div className="space-y-2">
                  {currentTask.timelineItems.map((item, i) => {
                    const isSelected = timelineOrder.includes(item);
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (!showResult) {
                            if (isSelected) {
                              setTimelineOrder(prev => prev.filter(x => x !== item));
                            } else {
                              setTimelineOrder(prev => [...prev, item]);
                            }
                          }
                        }}
                        disabled={showResult}
                        className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                          isSelected ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' :
                          'border-surface-200 hover:border-primary-300 dark:border-surface-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isSelected && <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">{timelineOrder.indexOf(item) + 1}</span>}
                          <span className="text-sm">{item}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {!showResult && (
                  <button
                    onClick={handleTimelineSubmit}
                    disabled={timelineOrder.length !== currentTask.timelineItems.length}
                    className="btn-primary w-full"
                  >
                    Проверить порядок
                  </button>
                )}
                {showResult && (
                  <div className={`text-center p-4 rounded-xl ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    {isCorrect ? (
                      <span className="text-green-600 font-medium">✓ Верно!</span>
                    ) : (
                      <span className="text-red-600 font-medium">✗ Неправильный порядок</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Объяснение */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800"
              >
                <p className="text-sm text-surface-600 dark:text-surface-300 whitespace-pre-line">
                  {currentTask.explanation}
                </p>
              </motion.div>
            )}

            {/* Кнопка продолжения */}
            {showResult && (
              <button
                onClick={handleContinue}
                className="btn-primary w-full mt-4"
              >
                {currentIndex < tasks.length - 1 ? 'Следующее задание →' : 'Завершить'}
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DateTrainingPage;