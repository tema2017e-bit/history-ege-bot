import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Star, Trophy, Flame, Target, Zap, Heart,
  Award, BookOpen, BarChart3, Brain, Shield, Crown, Swords,
  Scroll, Gem, Sparkles, Repeat, Clock, Unlock, Lock, TrendingUp,
  ChevronRight
} from 'lucide-react';
import { TopBar } from '../components/ui/TopBar';
import { useStore } from '../store/useStore';
import { eras, historyCards } from '../data/historyDates';
import { ALL_ACHIEVEMENTS, AchievementInfo } from '../data/achievements';

const MasteryIcon: Record<string, string> = {
  new: '🆕', learning: '📖', weak: '⚠️', good: '👍', mastered: '⭐',
};
const MasteryLabel: Record<string, string> = {
  new: 'Новые', learning: 'В процессе', weak: 'Слабые', good: 'Хорошие', mastered: 'Освоенные',
};
const MasteryColor: Record<string, string> = {
  new: 'bg-surface-100 text-surface-500', learning: 'bg-blue-100 text-blue-600',
  weak: 'bg-red-100 text-red-600', good: 'bg-emerald-100 text-emerald-600', mastered: 'bg-gold-100 text-gold-600',
};

const CategoryConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  lessons: { label: 'Уроки', icon: <BookOpen className="w-4 h-4" />, color: 'text-blue-500' },
  cards: { label: 'Карточки', icon: <Brain className="w-4 h-4" />, color: 'text-emerald-500' },
  accuracy: { label: 'Точность', icon: <Target className="w-4 h-4" />, color: 'text-orange-500' },
  streak: { label: 'Серия', icon: <Flame className="w-4 h-4" />, color: 'text-red-500' },
  xp: { label: 'Опыт', icon: <Star className="w-4 h-4" />, color: 'text-yellow-500' },
  eras: { label: 'Эпохи', icon: <Scroll className="w-4 h-4" />, color: 'text-purple-500' },
  reigns: { label: 'Правления', icon: <Crown className="w-4 h-4" />, color: 'text-amber-500' },
  misc: { label: 'Разное', icon: <Sparkles className="w-4 h-4" />, color: 'text-pink-500' },
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const store = useStore();
  const {
    xp, level, streak, longestStreak, completedLessons,
    totalCorrectAnswers, totalLessonsCompleted,
    perfectLessons, hearts, maxHearts,
    cardProgress, weakCards, mistakes,
    dailyGoal, dailyGoalCompleted, achievements,
    completedReignTests, attemptedDiagnostics,
    subscription,
  } = store;

  const getBotSubscribeLink = () => {
    let chatId = '';
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.initDataUnsafe?.user?.id) chatId = tg.initDataUnsafe.user.id;
    } catch {}
    return `https://t.me/HistDate_bot?start=subscribe_${chatId}`;
  };

  const stats = useMemo(() => {
    const totalAttempts = totalCorrectAnswers + mistakes.length;
    const eraProgress = eras.map(era => {
      const eraLessons = era.lessonIds;
      const completed = eraLessons.filter(id => completedLessons.includes(id)).length;
      return {
        era, completed, total: eraLessons.length,
        percent: eraLessons.length > 0 ? Math.round((completed / eraLessons.length) * 100) : 0,
      };
    });
    return {
      eraProgress,
      accuracy: totalAttempts > 0 ? Math.round((totalCorrectAnswers / totalAttempts) * 100) : 0,
      accuracyColor: totalAttempts > 0
        ? totalCorrectAnswers / totalAttempts >= 0.9 ? 'text-emerald-500'
          : totalCorrectAnswers / totalAttempts >= 0.8 ? 'text-blue-500'
            : totalCorrectAnswers / totalAttempts >= 0.6 ? 'text-amber-500'
              : 'text-red-500'
        : 'text-surface-400',
      completedEras: eraProgress.filter(e => e.percent === 100).length,
      totalEras: eraProgress.length,
    };
  }, [cardProgress, completedLessons, totalCorrectAnswers, mistakes.length]);

  const achievementData = useMemo(() => {
    const unlocked = new Set(achievements);
    return ALL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: unlocked.has(a.id) }));
  }, [achievements]);

  const groupedAchievements = useMemo(() => {
    const groups: Record<string, typeof achievementData> = {};
    for (const ach of achievementData) {
      if (!groups[ach.category]) groups[ach.category] = [];
      groups[ach.category].push(ach);
    }
    return groups;
  }, [achievementData]);

  const totalAchievements = ALL_ACHIEVEMENTS.length;
  const unlockedCount = achievements.length;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <TopBar />
      <div className="max-w-lg mx-auto px-4 pb-40">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 mb-6 mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>

        {/* ПРОФИЛЬ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/30">
            <span className="text-4xl font-bold text-white">{level}</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100">Историк-исследователь</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Уровень {level} • {xp} XP</p>
        </motion.div>

        {/* ПОДПИСКА */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-4">
          <div className="card overflow-hidden">
            {subscription ? (
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-gold-400 to-gold-600">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-surface-800 dark:text-surface-100">Подписка активна ✨</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Вам доступны все эпохи и бесконечные сердца</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-surface-400 dark:text-surface-500">
                    <Unlock className="w-3 h-3 text-emerald-500" />
                    <span>Все эпохи разблокированы</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-surface-400 dark:text-surface-500">
                    <Heart className="w-3 h-3 text-red-400" />
                    <span>Бесконечные сердца</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-surface-200 dark:bg-surface-700">
                  <Lock className="w-7 h-7 text-surface-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-surface-800 dark:text-surface-100">Оформить подписку</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Получите доступ ко всем эпохам, бесконечные сердца и больше возможностей</p>
                  <ul className="mt-3 space-y-1">
                    <li className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
                      <Sparkles className="w-3 h-3 text-gold-500" />
                      <span>Все {eras.length} эпох</span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
                      <Heart className="w-3 h-3 text-red-400" />
                      <span>Бесконечные сердца</span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
                      <Crown className="w-3 h-3 text-gold-500" />
                      <span>Все блоки правлений</span>
                    </li>
                  </ul>
                  <a href={getBotSubscribeLink()} target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-amber-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:from-gold-600 hover:to-amber-700 transition-all shadow-lg shadow-gold-500/25">
                    <Sparkles className="w-4 h-4" />
                    Оформить подписку
                  </a>
                  <p className="text-xs text-surface-400 dark:text-surface-500 mt-2">После оплаты напишите администратору для активации</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ДЕТАЛЬНАЯ СТАТИСТИКА */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }} className="mb-4">
          <Link to="/stats" className="card p-4 flex items-center gap-3 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-surface-800 dark:text-surface-100 text-sm">Детальная статистика</h3>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Анализ по эпохам, слабые места, прогресс</p>
            </div>
            <ChevronRight className="w-4 h-4 text-surface-400 flex-shrink-0" />
          </Link>
        </motion.div>

        {/* СТАТИСТИКА В 3 КОЛОНКИ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          <div className="card !p-3 sm:!p-4 text-center">
            <Target className={`w-5 h-5 mx-auto mb-1.5 ${stats.accuracyColor}`} />
            <div className={`text-lg sm:text-xl font-bold leading-tight ${stats.accuracyColor}`}>{stats.accuracy}%</div>
            <div className="text-[10px] sm:text-xs text-surface-400 dark:text-surface-500">Точность</div>
          </div>
          <div className="card !p-3 sm:!p-4 text-center">
            <BookOpen className="w-5 h-5 text-primary-500 mx-auto mb-1.5" />
            <div className="text-lg sm:text-xl font-bold text-surface-700 dark:text-surface-200 leading-tight">{totalLessonsCompleted}</div>
            <div className="text-[10px] sm:text-xs text-surface-400 dark:text-surface-500">Уроков</div>
          </div>
          <div className="card !p-3 sm:!p-4 text-center">
            <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1.5" />
            <div className="text-lg sm:text-xl font-bold text-surface-700 dark:text-surface-200 leading-tight">{streak}</div>
            <div className="text-[10px] sm:text-xs text-surface-400 dark:text-surface-500">Дней подряд</div>
          </div>
        </motion.div>

        {/* ДОП. СТАТИСТИКА */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          <div className="card !p-2 sm:!p-3 text-center">
            <Trophy className="w-4 h-4 text-amber-500 mx-auto mb-0.5" />
            <div className="text-base sm:text-lg font-bold text-surface-700 dark:text-surface-200">{perfectLessons}</div>
            <div className="text-[9px] sm:text-[10px] text-surface-400 dark:text-surface-500">Идеальных</div>
          </div>
          <div className="card !p-2 sm:!p-3 text-center">
            <Crown className="w-4 h-4 text-purple-500 mx-auto mb-0.5" />
            <div className="text-base sm:text-lg font-bold text-surface-700 dark:text-surface-200">{completedReignTests.length}</div>
            <div className="text-[9px] sm:text-[10px] text-surface-400 dark:text-surface-500">Правлений</div>
          </div>
          <div className="card !p-2 sm:!p-3 text-center">
            <Swords className="w-4 h-4 text-red-500 mx-auto mb-0.5" />
            <div className="text-base sm:text-lg font-bold text-surface-700 dark:text-surface-200">{stats.completedEras}/{stats.totalEras}</div>
            <div className="text-[9px] sm:text-[10px] text-surface-400 dark:text-surface-500">Эпох</div>
          </div>
        </motion.div>

        {/* ДОСТИЖЕНИЯ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-surface-800 dark:text-surface-100 flex items-center gap-2">
              <Gem className="w-5 h-5 text-primary-500" />
              Достижения
            </h2>
            <span className="text-xs bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300 px-2 py-1 rounded-full font-medium">
              {unlockedCount}/{totalAchievements}
            </span>
          </div>
          <div className="space-y-4">
            {(Object.entries(groupedAchievements) as [string, (AchievementInfo & { unlocked: boolean })[]][]).map(([category, achs]) => {
              const cat = CategoryConfig[category] || { label: category, icon: null, color: 'text-surface-500' };
              const catUnlocked = achs.filter(a => a.unlocked).length;
              return (
                <div key={category}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className={cat.color}>{cat.icon}</span>
                    <span className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">{cat.label}</span>
                    <span className="text-[10px] text-surface-400 dark:text-surface-500 ml-auto">{catUnlocked}/{achs.length}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {achs.map((ach, index) => (
                      <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.02 }}
                        className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-1 text-center group cursor-default ${ach.unlocked ? 'bg-gradient-to-br from-gold-100 to-gold-200 shadow-sm' : 'bg-surface-200 dark:bg-surface-700'}`}>
                        <span className={`text-xl mb-0.5 ${!ach.unlocked ? 'grayscale opacity-40' : ''}`}>{ach.icon}</span>
                        <span className={`text-[9px] font-medium leading-tight ${ach.unlocked ? 'text-surface-700 dark:text-surface-200' : 'text-surface-400 dark:text-surface-500'}`}>{ach.name}</span>
                        {ach.unlocked && <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 px-2 py-1.5 bg-surface-800 text-white text-[10px] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-normal text-center">
                          {ach.description}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ПРОГРЕСС ПО ЭПОХАМ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="text-lg font-bold text-surface-800 dark:text-surface-100 mb-3 flex items-center gap-2">
            <Scroll className="w-5 h-5 text-primary-500" />
            Прогресс по эпохам
          </h2>
          <div className="space-y-2">
            {stats.eraProgress.map(({ era, completed, total, percent }) => (
              <div key={era.id} className="card p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{era.icon}</span>
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-200">{era.name}</span>
                  </div>
                  <span className="text-xs text-surface-400 dark:text-surface-500">{completed}/{total} &bull; {percent}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${percent}%`, backgroundColor: era.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;