import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BarChart3, Brain, Target, Flame, Calendar,
  TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp,
  Clock, Zap, BookOpen, Crown, Star, AlertTriangle, CheckCircle,
  XCircle, ArrowRight, Sparkles, Heart, Award, Trophy
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { eras, historyCards } from '../data/historyDates';

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function getDayOfWeek(dateStr: string): string {
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return days[new Date(dateStr).getDay()];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getWeekDates(): string[] {
  const dates: string[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toDateString());
  }
  return dates;
}

// ==================== КОМПОНЕНТ ТЕПЛОВОЙ КАРТЫ ====================

const HeatMap: React.FC<{ data: Record<string, number> }> = ({ data }) => {
  const weeks = useMemo(() => {
    const dates = getWeekDates();
    const weeksArr: string[][] = [];
    let week: string[] = [];
    dates.forEach((date, i) => {
      week.push(date);
      if (week.length === 7 || i === dates.length - 1) {
        weeksArr.push(week);
        week = [];
      }
    });
    return weeksArr;
  }, []);

  const maxVal = Math.max(...Object.values(data), 1);

  const getColor = (val: number) => {
    if (val === 0) return 'bg-surface-100 dark:bg-surface-800';
    const ratio = val / maxVal;
    if (ratio < 0.25) return 'bg-emerald-200 dark:bg-emerald-900/50';
    if (ratio < 0.5) return 'bg-emerald-300 dark:bg-emerald-800/60';
    if (ratio < 0.75) return 'bg-emerald-400 dark:bg-emerald-700/70';
    return 'bg-emerald-500 dark:bg-emerald-600';
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-0.5 min-w-fit">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((date, di) => {
              const val = data[date] || 0;
              return (
                <div
                  key={di}
                  className={`w-3 h-3 rounded-sm ${getColor(val)} transition-colors`}
                  title={`${formatDate(date)}: ${val} ответов`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-2 text-[10px] text-surface-400">
        <span>Меньше</span>
        <div className="w-2.5 h-2.5 rounded-sm bg-surface-100 dark:bg-surface-800" />
        <div className="w-2.5 h-2.5 rounded-sm bg-emerald-200 dark:bg-emerald-900/50" />
        <div className="w-2.5 h-2.5 rounded-sm bg-emerald-300 dark:bg-emerald-800/60" />
        <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400 dark:bg-emerald-700/70" />
        <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 dark:bg-emerald-600" />
        <span>Больше</span>
      </div>
    </div>
  );
};

// ==================== КОМПОНЕНТ МИНИ-ГРАФИКА ====================

const MiniBar: React.FC<{ value: number; max: number; color?: string }> = ({ value, max, color = 'bg-primary-500' }) => (
  <div className="w-full h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`h-full rounded-full ${color}`}
    />
  </div>
);

// ==================== КОМПОНЕНТ СЕКЦИИ С РАЗВОРОТОМ ====================

const ExpandableSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, icon, badge, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          {icon}
          <span className="font-semibold text-surface-800 dark:text-surface-100 text-sm">{title}</span>
          {badge && (
            <span className="text-[10px] bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300 px-1.5 py-0.5 rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-surface-400" /> : <ChevronDown className="w-4 h-4 text-surface-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-surface-100 dark:border-surface-700 pt-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== ГЛАВНЫЙ КОМПОНЕНТ ====================

const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const store = useStore();
  const {
    cardProgress, mistakes, completedLessons, totalCorrectAnswers,
    totalLessonsCompleted, perfectLessons, streak, longestStreak,
    xp, level, weakCards, completedReignTests, reignMastery,
    achievements, dailyGoalCount, endlessRecord, lastStudyDate,
  } = store;

  // ==================== ВЫЧИСЛЯЕМАЯ СТАТИСТИКА ====================

  const stats = useMemo(() => {
    const totalAttempts = totalCorrectAnswers + mistakes.length;
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrectAnswers / totalAttempts) * 100) : 0;

    // Прогресс по эпохам
    const eraStats = eras.map(era => {
      const eraCards = historyCards.filter(c => c.era === era.id);
      const eraCardIds = new Set(eraCards.map(c => c.id));
      const progress = Object.values(cardProgress).filter(p => eraCardIds.has(p.cardId));
      const correct = progress.reduce((s, p) => s + p.correctCount, 0);
      const incorrect = progress.reduce((s, p) => s + p.incorrectCount, 0);
      const total = correct + incorrect;
      const eraAccuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
      const mastered = progress.filter(p => p.mastery === 'mastered').length;
      const good = progress.filter(p => p.mastery === 'good').length;
      const weak = progress.filter(p => p.mastery === 'weak' || p.mastery === 'learning').length;
      const studied = progress.length;
      const completion = eraCards.length > 0 ? Math.round((studied / eraCards.length) * 100) : 0;

      return {
        era,
        total: eraCards.length,
        studied,
        mastered,
        good,
        weak,
        correct,
        incorrect,
        accuracy: eraAccuracy,
        completion,
        xp: correct * 10,
      };
    });

    // Самые слабые карточки (топ-10)
    const weakCardDetails = weakCards
      .map(id => {
        const card = historyCards.find(c => c.id === id);
        const prog = cardProgress[id];
        if (!card || !prog) return null;
        const total = prog.correctCount + prog.incorrectCount;
        const acc = total > 0 ? Math.round((prog.correctCount / total) * 100) : 0;
        return { card, prog, total, acc };
      })
      .filter(Boolean)
      .sort((a, b) => (a!.acc - b!.acc) || (b!.prog.incorrectCount - a!.prog.incorrectCount))
      .slice(0, 10) as { card: typeof historyCards[0]; prog: typeof cardProgress[string]; total: number; acc: number }[];

    // Самые сильные карточки (топ-5)
    const strongCardDetails = Object.values(cardProgress)
      .filter(p => p.mastery === 'mastered' || p.mastery === 'good')
      .map(p => {
        const card = historyCards.find(c => c.id === p.cardId);
        if (!card) return null;
        const total = p.correctCount + p.incorrectCount;
        const acc = total > 0 ? Math.round((p.correctCount / total) * 100) : 0;
        return { card, prog: p, total, acc };
      })
      .filter(Boolean)
      .sort((a, b) => b!.acc - a!.acc)
      .slice(0, 5) as { card: typeof historyCards[0]; prog: typeof cardProgress[string]; total: number; acc: number }[];

    // Статистика по дням (последние 28 дней)
    const dailyActivity: Record<string, number> = {};
    mistakes.forEach(m => {
      const day = new Date(m.timestamp).toDateString();
      dailyActivity[day] = (dailyActivity[day] || 0) + 1;
    });
    Object.values(cardProgress).forEach(p => {
      if (p.lastShown) {
        const day = new Date(p.lastShown).toDateString();
        dailyActivity[day] = (dailyActivity[day] || 0) + 1;
      }
    });

    // Статистика по типам ошибок
    const mistakesByEra: Record<string, number> = {};
    mistakes.forEach(m => {
      const card = historyCards.find(c => c.id === m.cardId);
      if (card) {
        mistakesByEra[card.era] = (mistakesByEra[card.era] || 0) + 1;
      }
    });

    // Средняя точность по эпохам для графика
    const eraAccuracyData = eraStats.filter(e => e.total > 0).map(e => ({
      era: e.era,
      name: e.era.shortName || e.era.name,
      accuracy: e.accuracy,
      studied: e.studied,
      total: e.total,
      color: e.era.color,
    }));

    // Общий прогресс
    const totalCards = historyCards.length;
    const studiedCards = Object.keys(cardProgress).length;
    const masteredCards = Object.values(cardProgress).filter(p => p.mastery === 'mastered').length;
    const overallProgress = totalCards > 0 ? Math.round((studiedCards / totalCards) * 100) : 0;

    // Серия и активность
    const hasStudiedToday = lastStudyDate && new Date(lastStudyDate).toDateString() === new Date().toDateString();

    return {
      accuracy,
      totalAttempts,
      totalCorrect: totalCorrectAnswers,
      totalMistakes: mistakes.length,
      eraStats,
      weakCardDetails,
      strongCardDetails,
      dailyActivity,
      mistakesByEra,
      eraAccuracyData,
      totalCards,
      studiedCards,
      masteredCards,
      overallProgress,
      hasStudiedToday,
      perfectLessons,
      totalLessonsCompleted,
      streak,
      longestStreak,
      xp,
      level,
      achievementsCount: achievements.length,
      dailyGoalCount,
      endlessRecord,
    };
  }, [cardProgress, mistakes, completedLessons, totalCorrectAnswers, totalLessonsCompleted, perfectLessons, streak, longestStreak, xp, level, weakCards, completedReignTests, reignMastery, achievements, dailyGoalCount, endlessRecord, lastStudyDate]);

  // ==================== РЕНДЕР ====================

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <div className="max-w-lg mx-auto px-4 pb-40">
        {/* Заголовок */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 mb-4 mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>В профиль</span>
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary-500" />
            Детальная статистика
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Полный анализ вашего прогресса</p>
        </motion.div>

        {/* ===== ОБЩИЙ ПРОГРЕСС ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-surface-800 dark:text-surface-100 text-sm">Общий прогресс</h3>
              <span className="text-xs text-surface-400">{stats.studiedCards}/{stats.totalCards} карточек</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-surface-100 dark:bg-surface-800"
                  />
                  <motion.path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${stats.overallProgress}, 100`}
                    className="text-primary-500"
                    initial={{ strokeDasharray: '0, 100' }}
                    animate={{ strokeDasharray: `${stats.overallProgress}, 100` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-surface-700 dark:text-surface-200">{stats.overallProgress}%</span>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-500">{stats.masteredCards}</div>
                  <div className="text-[10px] text-surface-400">Освоено</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-amber-500">{stats.weakCardDetails.length}</div>
                  <div className="text-[10px] text-surface-400">Слабых</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary-500">{stats.accuracy}%</div>
                  <div className="text-[10px] text-surface-400">Точность</div>
                </div>
              </div>
            </div>
            <MiniBar value={stats.overallProgress} max={100} color="bg-primary-500" />
          </div>
        </motion.div>

        {/* ===== КЛЮЧЕВЫЕ МЕТРИКИ ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-2 mb-4">
          <div className="card !p-2.5 text-center">
            <Target className="w-4 h-4 text-primary-500 mx-auto mb-1" />
            <div className="text-base font-bold text-surface-700 dark:text-surface-200">{stats.accuracy}%</div>
            <div className="text-[9px] text-surface-400">Точность</div>
          </div>
          <div className="card !p-2.5 text-center">
            <Flame className="w-4 h-4 text-orange-500 mx-auto mb-1" />
            <div className="text-base font-bold text-surface-700 dark:text-surface-200">{stats.streak}</div>
            <div className="text-[9px] text-surface-400">Серия</div>
          </div>
          <div className="card !p-2.5 text-center">
            <BookOpen className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <div className="text-base font-bold text-surface-700 dark:text-surface-200">{stats.totalLessonsCompleted}</div>
            <div className="text-[9px] text-surface-400">Уроков</div>
          </div>
          <div className="card !p-2.5 text-center">
            <Star className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
            <div className="text-base font-bold text-surface-700 dark:text-surface-200">{stats.xp}</div>
            <div className="text-[9px] text-surface-400">XP</div>
          </div>
        </motion.div>

        {/* ===== ТЕПЛОВАЯ КАРТА АКТИВНОСТИ ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4">
          <ExpandableSection
            title="Активность за 28 дней"
            icon={<Calendar className="w-4 h-4 text-primary-500" />}
            badge={stats.hasStudiedToday ? 'Сегодня ✓' : undefined}
            defaultOpen={true}
          >
            <HeatMap data={stats.dailyActivity} />
            <div className="mt-3 flex items-center gap-4 text-xs text-surface-500 dark:text-surface-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Лучшая серия: {stats.longestStreak} дн.</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>Цель выполнена: {stats.dailyGoalCount} раз</span>
              </div>
            </div>
          </ExpandableSection>
        </motion.div>

        {/* ===== ТОЧНОСТЬ ПО ЭПОХАМ ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-4">
          <ExpandableSection
            title="Точность по эпохам"
            icon={<BarChart3 className="w-4 h-4 text-emerald-500" />}
            badge={`${stats.eraAccuracyData.length} эпох`}
            defaultOpen={true}
          >
            <div className="space-y-3">
              {stats.eraAccuracyData.map((era, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{era.era.icon}</span>
                      <span className="text-xs font-medium text-surface-700 dark:text-surface-200">{era.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-surface-400">{era.studied}/{era.total}</span>
                      <span className={`text-xs font-bold ${
                        era.accuracy >= 80 ? 'text-emerald-500' :
                        era.accuracy >= 60 ? 'text-amber-500' :
                        era.accuracy > 0 ? 'text-red-500' : 'text-surface-400'
                      }`}>
                        {era.accuracy}%
                      </span>
                    </div>
                  </div>
                  <MiniBar
                    value={era.accuracy}
                    max={100}
                    color={era.accuracy >= 80 ? 'bg-emerald-500' : era.accuracy >= 60 ? 'bg-amber-500' : 'bg-red-400'}
                  />
                </div>
              ))}
            </div>
          </ExpandableSection>
        </motion.div>

        {/* ===== СЛАБЫЕ МЕСТА ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-4">
          <ExpandableSection
            title="Слабые места"
            icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
            badge={stats.weakCardDetails.length > 0 ? `${stats.weakCardDetails.length}` : 'Нет'}
            defaultOpen={stats.weakCardDetails.length > 0}
          >
            {stats.weakCardDetails.length > 0 ? (
              <div className="space-y-2">
                {stats.weakCardDetails.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-surface-700 dark:text-surface-200 truncate">
                        {item.card.event}
                      </div>
                      <div className="text-[10px] text-surface-400">
                        {item.card.year} • {item.prog.incorrectCount} ошибок
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-sm font-bold ${item.acc < 40 ? 'text-red-500' : 'text-amber-500'}`}>
                        {item.acc}%
                      </div>
                      <div className="text-[10px] text-surface-400">{item.total} попыток</div>
                    </div>
                  </div>
                ))}
                <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <p className="text-[10px] text-amber-700 dark:text-amber-300">
                    💡 Рекомендуем повторить эти карточки в режиме «Повторение ошибок»
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-surface-500">Отлично! Слабых мест не обнаружено</p>
              </div>
            )}
          </ExpandableSection>
        </motion.div>

        {/* ===== СИЛЬНЫЕ СТОРОНЫ ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-4">
          <ExpandableSection
            title="Лучшие результаты"
            icon={<Sparkles className="w-4 h-4 text-emerald-500" />}
            badge={stats.strongCardDetails.length > 0 ? `${stats.strongCardDetails.length}` : undefined}
          >
            {stats.strongCardDetails.length > 0 ? (
              <div className="space-y-2">
                {stats.strongCardDetails.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-surface-700 dark:text-surface-200 truncate">
                        {item.card.event}
                      </div>
                      <div className="text-[10px] text-surface-400">
                        {item.card.year} • {item.prog.correctCount} верных
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-emerald-500">{item.acc}%</div>
                      <div className="text-[10px] text-surface-400">{item.total} попыток</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Brain className="w-8 h-8 text-surface-300 mx-auto mb-2" />
                <p className="text-xs text-surface-500">Продолжайте учиться — скоро здесь появятся результаты</p>
              </div>
            )}
          </ExpandableSection>
        </motion.div>

        {/* ===== ПРОГРЕСС ПО ЭПОХАМ (ДЕТАЛЬНО) ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-4">
          <ExpandableSection
            title="Прогресс по эпохам"
            icon={<Crown className="w-4 h-4 text-purple-500" />}
            badge={`${stats.eraStats.filter(e => e.completion === 100).length}/${stats.eraStats.length}`}
          >
            <div className="space-y-3">
              {stats.eraStats.map((era, i) => (
                <div key={i} className="p-3 bg-surface-50 dark:bg-surface-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{era.era.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-surface-700 dark:text-surface-200">{era.era.name}</div>
                        <div className="text-[10px] text-surface-400">{era.era.yearRange}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${
                        era.completion === 100 ? 'text-emerald-500' :
                        era.completion > 50 ? 'text-amber-500' :
                        era.completion > 0 ? 'text-orange-500' : 'text-surface-400'
                      }`}>
                        {era.completion}%
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <div className="text-xs font-bold text-surface-600 dark:text-surface-300">{era.studied}</div>
                      <div className="text-[9px] text-surface-400">Изучено</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-500">{era.mastered}</div>
                      <div className="text-[9px] text-surface-400">Освоено</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-500">{era.good}</div>
                      <div className="text-[9px] text-surface-400">Хорошо</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-red-400">{era.weak}</div>
                      <div className="text-[9px] text-surface-400">Слабо</div>
                    </div>
                  </div>
                  <div className="mt-2 progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${era.completion}%`, backgroundColor: era.era.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ExpandableSection>
        </motion.div>

        {/* ===== ДОПОЛНИТЕЛЬНАЯ СТАТИСТИКА ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-4">
          <ExpandableSection
            title="Дополнительно"
            icon={<Zap className="w-4 h-4 text-amber-500" />}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-surface-50 dark:bg-surface-800/50 rounded-lg text-center">
                <Trophy className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-surface-700 dark:text-surface-200">{stats.perfectLessons}</div>
                <div className="text-[10px] text-surface-400">Идеальных уроков</div>
              </div>
              <div className="p-3 bg-surface-50 dark:bg-surface-800/50 rounded-lg text-center">
                <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-surface-700 dark:text-surface-200">{stats.longestStreak}</div>
                <div className="text-[10px] text-surface-400">Лучшая серия</div>
              </div>
              <div className="p-3 bg-surface-50 dark:bg-surface-800/50 rounded-lg text-center">
                <Award className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-surface-700 dark:text-surface-200">{stats.achievementsCount}</div>
                <div className="text-[10px] text-surface-400">Достижений</div>
              </div>
              <div className="p-3 bg-surface-50 dark:bg-surface-800/50 rounded-lg text-center">
                <Zap className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-surface-700 dark:text-surface-200">{stats.endlessRecord}</div>
                <div className="text-[10px] text-surface-400">Рекорд (∞)</div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-surface-50 dark:bg-surface-800/50 rounded-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-500">Всего ответов:</span>
                <span className="font-bold text-surface-700 dark:text-surface-200">{stats.totalAttempts}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-surface-500">Верных:</span>
                <span className="font-bold text-emerald-500">{stats.totalCorrect}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-surface-500">Ошибок:</span>
                <span className="font-bold text-red-400">{stats.totalMistakes}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-surface-500">Уровень:</span>
                <span className="font-bold text-primary-500">{stats.level} ({stats.xp} XP)</span>
              </div>
            </div>
          </ExpandableSection>
        </motion.div>

        {/* Кнопка назад */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <button
            onClick={() => navigate('/profile')}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться в профиль
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsPage;