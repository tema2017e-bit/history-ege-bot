import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, Crown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { lessons, eras } from '../../data/historyDates';

// ==================== LESSON NODE ====================

interface LessonNodeProps {
  lessonId: string;
  index: number;
  eraColor: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  isCurrent: boolean;
  isBoss: boolean;
}

export const LessonNode: React.FC<LessonNodeProps> = ({
  lessonId,
  index,
  eraColor,
  isCompleted,
  isUnlocked,
  isCurrent,
  isBoss,
}) => {
  const lesson = lessons.find(l => l.id === lessonId);
  if (!lesson) return null;

  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex ${isLeft ? 'justify-start' : 'justify-end'} px-8`}
    >
      {isUnlocked ? (
        <Link
          to={`/lesson/${lessonId}`}
          className="relative group"
        >
          <motion.div
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer
              ${isCompleted 
                ? 'bg-primary-500 shadow-primary-500/30' 
                : isBoss
                  ? 'bg-gradient-to-br from-gold-400 to-gold-600 shadow-gold-500/30'
                  : isCurrent
                    ? 'bg-primary-500 shadow-primary-500/30 ring-4 ring-primary-200'
                    : 'bg-surface-300 shadow-surface-300/30'
              }
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCompleted ? (
              <Check className="w-7 h-7 text-white" />
            ) : isBoss ? (
              <Crown className="w-7 h-7 text-white" />
            ) : (
              <Star className="w-7 h-7 text-white" />
            )}
          </motion.div>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-surface-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
              {lesson.title}
              <div className="text-surface-400 text-[10px]">{lesson.description}</div>
            </div>
            <div className="w-2 h-2 bg-surface-800 rotate-45 mx-auto -mt-1"></div>
          </div>

          {/* Pulse animation for current lesson */}
          {isCurrent && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: eraColor }}
              animate={{ opacity: [0, 0.3, 0], scale: [1, 1.5, 1.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </Link>
      ) : (
        <div className="w-16 h-16 rounded-full bg-surface-200 flex items-center justify-center">
          <Lock className="w-6 h-6 text-surface-400" />
        </div>
      )}
    </motion.div>
  );
};

// ==================== ERA CARD ====================

interface EraCardProps {
  eraIndex: number;
  isUnlocked: boolean;
  completedCount: number;
  totalCount: number;
}

export const EraCardComponent: React.FC<EraCardProps> = ({
  eraIndex,
  isUnlocked,
  completedCount,
  totalCount,
}) => {
  const era = eras[eraIndex];
  if (!era) return null;

  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${isUnlocked ? 'card-hover cursor-pointer' : 'opacity-60'}`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: `${era.color}20` }}
        >
          {era.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-surface-800 truncate">{era.name}</h3>
            <span className="text-xs text-surface-400">{era.yearRange}</span>
          </div>
          <p className="text-xs text-surface-500 mt-0.5">{era.description}</p>
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-surface-500 mb-1">
              <span>{completedCount}/{totalCount} уроков</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: era.color,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== MAP PATH ====================

export const MapPath: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col gap-6 py-8">
      {children}
    </div>
  );
};
