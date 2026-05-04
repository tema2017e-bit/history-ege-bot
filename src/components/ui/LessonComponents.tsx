import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, HelpCircle, Lightbulb, History, ScrollText, ArrowUpDown } from 'lucide-react';
import { Question, HistoryCard } from '../../types';
import { ProgressBar } from './TopBar';

// ==================== ANSWER OPTIONS ====================

interface AnswerOptionsProps {
  options: string[];
  onSelect: (answer: string) => void;
  selectedAnswer: string | null;
  correctAnswer: string;
  showResult: boolean;
  disabled: boolean;
}

export const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  options,
  onSelect,
  selectedAnswer,
  correctAnswer,
  showResult,
  disabled,
}) => {
  // Используем обычные div с анимацией на CSS, без framer-motion.motion.button
  // Это критично для Telegram WebView на телефоне
  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const isSelected = selectedAnswer === option;
        const isCorrect = option === correctAnswer;
        const showCorrect = showResult && isCorrect;
        const showIncorrect = showResult && isSelected && !isCorrect;
        const isDimmed = showResult && !isSelected && !isCorrect;

        return (
          <div
            key={index}
            className={`answer-option w-full cursor-pointer select-none
              ${showCorrect ? 'correct' : ''}
              ${showIncorrect ? 'incorrect' : ''}
              ${isSelected && !showResult ? 'selected' : ''}
              ${isDimmed ? 'dimmed' : ''}
              animate-fadeIn`}
            style={{ animationDelay: `${index * 0.08}s` }}
            onClick={() => {
              if (!disabled && !showResult) {
                onSelect(option);
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!disabled && !showResult) {
                  onSelect(option);
                }
              }
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="flex-1 text-left break-words hyphens-auto text-sm leading-snug">{option}</span>
              {showCorrect && <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />}
              {showIncorrect && <X className="w-5 h-5 text-error-500 flex-shrink-0 mt-0.5" />}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ==================== INPUT TASK (универсальный: год или текст) ====================

interface InputTaskProps {
  onSubmit: (answer: string) => void;
  correctAnswer: string;
  showResult: boolean;
  disabled: boolean;
  inputMode: 'year' | 'text';
  placeholder?: string;
}

export const InputTask: React.FC<InputTaskProps> = ({
  onSubmit,
  correctAnswer,
  showResult,
  disabled,
  inputMode,
  placeholder,
}) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (inputMode === 'year') {
      // Для года — только цифры и тире
      setValue(raw.replace(/[^0-9-]/g, ''));
    } else {
      // Для текста — любое значение
      setValue(raw);
    }
  };

  const defaultPlaceholder = inputMode === 'year' ? 'Введите год...' : 'Введите ответ...';
  const inputType = inputMode === 'year' ? 'text' : 'text';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type={inputType}
        value={value}
        onChange={handleChange}
        placeholder={placeholder || defaultPlaceholder}
        className="input-field"
        disabled={disabled || showResult}
        autoFocus
        autoComplete="off"
      />
      {!showResult && (
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={!value.trim() || disabled}
        >
          Проверить
        </button>
      )}
    </form>
  );
};

// ==================== TRUE/FALSE TASK ====================

interface TrueFalseTaskProps {
  onSelect: (answer: string) => void;
  showResult: boolean;
  disabled: boolean;
  correctAnswer: string;
  selectedAnswer: string | null;
}

export const TrueFalseTask: React.FC<TrueFalseTaskProps> = ({
  onSelect,
  showResult,
  disabled,
  correctAnswer,
  selectedAnswer,
}) => {
  const buttons = [
    { value: 'true', label: 'Правда', emoji: '✅' },
    { value: 'false', label: 'Ложь', emoji: '❌' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {buttons.map((btn) => {
        const isSelected = selectedAnswer === btn.value;
        const isCorrect = btn.value === correctAnswer;
        const showCorrect = showResult && isCorrect;
        const showIncorrect = showResult && isSelected && !isCorrect;

        return (
          <div
            key={btn.value}
            className={`p-6 rounded-xl border-2 font-semibold text-lg transition-all duration-150 select-none cursor-pointer
              ${showCorrect ? 'border-primary-500 bg-primary-100 text-primary-700 dark:border-primary-400 dark:bg-primary-900/40 dark:text-primary-300' : ''}
              ${showIncorrect ? 'border-error-500 bg-error-100 text-error-700 dark:border-error-400 dark:bg-error-900/40 dark:text-error-300' : ''}
              ${!showResult && !disabled ? 'border-surface-200 bg-white hover:border-primary-300 hover:bg-primary-50 dark:border-surface-600 dark:bg-surface-800 dark:hover:border-primary-500 dark:hover:bg-primary-900/30' : ''}
              ${isSelected && !showResult ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-400 dark:border-primary-400 dark:bg-primary-900/30 dark:ring-primary-500/50' : ''}
              ${disabled || showResult ? 'opacity-90' : ''}
              animate-fadeIn`}
            style={{ animationDelay: `${buttons.indexOf(btn) * 0.08}s` }}
            onClick={() => {
              if (!disabled && !showResult) {
                onSelect(btn.value);
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!disabled && !showResult) {
                  onSelect(btn.value);
                }
              }
            }}
          >
            <div className="text-3xl mb-2">{btn.emoji}</div>
            <div className="dark:text-surface-200">{btn.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// ==================== MATCH PAIRS TASK ====================

interface MatchPairsTaskProps {
  pairs: { date: string; event: string }[];
  onComplete: (pairs: { date: string; event: string }[]) => void;
  disabled: boolean;
  showResult: boolean;
}

export const MatchPairsTask: React.FC<MatchPairsTaskProps> = ({
  pairs,
  onComplete,
  disabled,
  showResult,
}) => {
  // Перемешиваем даты и события отдельно
  const shuffledDates = React.useMemo(() => 
    [...pairs].sort(() => Math.random() - 0.5).map(p => p.date), [pairs]);
  const shuffledEvents = React.useMemo(() => 
    [...pairs].sort(() => Math.random() - 0.5).map(p => p.event), [pairs]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // date -> event
  const [matchedEvents, setMatchedEvents] = useState<Set<string>>(new Set());
  const [matchOrder, setMatchOrder] = useState<string[]>([]); // порядок создания пар (по date)

  const handleDateClick = useCallback((date: string) => {
    if (disabled || showResult || matchedEvents.has(matches[date] || '')) return;
    setSelectedDate(prev => prev === date ? null : date);
    setSelectedEvent(null);
  }, [disabled, showResult, matchedEvents, matches]);

  const handleEventClick = useCallback((event: string) => {
    if (disabled || showResult || matchedEvents.has(event)) return;
    if (!selectedDate) return;

    // Создаём пару
    const newMatches = { ...matches, [selectedDate]: event };
    const newMatchedEvents = new Set(matchedEvents);
    newMatchedEvents.add(event);
    
    setMatches(newMatches);
    setMatchedEvents(newMatchedEvents);
    setSelectedDate(null);
    setSelectedEvent(null);
    setMatchOrder(prev => [...prev, selectedDate]);

    // Если все пары составлены — завершаем
    if (Object.keys(newMatches).length === pairs.length) {
      // Преобразуем в массив пар для ответа
      const resultPairs = pairs.map(p => ({
        date: p.date,
        event: newMatches[p.date] || '',
      }));
      onComplete(resultPairs);
    }
  }, [disabled, showResult, selectedDate, matches, matchedEvents, pairs, onComplete]);

  return (
    <div className="space-y-6">
      {/* Даты (слева) */}
      <div>
        <p className="text-xs text-surface-400 uppercase tracking-wider mb-2 dark:text-surface-500">Даты</p>
        <div className="flex flex-wrap gap-2">
          {shuffledDates.map(date => {
            const isSelected = selectedDate === date;
            const isMatched = matches[date] !== undefined;
            return (
              <button
                key={date}
                onClick={() => handleDateClick(date)}
                disabled={disabled || isMatched}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all border-2
                  ${isMatched ? 'bg-primary-100 border-primary-300 text-primary-600 opacity-60 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-400' : ''}
                  ${isSelected ? 'bg-primary-500 border-primary-500 text-white ring-2 ring-primary-300 dark:bg-primary-600 dark:border-primary-500 dark:ring-primary-800' : ''}
                  ${!isSelected && !isMatched ? 'bg-white border-surface-200 text-surface-700 hover:border-primary-400 dark:bg-surface-800 dark:border-surface-600 dark:text-surface-200 dark:hover:border-primary-500' : ''}
                `}
              >
                {date}
              </button>
            );
          })}
        </div>
      </div>

      {/* События (справа) */}
      <div>
        <p className="text-xs text-surface-400 uppercase tracking-wider mb-2 dark:text-surface-500">События</p>
        <div className="flex flex-wrap gap-2">
          {shuffledEvents.map(event => {
            const isMatched = matchedEvents.has(event);
            return (
              <button
                key={event}
                onClick={() => handleEventClick(event)}
                disabled={disabled || isMatched}
                className={`px-4 py-2 rounded-lg text-sm transition-all border-2 text-left
                  ${isMatched ? 'bg-success-50 border-success-300 text-success-600 opacity-60 dark:bg-success-900/30 dark:border-success-700 dark:text-success-400' : ''}
                  ${!isMatched ? 'bg-white border-surface-200 text-surface-700 hover:border-primary-400 dark:bg-surface-800 dark:border-surface-600 dark:text-surface-200 dark:hover:border-primary-500' : ''}
                `}
              >
                {isMatched && <Check className="w-3 h-3 inline mr-1" />}
                {event}
              </button>
            );
          })}
        </div>
      </div>

      {/* Индикатор прогресса и кнопка отмены */}
      <div className="flex items-center justify-between text-sm text-surface-400 dark:text-surface-500">
        <span>Составлено: {Object.keys(matches).length}/{pairs.length}</span>
        {matchOrder.length > 0 && !showResult && (
          <button
            onClick={() => {
              const lastDate = matchOrder[matchOrder.length - 1];
              const lastEvent = matches[lastDate];
              const newMatches = { ...matches };
              delete newMatches[lastDate];
              const newMatchedEvents = new Set(matchedEvents);
              newMatchedEvents.delete(lastEvent);
              setMatches(newMatches);
              setMatchedEvents(newMatchedEvents);
              setMatchOrder(prev => prev.slice(0, -1));
            }}
            className="text-error-500 hover:text-error-600 text-xs font-medium underline dark:text-error-400 dark:hover:text-error-300"
          >
            ↩ Отменить последнюю
          </button>
        )}
      </div>
    </div>
  );
};

// ==================== TIMELINE ORDER TASK ====================

interface TimelineOrderTaskProps {
  items: string[]; // Перемешанные события
  onComplete: (ordered: string[]) => void;
  disabled: boolean;
  showResult: boolean;
}

export const TimelineOrderTask: React.FC<TimelineOrderTaskProps> = ({
  items,
  onComplete,
  disabled,
  showResult,
}) => {
  const [order, setOrder] = useState<string[]>([]);
  const [remainingItems, setRemainingItems] = useState<string[]>(items);

  const handleItemClick = useCallback((item: string) => {
    if (disabled || showResult) return;
    setOrder(prev => [...prev, item]);
    setRemainingItems(prev => prev.filter(i => i !== item));
  }, [disabled, showResult]);

  const handleUndo = useCallback(() => {
    if (disabled || showResult || order.length === 0) return;
    const lastItem = order[order.length - 1];
    setOrder(prev => prev.slice(0, -1));
    setRemainingItems(prev => [...prev, lastItem]);
  }, [disabled, showResult, order]);

  // Когда все в порядке — авто-подтверждение
  useEffect(() => {
    if (order.length === items.length && !showResult && !disabled) {
      onComplete(order);
    }
  }, [order.length, items.length, showResult, disabled, onComplete, order]);

  return (
    <div className="space-y-4">
      {/* Упорядоченный список (результат) */}
      <div>
        <p className="text-xs text-surface-400 uppercase tracking-wider mb-2 flex items-center gap-1 dark:text-surface-500">
          <ArrowUpDown className="w-3 h-3" /> Ваш порядок
        </p>
        <div className="bg-primary-50 rounded-xl p-3 min-h-[80px] space-y-1 dark:bg-primary-900/20">
          {order.length === 0 ? (
            <p className="text-surface-300 text-sm text-center py-2 dark:text-surface-500">Нажимайте на события в нужном порядке</p>
          ) : (
            order.map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 text-sm dark:bg-surface-800 dark:text-surface-200">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 font-bold text-xs flex items-center justify-center flex-shrink-0 dark:bg-primary-900/40 dark:text-primary-300">
                  {i + 1}
                </span>
                <span>{item}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Оставшиеся события */}
      <div>
        <p className="text-xs text-surface-400 uppercase tracking-wider mb-2 dark:text-surface-500">Осталось</p>
        <div className="flex flex-wrap gap-2">
          {remainingItems.map(item => (
            <button
              key={item}
              onClick={() => handleItemClick(item)}
              disabled={disabled || showResult}
              className="px-3 py-2 rounded-lg bg-white border-2 border-surface-200 text-surface-700 text-sm
                hover:border-primary-400 hover:bg-primary-50 transition-all dark:bg-surface-800 dark:border-surface-600 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:bg-primary-900/30"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Кнопка отмены */}
      {order.length > 0 && !showResult && (
        <button
          onClick={handleUndo}
          className="text-sm text-surface-400 hover:text-surface-600 transition-colors dark:text-surface-500 dark:hover:text-surface-300"
        >
          ↩ Отменить последний
        </button>
      )}
    </div>
  );
};

// ==================== CONTEXT BANNER ====================
// Показывает подсказку с веком/эпохой до ответа

interface ContextBannerProps {
  period?: string;
  eraName?: string;
  ruler?: string;
}

export const ContextBanner: React.FC<ContextBannerProps> = ({ period, eraName, ruler }) => {
  if (!period && !eraName && !ruler) return null;
  
  const parts: string[] = [];
  if (period) parts.push(`📅 ${period}`);
  if (eraName) parts.push(`🏛 ${eraName}`);
  if (ruler) parts.push(`👑 ${ruler}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary-50 to-surface-50 rounded-xl p-3 mb-4 border border-primary-100 dark:from-primary-900/30 dark:to-surface-800 dark:border-primary-800/50"
    >
      <div className="flex items-center gap-2 text-xs text-surface-500 mb-1 dark:text-surface-400">
        <History className="w-3.5 h-3.5" />
        <span>Контекст</span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-surface-700 dark:text-surface-200">
        {parts.map((part, i) => (
          <span key={i}>{part}</span>
        ))}
      </div>
    </motion.div>
  );
};

// ==================== FEEDBACK BAR ====================

interface FeedbackBarProps {
  correct: boolean;
  explanation: string;
  onContinue: () => void;
  showHint?: boolean;
  onShowDetail?: () => void;
}

export const FeedbackBar: React.FC<FeedbackBarProps> = ({
  correct,
  explanation,
  onContinue,
  showHint,
  onShowDetail,
}) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Скроллим чуть выше бара, чтобы кнопка была видна
    const timer = setTimeout(() => {
      if (barRef.current) {
        const rect = barRef.current.getBoundingClientRect();
        const offset = window.innerHeight - rect.top;
        if (rect.bottom > window.innerHeight) {
          window.scrollBy({ top: offset + 200, behavior: 'smooth' });
        } else {
          // Даже если влезло — докручиваем до нижней части бара + запас
          window.scrollBy({ top: rect.height + 200, behavior: 'smooth' });
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      ref={barRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      className={`p-4 rounded-xl mt-4 border
        ${correct ? 'bg-primary-50 dark:bg-primary-900/40 border-primary-200 dark:border-primary-800' : 'bg-error-50 dark:bg-error-900/40 border-error-200 dark:border-error-800'}
      `}
    >
      <div className="max-w-lg mx-auto">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
            ${correct ? 'bg-primary-500' : 'bg-error-500'}
          `}>
            {correct ? (
              <Check className="w-5 h-5 text-white" />
            ) : (
              <X className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-semibold ${correct ? 'text-primary-700 dark:text-primary-300' : 'text-error-700 dark:text-error-300'}`}>
              {correct ? 'Отлично! 🎉' : 'Не совсем...'}
            </p>
            <div className="text-sm text-surface-600 mt-1 whitespace-pre-line leading-relaxed dark:text-surface-300">
              {explanation.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < explanation.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {showHint && onShowDetail && (
            <button
              onClick={onShowDetail}
              className="flex-1 py-3 rounded-xl font-semibold transition-all bg-surface-200 hover:bg-surface-300 text-surface-700 dark:bg-surface-700 dark:hover:bg-surface-600 dark:text-surface-200"
            >
              <Lightbulb className="w-4 h-4 inline mr-1" />
              Подробнее
            </button>
          )}
          <button
            onClick={onContinue}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all
              ${correct 
                ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                : 'bg-error-500 hover:bg-error-600 text-white'
              }
            `}
          >
            Продолжить
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== LESSON HEADER ====================

interface LessonHeaderProps {
  current: number;
  total: number;
  hearts: number;
  onClose: () => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  current,
  total,
  hearts,
  onClose,
}) => {
  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-surface-100 px-4 py-3 dark:bg-surface-900/90 dark:border-surface-700">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-100 transition-colors dark:hover:bg-surface-700"
          >
            <X className="w-5 h-5 text-surface-500 dark:text-surface-400" />
          </button>
          <ProgressBar current={current} total={total} height="h-2.5" />
          <div className="flex items-center gap-1 text-error-500">
            <span className="text-sm font-semibold">{hearts}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== GROUPING TASK (категоризация) ====================

interface GroupingTaskProps {
  categories: string[];
  items: string[];
  onComplete: (answer: Record<string, string[]>) => void;
  correctAnswer: Record<string, string[]>;
  disabled: boolean;
  showResult: boolean;
}

export const GroupingTask: React.FC<GroupingTaskProps> = ({
  categories,
  items,
  onComplete,
  correctAnswer,
  disabled,
  showResult,
}) => {
  const [groups, setGroups] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    categories.forEach(c => { initial[c] = []; });
    return initial;
  });
  const [remaining, setRemaining] = useState<string[]>(items);
  const [dragItem, setDragItem] = useState<string | null>(null);

  const moveItemToCategory = useCallback((item: string, targetCat: string) => {
    if (disabled || showResult) return;

    // Удаляем из всех групп и из remaining
    setGroups(prev => {
      const next = { ...prev };
      for (const cat of Object.keys(next)) {
        next[cat] = next[cat].filter(i => i !== item);
      }
      return {
        ...next,
        [targetCat]: [...(next[targetCat] || []), item],
      };
    });
    setRemaining(prev => prev.filter(i => i !== item));
  }, [disabled, showResult]);

  const moveItemToRemaining = useCallback((item: string) => {
    if (disabled || showResult) return;
    setGroups(prev => {
      const next = { ...prev };
      for (const cat of Object.keys(next)) {
        next[cat] = next[cat].filter(i => i !== item);
      }
      return next;
    });
    setRemaining(prev => [...prev, item]);
  }, [disabled, showResult]);

  // click: циклический перенос по категориям
  // remaining → cat[0] → cat[1] → cat[2] → ... → cat[n-1] → remaining
  const handleItemClick = useCallback((item: string) => {
    if (disabled || showResult) return;

    if (remaining.includes(item)) {
      // Из пула → в первую категорию
      moveItemToCategory(item, categories[0]);
      return;
    }

    // Найти текущую категорию элемента
    let currentCatIndex = -1;
    for (let i = 0; i < categories.length; i++) {
      if ((groups[categories[i]] || []).includes(item)) {
        currentCatIndex = i;
        break;
      }
    }

    if (currentCatIndex === -1) return; // не найдено

    if (currentCatIndex < categories.length - 1) {
      // Перенос в следующую категорию
      moveItemToCategory(item, categories[currentCatIndex + 1]);
    } else {
      // Последняя категория → обратно в remaining
      moveItemToRemaining(item);
    }
  }, [disabled, showResult, remaining, categories, groups, moveItemToCategory, moveItemToRemaining]);

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent, item: string) => {
    if (disabled || showResult) return;
    e.dataTransfer.setData('text/plain', item);
    e.dataTransfer.effectAllowed = 'move';
    setDragItem(item);
  }, [disabled, showResult]);

  const handleDragEnd = useCallback(() => {
    setDragItem(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDropOnCategory = useCallback((e: React.DragEvent, cat: string) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    if (item) {
      moveItemToCategory(item, cat);
    }
    setDragItem(null);
  }, [moveItemToCategory]);

  const handleDropOnRemaining = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    if (item) {
      moveItemToRemaining(item);
    }
    setDragItem(null);
  }, [moveItemToRemaining]);

  // Когда все распределено — авто-подтверждение по кнопке
  const allDistributed = remaining.length === 0;
  const handleConfirm = useCallback(() => {
    if (allDistributed && !showResult && !disabled) {
      onComplete(groups);
    }
  }, [allDistributed, showResult, disabled, onComplete, groups]);

  return (
    <div className="space-y-4">
      {/* Элементы для распределения */}
      <div>
        <p className="text-xs text-surface-400 uppercase tracking-wider mb-2 dark:text-surface-500">
          Распределите по категориям
        </p>
        <div
          className={`flex flex-wrap gap-2 mb-3 min-h-[40px] p-2 rounded-xl border-2 border-dashed transition-colors
            ${remaining.length === 0
              ? 'border-success-300 bg-success-50/50 dark:border-success-700 dark:bg-success-900/20'
              : 'border-surface-200 dark:border-surface-600'
            }`}
          onDragOver={handleDragOver}
          onDrop={handleDropOnRemaining}
        >
          {remaining.map(item => (
            <div
              key={item}
              draggable={!disabled && !showResult}
              onDragStart={(e) => handleDragStart(e, item)}
              onDragEnd={handleDragEnd}
              onClick={() => handleItemClick(item)}
              className={`px-3 py-1.5 rounded-lg bg-white border border-surface-200 text-sm cursor-grab
                hover:border-primary-400 hover:bg-primary-50 hover:shadow-sm
                active:cursor-grabbing active:shadow-md
                transition-all select-none
                dark:bg-surface-800 dark:border-surface-600
                dark:hover:border-primary-500 dark:hover:bg-primary-900/30
                ${dragItem === item ? 'opacity-50 scale-95' : ''}
                ${disabled || showResult ? 'cursor-default opacity-60' : ''}
              `}
            >
              {item}
            </div>
          ))}
          {remaining.length === 0 && (
            <p className="text-xs text-success-500 dark:text-success-400 w-full text-center py-1">
              Все распределено ✓
            </p>
          )}
        </div>
      </div>

      {/* Категории (drop zones) */}
      <div className="grid grid-cols-1 gap-3">
        {categories.map(cat => {
          const catItems = groups[cat] || [];
          const isDragOver = false;

          return (
            <div
              key={cat}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnCategory(e, cat)}
              className={`bg-surface-50 rounded-xl p-3 border-2 border-dashed transition-all
                dark:bg-surface-800/50
                ${catItems.length > 0
                  ? 'border-primary-200 dark:border-primary-700'
                  : 'border-surface-200 dark:border-surface-600'
                }
                ${disabled || showResult ? '' : 'hover:border-primary-400 dark:hover:border-primary-500'}
              `}
            >
              <p className="text-sm font-semibold text-surface-700 mb-2 dark:text-surface-200">
                📁 {cat}
              </p>
              <div className="flex flex-wrap gap-1.5 min-h-[36px]">
                {catItems.map(item => (
                  <div
                    key={item}
                    draggable={!disabled && !showResult}
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleItemClick(item)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all select-none
                      cursor-grab active:cursor-grabbing
                      ${showResult && correctAnswer[cat]?.includes(item)
                        ? 'bg-success-100 text-success-700 border border-success-300 dark:bg-success-900/30 dark:text-success-400'
                        : showResult && !correctAnswer[cat]?.includes(item)
                          ? 'bg-error-100 text-error-700 border border-error-300 dark:bg-error-900/30 dark:text-error-400 line-through'
                          : 'bg-primary-100 text-primary-700 border border-primary-200 dark:bg-primary-900/40 dark:text-primary-300 hover:bg-primary-200'
                      }
                      ${dragItem === item ? 'opacity-50 scale-95' : ''}
                      ${disabled || showResult ? 'cursor-default opacity-60' : ''}
                    `}
                  >
                    {item}
                    {!showResult && (
                      <span className="ml-1 text-primary-400 text-xs" title="Вернуть">↩</span>
                    )}
                  </div>
                ))}
                {catItems.length === 0 && (
                  <p className="text-xs text-surface-400 italic dark:text-surface-500 py-1">
                    Перетащите сюда элементы
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Кнопка подтверждения */}
      {allDistributed && !showResult && !disabled && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleConfirm}
          className="w-full py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg"
        >
          Подтвердить ✓
        </motion.button>
      )}

      {/* Прогресс */}
      <div className="text-xs text-surface-400 dark:text-surface-500">
        Распределено: {Object.values(groups).reduce((a, b) => a + b.length, 0)}/{items.length}
      </div>
    </div>
  );
};

// ==================== MULTIPLE CORRECT TASK (выбери все верные) ====================

interface MultipleCorrectTaskProps {
  options: string[];
  onComplete: (answers: string[]) => void;
  correctAnswers: string[];
  disabled: boolean;
  showResult: boolean;
}

export const MultipleCorrectTask: React.FC<MultipleCorrectTaskProps> = ({
  options,
  onComplete,
  correctAnswers,
  disabled,
  showResult,
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleOption = useCallback((opt: string) => {
    if (disabled || showResult) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(opt)) next.delete(opt);
      else next.add(opt);
      return next;
    });
  }, [disabled, showResult]);

  return (
    <div className="space-y-3">
      <p className="text-xs text-surface-400 dark:text-surface-500">
        Выберите <strong>все</strong> подходящие варианты ({correctAnswers.length} правильных)
      </p>
      {options.map((opt, i) => {
        const isSelected = selected.has(opt);
        const isCorrect = correctAnswers.includes(opt);
        const showCorrect = showResult && isCorrect;
        const showIncorrect = showResult && isSelected && !isCorrect;
        const isMissed = showResult && !isSelected && isCorrect;

        return (
          <motion.button
            key={i}
            onClick={() => toggleOption(opt)}
            disabled={disabled || showResult}
            className={`answer-option w-full ${
              showCorrect ? 'correct' : ''
            } ${showIncorrect ? 'incorrect' : ''} ${
              isSelected && !showResult ? 'selected' : ''
            } ${isMissed ? 'opacity-60 border-dashed border-primary-300 dark:border-primary-700' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center justify-between">
              <span className="flex-1 text-left">{opt}</span>
              <div className="flex items-center gap-1">
                {showCorrect && <Check className="w-5 h-5 text-primary-500" />}
                {showIncorrect && <X className="w-5 h-5 text-error-500" />}
                {isMissed && <span className="text-xs text-primary-400 dark:text-primary-500">должно быть</span>}
                {!showResult && (
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                    ${isSelected ? 'bg-primary-500 border-primary-500' : 'border-surface-300 dark:border-surface-500'}`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
      {!showResult && (
        <div className="flex gap-2">
          <button
            onClick={() => setSelected(new Set())}
            className="flex-1 py-2.5 rounded-xl text-sm bg-surface-100 hover:bg-surface-200 text-surface-600 transition-all dark:bg-surface-700 dark:hover:bg-surface-600 dark:text-surface-300"
          >
            Сбросить
          </button>
          <button
            onClick={() => onComplete(Array.from(selected))}
            disabled={selected.size === 0}
            className="flex-1 py-2.5 rounded-xl text-sm bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-all disabled:opacity-50"
          >
            {selected.size > 0 ? `Ответить (${selected.size})` : 'Выберите варианты'}
          </button>
        </div>
      )}
    </div>
  );
};

// ==================== DIALOG CARD (карточка-переворот) ====================

interface DialogCardProps {
  frontText: string;
  backText: string;
  onComplete: (known: boolean) => void;
  disabled: boolean;
}

export const DialogCard: React.FC<DialogCardProps> = ({
  frontText,
  backText,
  onComplete,
  disabled,
}) => {
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleFlip = () => {
    if (!disabled && !finished) setFlipped(true);
  };

  const handleResult = (known: boolean) => {
    if (finished) return;
    setFinished(true);
    onComplete(known);
  };

  return (
    <div className="perspective-1000">
      <motion.div
        className="relative w-full min-h-[200px] cursor-pointer"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
        onClick={!flipped ? handleFlip : undefined}
      >
        {/* Передняя сторона */}
        <div
          className={`absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 flex flex-col items-center justify-center text-white shadow-lg ${
            flipped ? 'invisible' : ''
          }`}
        >
          <p className="text-3xl mb-2">🧠</p>
          <p className="text-lg font-semibold text-center">{frontText}</p>
          {!flipped && (
            <p className="text-xs mt-4 text-primary-200">Нажмите, чтобы перевернуть</p>
          )}
        </div>

        {/* Задняя сторона */}
        <div
          className={`absolute inset-0 backface-hidden rounded-xl bg-white dark:bg-surface-800 p-6 flex flex-col items-center justify-center shadow-lg border border-surface-200 dark:border-surface-600 ${
            !flipped ? 'invisible' : ''
          }`}
          style={{ transform: 'rotateY(180deg)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-base font-medium text-surface-800 dark:text-surface-100 text-center mb-4">
            {backText}
          </p>
          {!finished && (
            <div className="flex gap-3 w-full">
              <button
                onClick={() => handleResult(false)}
                disabled={disabled}
                className="flex-1 py-2.5 rounded-xl bg-error-100 hover:bg-error-200 text-error-700 font-semibold text-sm transition-all dark:bg-error-900/40 dark:hover:bg-error-900/60 dark:text-error-400"
              >
                Не знаю
              </button>
              <button
                onClick={() => handleResult(true)}
                disabled={disabled}
                className="flex-1 py-2.5 rounded-xl bg-success-100 hover:bg-success-200 text-success-700 font-semibold text-sm transition-all dark:bg-success-900/40 dark:hover:bg-success-900/60 dark:text-success-400"
              >
                Знаю
              </button>
            </div>
          )}
          {finished && (
            <div className="flex items-center gap-2 text-success-600 dark:text-success-400">
              <Check className="w-5 h-5" />
              <span className="font-semibold">Готово</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* CSS для 3D flip */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      `}</style>
    </div>
  );
};