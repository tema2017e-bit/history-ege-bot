import { MasteryLevel } from '../types';

// ==================== КОНФИГУРАЦИЯ ВСЕХ ДОСТИЖЕНИЙ ====================

export interface AchievementInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'lessons' | 'cards' | 'accuracy' | 'streak' | 'xp' | 'eras' | 'reigns' | 'misc';
}

export const ALL_ACHIEVEMENTS: AchievementInfo[] = [
  // ===== УРОКИ =====
  { id: 'first_lesson', name: 'Первый шаг', description: 'Пройдите первый урок', icon: '🎯', category: 'lessons' },
  { id: 'five_lessons', name: 'Ученик', description: 'Пройдите 5 уроков', icon: '📚', category: 'lessons' },
  { id: 'ten_lessons', name: 'Знаток', description: 'Пройдите 10 уроков', icon: '🎓', category: 'lessons' },
  { id: 'twenty_lessons', name: 'Эрудит', description: 'Пройдите 20 уроков', icon: '🧠', category: 'lessons' },
  { id: 'thirty_lessons', name: 'Историк', description: 'Пройдите 30 уроков', icon: '📜', category: 'lessons' },
  { id: 'all_lessons', name: 'Летописец', description: 'Пройдите все уроки', icon: '🏛️', category: 'lessons' },

  // ===== КАРТОЧКИ =====
  { id: 'mastered_10', name: 'Новичок', description: 'Освойте 10 карточек', icon: '🌱', category: 'cards' },
  { id: 'mastered_25', name: 'Исследователь', description: 'Освойте 25 карточек', icon: '🔍', category: 'cards' },
  { id: 'mastered_50', name: 'Энтузиаст', description: 'Освойте 50 карточек', icon: '📖', category: 'cards' },
  { id: 'mastered_100', name: 'Эксперт', description: 'Освойте 100 карточек', icon: '🏅', category: 'cards' },
  { id: 'mastered_200', name: 'Профессор', description: 'Освойте 200 карточек', icon: '👨‍🏫', category: 'cards' },
  { id: 'mastered_500', name: 'Академик', description: 'Освойте 500 карточек', icon: '🌍', category: 'cards' },

  // ===== ТОЧНОСТЬ =====
  { id: 'perfect_one', name: 'Перфекционист', description: 'Пройдите урок без ошибок', icon: '💎', category: 'accuracy' },
  { id: 'perfect_ten', name: 'Непогрешимый', description: 'Пройдите 10 уроков без ошибок', icon: '✨', category: 'accuracy' },
  { id: 'accuracy_80', name: 'Снайпер', description: 'Достигните 80% точности', icon: '🎯', category: 'accuracy' },
  { id: 'accuracy_90', name: 'Вундеркинд', description: 'Достигните 90% точности', icon: '🏆', category: 'accuracy' },
  { id: 'accuracy_95', name: 'Непогрешимость', description: 'Достигните 95% точности', icon: '👑', category: 'accuracy' },

  // ===== СЕРИЯ =====
  { id: 'streak_3', name: 'Настроение', description: 'Занимайтесь 3 дня подряд', icon: '🔥', category: 'streak' },
  { id: 'streak_7', name: 'Неделя', description: 'Занимайтесь 7 дней подряд', icon: '⚡', category: 'streak' },
  { id: 'streak_14', name: 'Две недели', description: 'Занимайтесь 14 дней подряд', icon: '🌟', category: 'streak' },
  { id: 'streak_30', name: 'Месяц', description: 'Занимайтесь 30 дней подряд', icon: '🌙', category: 'streak' },
  { id: 'streak_100', name: 'Сто дней истории', description: 'Занимайтесь 100 дней подряд', icon: '🏅', category: 'streak' },

  // ===== XP =====
  { id: 'xp_500', name: '500 XP', description: 'Наберите 500 очков опыта', icon: '⭐', category: 'xp' },
  { id: 'xp_1000', name: '1000 XP', description: 'Наберите 1000 очков опыта', icon: '🌟', category: 'xp' },
  { id: 'xp_5000', name: '5000 XP', description: 'Наберите 5000 очков опыта', icon: '🌠', category: 'xp' },
  { id: 'xp_10000', name: '10000 XP', description: 'Наберите 10000 очков опыта', icon: '💫', category: 'xp' },

  // ===== ЭПОХИ =====
  { id: 'era_first_complete', name: 'Первая эпоха', description: 'Завершите первую эпоху', icon: '🗺️', category: 'eras' },
  { id: 'era_three_complete', name: 'Три эпохи', description: 'Завершите 3 эпохи', icon: '🌎', category: 'eras' },
  { id: 'era_all_complete', name: 'Вся история', description: 'Завершите все эпохи', icon: '🌏', category: 'eras' },

  // ===== ПРАВЛЕНИЯ =====
  { id: 'reign_first', name: 'Ценитель', description: 'Пройдите первый тест на правления', icon: '👑', category: 'reigns' },
  { id: 'reign_three', name: 'Эрудит династий', description: 'Пройдите 3 теста на правления', icon: '📜', category: 'reigns' },
  { id: 'reign_all', name: 'Знаток династий', description: 'Пройдите все тесты на правления', icon: '🏺', category: 'reigns' },

  // ===== РАЗНОЕ =====
  { id: 'diagnostic_first', name: 'Прорыв', description: 'Пройдите диагностику эпохи', icon: '🔬', category: 'misc' },
  { id: 'daily_goal_7', name: 'Целеустремлённый', description: 'Выполните дневную цель 7 раз', icon: '💪', category: 'misc' },
];

// ==================== ПРОВЕРКА РАЗБЛОКИРОВКИ ====================

export interface AchievementCheckerInput {
  achievements: string[]; // уже разблокированные
  totalLessonsCompleted: number;
  masteredCards: number;
  goodCards: number;
  learnedCards: number;
  accuracy: number;
  perfectLessons: number;
  streak: number;
  xp: number;
  totalLessons: number;
  totalCards: number;
  completedLessonsCount: number;
  completedReignTestsCount: number;
  totalReignTests: number;
  attemptedDiagnostics: boolean;
  dailyGoalCompleted: boolean;
  dailyGoalCount: number;
}

/** Возвращает список ID ачивок, которые должны быть разблокированы сейчас */
export function getNewlyUnlockedAchievements(input: AchievementCheckerInput): string[] {
  const newlyUnlocked: string[] = [];
  const alreadyUnlocked = new Set(input.achievements);

  // Помощник: проверяет, не разблокировано ли уже
  const check = (id: string, condition: boolean) => {
    if (condition && !alreadyUnlocked.has(id)) {
      newlyUnlocked.push(id);
    }
  };

  // ===== УРОКИ =====
  check('first_lesson', input.totalLessonsCompleted >= 1);
  check('five_lessons', input.totalLessonsCompleted >= 5);
  check('ten_lessons', input.totalLessonsCompleted >= 10);
  check('twenty_lessons', input.totalLessonsCompleted >= 20);
  check('thirty_lessons', input.totalLessonsCompleted >= 30);
  check('all_lessons', input.totalLessonsCompleted >= input.totalLessons);

  // ===== КАРТОЧКИ =====
  check('mastered_10', input.learnedCards >= 10);
  check('mastered_25', input.learnedCards >= 25);
  check('mastered_50', input.learnedCards >= 50);
  check('mastered_100', input.learnedCards >= 100);
  check('mastered_200', input.learnedCards >= 200);
  check('mastered_500', input.learnedCards >= 500);

  // ===== ТОЧНОСТЬ =====
  check('perfect_one', input.perfectLessons >= 1);
  check('perfect_ten', input.perfectLessons >= 10);
  check('accuracy_80', input.accuracy >= 80);
  check('accuracy_90', input.accuracy >= 90);
  check('accuracy_95', input.accuracy >= 95);

  // ===== СЕРИЯ =====
  check('streak_3', input.streak >= 3);
  check('streak_7', input.streak >= 7);
  check('streak_14', input.streak >= 14);
  check('streak_30', input.streak >= 30);
  check('streak_100', input.streak >= 100);

  // ===== XP =====
  check('xp_500', input.xp >= 500);
  check('xp_1000', input.xp >= 1000);
  check('xp_5000', input.xp >= 5000);
  check('xp_10000', input.xp >= 10000);

  // ===== ЭПОХИ — не здесь, в completeLesson смотрим сколько эпох завершено =====

  // ===== ПРАВЛЕНИЯ =====
  check('reign_first', input.completedReignTestsCount >= 1);
  check('reign_three', input.completedReignTestsCount >= 3);
  check('reign_all', input.completedReignTestsCount >= input.totalReignTests);

  // ===== РАЗНОЕ =====
  check('diagnostic_first', input.attemptedDiagnostics);
  check('daily_goal_7', input.dailyGoalCount >= 7);

  return newlyUnlocked;
}