import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, History, Heart, Clock, Zap, Crown, Lock, CheckCircle, TestTube, Swords, BookOpen, Brain, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TopBar, DailyGoalBar } from '../components/ui/TopBar';
import { useStore, FREE_ERAS_COUNT } from '../store/useStore';
import { eras, lessons, historyCards } from '../data/historyDates';
import { getTopWeakCards } from '../utils/cardAnalysis';

const HomePage: React.FC = () => {
  const {
    completedLessons,
    unlockedLessons,
    streak,
    hearts,
    maxHearts,
    formatHeartTimer,
    completedReignTests,
    getEraStatus,
    canAttemptDiagnostic,
    cardProgress,
    subscription,
    unlockedAllByAdmin,
  } = useStore();

  const hasSubscription = subscription || unlockedAllByAdmin;

  // Определяем текущий урок (первый незавершённый из разблокированных)
  const currentLesson = unlockedLessons.find(id => !completedLessons.includes(id)) || null;
  const currentLessonData = lessons.find(l => l.id === currentLesson);
  const isOutOfHearts = hearts <= 0;
  const timerStr = formatHeartTimer();

  // Рекомендуем повторить (топ-3 карточки по реальным ошибкам)
  const recommendedCards = useMemo(() => {
    const entries = getTopWeakCards(historyCards, cardProgress, 3);
    return entries.map(e => ({ card: e.card, score: e.score, wrongCount: e.wrongCount }));
  }, [cardProgress]);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <TopBar />
      
      <div className="max-w-lg mx-auto px-4 pb-40">
        {/* Приветствие */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-6"
        >
          <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100 select-none">
            {streak > 0 ? `🔥 Серия ${streak} дней!` : 'Учим историю! 📚'}
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            {currentLessonData 
              ? ''
              : 'Все уроки пройдены! 🎉'}
          </p>
        </motion.div>

        {/* Экран 0 жизней */}
        {isOutOfHearts && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-error-50 border-2 border-error-200 rounded-2xl p-6 text-center dark:bg-error-900/20 dark:border-error-800/50">
              <Heart className="w-12 h-12 text-error-400 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-error-700 dark:text-error-300 mb-2">Сердечки закончились</h2>
              <p className="text-sm text-error-600 dark:text-error-400 mb-4">
                Но обучение не останавливается!
              </p>
              <Link to="/recovery" className="btn-primary w-full flex items-center justify-center gap-2 mb-3">
                <Zap className="w-5 h-5" />
                Восстановить сердце
              </Link>
              <div className="flex items-center justify-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                <Clock className="w-4 h-4" />
                <span>или подожди — сердце восстановится через {timerStr}</span>
              </div>
              <p className="text-xs text-surface-400 dark:text-surface-500 mt-2">1 сердце каждые 30 минут (макс. {maxHearts})</p>
            </div>
          </motion.div>
        )}

        {/* Ежедневная цель */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <DailyGoalBar />
        </motion.div>

        {/* Рекомендуем повторить */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary-500" />
              <h3 className="font-semibold text-surface-800 dark:text-surface-100">Рекомендуем повторить</h3>
            </div>
            
            {recommendedCards.length > 0 ? (
              <div className="space-y-2">
                {recommendedCards.map(({ card, wrongCount }) => (
                  <Link
                    key={card.id}
                    to="/review"
                    className="block p-3 rounded-xl bg-surface-50 hover:bg-surface-100 transition-colors dark:bg-surface-800 dark:hover:bg-surface-700"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-warning-100 flex items-center justify-center flex-shrink-0 dark:bg-warning-900/30">
                        <BookOpen className="w-4 h-4 text-warning-600 dark:text-warning-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-700 dark:text-surface-200">
                          {card.event}
                        </p>
                        <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
                          {card.year} • {wrongCount} ошибок
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-surface-400 dark:text-surface-500">
                Пока нет карточек для повторения. Продолжайте обучение.
              </p>
            )}
          </div>
        </motion.div>

        {/* Быстрые действия */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <Link to="/review" className="card card-hover p-4 flex flex-col items-center text-center dark:bg-surface-800">
            <RefreshCw className="w-8 h-8 text-primary-500 mb-2" />
            <span className="font-medium text-sm text-surface-700 dark:text-surface-200">Повторение</span>
            <span className="text-xs text-surface-400 dark:text-surface-500 mt-1">Слабые карточки</span>
          </Link>

          <Link to="/mistakes" className="card card-hover p-4 flex flex-col items-center text-center dark:bg-surface-800">
            <History className="w-8 h-8 text-error-500 mb-2" />
            <span className="font-medium text-sm text-surface-700 dark:text-surface-200">Ошибки</span>
            <span className="text-xs text-surface-400 dark:text-surface-500 mt-1">Разбор ошибок</span>
          </Link>

          {hasSubscription ? (
            <Link to="/endless" className="card card-hover p-4 flex flex-col items-center text-center border-gold-200 bg-gold-50/30 dark:border-gold-800/30 dark:bg-gold-900/10">
              <Zap className="w-8 h-8 text-gold-500 mb-2" />
              <span className="font-medium text-sm text-surface-700 dark:text-surface-200">Бесконечный поток</span>
              <span className="text-xs text-gold-600 dark:text-gold-400 mt-1">Отвечай, пока не ошибёшься</span>
            </Link>
          ) : (
            <div className="card p-4 flex flex-col items-center text-center opacity-50 dark:bg-surface-800">
              <div className="relative">
                <Zap className="w-8 h-8 text-gold-500 mb-2" />
                <Lock className="w-4 h-4 text-surface-400 absolute -bottom-1 -right-1" />
              </div>
              <span className="font-medium text-sm text-surface-500 dark:text-surface-400">Бесконечный поток</span>
              <span className="text-xs text-surface-400 mt-1">Только с подпиской</span>
            </div>
          )}

          {hasSubscription ? (
            <Link to="/date-memory" className="card card-hover p-4 flex flex-col items-center text-center border-indigo-200 bg-indigo-50/30 dark:border-indigo-800/30 dark:bg-indigo-900/10">
              <Brain className="w-8 h-8 text-indigo-500 mb-2" />
              <span className="font-medium text-sm text-surface-700 dark:text-surface-200">Чистый зачёт</span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">Все режимы</span>
            </Link>
          ) : (
            <div className="card p-4 flex flex-col items-center text-center opacity-50 dark:bg-surface-800">
              <div className="relative">
                <Brain className="w-8 h-8 text-indigo-500 mb-2" />
                <Lock className="w-4 h-4 text-surface-400 absolute -bottom-1 -right-1" />
              </div>
              <span className="font-medium text-sm text-surface-500 dark:text-surface-400">Чистый зачёт</span>
              <span className="text-xs text-surface-400 mt-1">Только с подпиской</span>
            </div>
          )}
        </motion.div>

        {/* Правления + Сердца */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <Link to="/reigns" className="card card-hover p-4 flex flex-col items-center text-center border-gold-200 bg-gold-50/30 dark:border-gold-800/30 dark:bg-gold-900/10">
            <Crown className="w-8 h-8 text-gold-500 mb-2" />
            <span className="font-medium text-sm text-surface-700 dark:text-surface-200">Правления</span>
            <span className="text-xs text-gold-600 dark:text-gold-400 mt-1">{completedReignTests.length} эпох</span>
          </Link>

          <Link to="/recovery" className="card card-hover p-4 flex flex-col items-center text-center dark:bg-surface-800">
            <Heart className="w-8 h-8 text-primary-500 mb-2" />
            <span className="font-medium text-sm text-surface-700 dark:text-surface-200">Сердца</span>
            <span className="text-xs text-surface-400 dark:text-surface-500 mt-1">{hearts}/{maxHearts}</span>
          </Link>
        </motion.div>

        {/* Эпохи */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-bold text-surface-800 dark:text-surface-100 mb-3">Эпохи</h2>
          <div className="space-y-3">
            {(hasSubscription ? eras : eras.slice(0, FREE_ERAS_COUNT)).map((era) => {
              const eraLessons = era.lessonIds;
              const completedCount = eraLessons.filter(id => completedLessons.includes(id)).length;
              const status = getEraStatus(era.id);
              const canDiagnostic = canAttemptDiagnostic(era.id);
              
              return (
                <EraCard
                  key={era.id}
                  era={era}
                  status={status}
                  completedCount={completedCount}
                  canDiagnostic={canDiagnostic}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Компонент карточки эпохи с разными состояниями
const EraCard: React.FC<{
  era: typeof eras[0];
  status: 'unlocked' | 'locked' | 'completed';
  completedCount: number;
  canDiagnostic: boolean;
}> = ({ era, status, completedCount, canDiagnostic }) => {
  const eraLessons = era.lessonIds;
  const progressPercent = eraLessons.length > 0 ? Math.round((completedCount / eraLessons.length) * 100) : 0;

  if (status === 'completed') {
    return (
      <Link to={`/era/${era.id}`}>
        <div className="card card-hover border-2 border-primary-200 bg-primary-50/30 dark:border-primary-800/50 dark:bg-primary-900/10">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-primary-500">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-surface-800 dark:text-surface-100 truncate">{era.name}</h3>
                <span className="text-xs text-primary-500 font-medium">Пройдена ✓</span>
              </div>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{era.yearRange}</p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-surface-500 dark:text-surface-400 mb-1">
                  <span>{completedCount}/{eraLessons.length} уроков</span>
                  <span>{progressPercent}%</span>
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
        </div>
      </Link>
    );
  }

  const subscription = useStore(s => s.subscription);

  if (status === 'locked') {
    return (
      <div className="card opacity-60 dark:bg-surface-800">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-surface-200 dark:bg-surface-700">
            <Lock className="w-7 h-7 text-surface-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-surface-600 dark:text-surface-400 truncate">{era.name}</h3>
              <span className="text-xs text-surface-400">{era.yearRange}</span>
            </div>
            <p className="text-xs text-surface-400 mt-0.5">{era.description}</p>
            {canDiagnostic ? (
              <Link to={`/diagnostic/${era.id}`} className="mt-2 inline-block">
                <div className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 mt-2">
                  <TestTube className="w-3 h-3" />
                  Пройти тест для разблокировки
                </div>
              </Link>
            ) : (
              <p className="text-xs text-surface-400 dark:text-surface-500 mt-2">Пройди предыдущие эпохи</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // unlocked
  return (
    <Link to={`/era/${era.id}`}>
      <div className="card card-hover dark:bg-surface-800">
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: `${era.color}20` }}
          >
            {era.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-surface-800 dark:text-surface-100 truncate">{era.name}</h3>
              <span className="text-xs text-surface-400">{era.yearRange}</span>
            </div>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{era.description}</p>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-surface-500 dark:text-surface-400 mb-1">
                <span>{completedCount}/{eraLessons.length} уроков</span>
                <span>{progressPercent}%</span>
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
      </div>
    </Link>
  );
};

export default HomePage;