import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Flame, Star, Moon, Sun } from 'lucide-react';
import { useStore } from '../../store/useStore';

// ==================== TOP BAR ====================

export const TopBar: React.FC = () => {
  const xp = useStore(s => s.xp);
  const streak = useStore(s => s.streak);
  const hearts = useStore(s => s.hearts);
  const maxHearts = useStore(s => s.maxHearts);
  const level = useStore(s => s.level);
  const theme = useStore(s => s.theme);
  const toggleTheme = useStore(s => s.toggleTheme);

  const [timerStr, setTimerStr] = useState('00:00');

  // Обновляем таймер каждую секунду и восстанавливаем сердца когда время пришло
  useEffect(() => {
    const update = () => {
      const state = useStore.getState();
      const ms = state.getTimeUntilNextHeart();
      // Если таймер дошёл до 0 и сердца не полные — восстанавливаем
      if (ms <= 0 && state.hearts < state.maxHearts) {
        // Используем setInterval из store, он срабатывает раз в минуту.
        // Форсируем восстановление вручную:
        const now = Date.now();
        const lastAt = state.lastHeartRecoveryAt || now;
        const elapsed = now - lastAt;
        const heartsToAdd = Math.floor(elapsed / 1800000); // 30 мин
        if (heartsToAdd > 0) {
          const newHearts = Math.min(state.maxHearts, state.hearts + heartsToAdd);
          const actualAdded = newHearts - state.hearts;
          useStore.setState({
            hearts: newHearts,
            lastHeartRecoveryAt: lastAt + actualAdded * 1800000,
          });
        }
      }
      setTimerStr(state.formatHeartTimer());
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const showTimer = hearts < maxHearts;

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-surface-100 px-3 sm:px-4 py-2 sm:py-3 dark:bg-surface-900/80 dark:border-surface-700">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        {/* Level + XP */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
              {level}
            </div>
          </div>
          <div className="flex-col hidden xs:flex sm:flex">
            <span className="text-[10px] sm:text-xs font-medium text-surface-500 leading-tight">Уровень</span>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold-500 fill-gold-500" />
              <span className="text-[11px] sm:text-sm font-bold text-surface-700 dark:text-surface-200 whitespace-nowrap">{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Streak — горит только если > 0 */}
        <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex-shrink-0 ${streak > 0 ? 'bg-orange-50' : 'bg-surface-100 dark:bg-surface-700'}`}>
          <Flame className={`w-4 sm:w-5 h-4 sm:h-5 ${streak > 0 ? 'text-orange-500' : 'text-surface-300 dark:text-surface-600'}`} />
          <span className={`text-xs sm:text-sm font-bold ${streak > 0 ? 'text-orange-600' : 'text-surface-400 dark:text-surface-500'}`}>{streak}</span>
        </div>

        {/* Right: Theme Toggle + Hearts */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl bg-surface-100 hover:bg-surface-200 transition-colors dark:bg-surface-700 dark:hover:bg-surface-600"
            aria-label="Переключить тему"
          >
            {theme === 'light'
              ? <Moon className="w-4 sm:w-5 h-4 sm:h-5 text-surface-600 dark:text-surface-300" />
              : <Sun className="w-4 sm:w-5 h-4 sm:h-5 text-surface-300" />
            }
          </button>

          {/* Hearts */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="flex items-center gap-px sm:gap-0.5">
              {Array.from({ length: maxHearts }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{ scale: i < hearts ? 1 : 0.8, opacity: i < hearts ? 1 : 0.3 }}
                >
                  <Heart className={`w-3.5 sm:w-4.5 h-3.5 sm:h-4.5 ${i < hearts ? 'text-error-500 fill-error-500' : 'text-surface-300'}`} />
                </motion.div>
              ))}
            </div>
            {showTimer && (
              <span className="text-[10px] sm:text-xs text-surface-400 tabular-nums hidden xs:inline" title="1 сердце каждые 30 минут">
                {timerStr}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== PROGRESS BAR ====================

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current, total, color = 'bg-primary-500', height = 'h-3', showLabel = false,
}) => {
  const percentage = Math.min((current / total) * 100, 100);
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-surface-500 mb-1">
          <span>{current}</span><span>{total}</span>
        </div>
      )}
      <div className={`w-full ${height} rounded-full bg-surface-200 overflow-hidden`}>
        <motion.div
          className={`${height} rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// ==================== HEARTS INDICATOR ====================

interface HeartsIndicatorProps {
  current: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
}

export const HeartsIndicator: React.FC<HeartsIndicatorProps> = ({ current, max, size = 'md' }) => {
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: i < current ? 1 : 0.7,
            opacity: i < current ? 1 : 0.3,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Heart className={`${sizeClasses[size]} ${i < current ? 'text-error-500 fill-error-500' : 'text-surface-300'}`} />
        </motion.div>
      ))}
    </div>
  );
};

// ==================== STREAK BADGE ====================

interface StreakBadgeProps {
  streak: number;
  bestStreak?: number;
}

export const StreakBadgeComponent: React.FC<StreakBadgeProps> = ({ streak, bestStreak }) => (
  <div className="flex flex-col items-center">
    <motion.div animate={streak > 0 ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 0.5, repeat: streak > 0 ? Infinity : 0, repeatDelay: 2 }}>
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
        <Flame className="w-8 h-8 text-white" />
      </div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-surface-800 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{streak}</span>
      </div>
    </motion.div>
    <span className="mt-2 text-xs font-medium text-surface-500">{streak === 0 ? 'Начни серию!' : 'дней подряд'}</span>
    {bestStreak && bestStreak > streak && <span className="text-xs text-surface-400">Лучший: {bestStreak}</span>}
  </div>
);

// ==================== XP DISPLAY ====================

interface XPDisplayProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
}

export const XPDisplay: React.FC<XPDisplayProps> = ({ xp, size = 'md' }) => {
  const sizeClasses = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };
  return (
    <div className="flex items-center gap-1.5">
      <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
      <span className={`${sizeClasses[size]} font-bold text-surface-700`}>{xp}</span>
      <span className="text-surface-400 text-sm">XP</span>
    </div>
  );
};

// ==================== DAILY GOAL ====================

export const DailyGoalBar: React.FC = () => {
  const { dailyGoal, dailyGoalCompleted } = useStore();
  return (
    <div className="bg-white rounded-xl p-4 border border-surface-100 dark:bg-surface-850 dark:border-surface-700/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-surface-600 dark:text-surface-300">Ежедневная цель</span>
        {dailyGoalCompleted
          ? <span className="badge badge-success">✓ Выполнено!</span>
          : <span className="text-xs text-surface-400 dark:text-surface-500">{dailyGoal.currentXp}/{dailyGoal.targetXp} XP</span>
        }
      </div>
      <ProgressBar current={dailyGoal.currentXp} total={dailyGoal.targetXp} color={dailyGoalCompleted ? 'bg-gold-500' : 'bg-primary-500'} />
    </div>
  );
};
