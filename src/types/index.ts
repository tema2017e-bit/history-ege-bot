// ==================== ТИПЫ ДАННЫХ ====================

export interface HistoryCard {
  id: string;
  year: string;
  event: string;
  period: string;
  era: string;
  ruler?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface Lesson {
  id: string;
  title: string;
  era: string;
  eraIndex: number;
  description: string;
  cardIds: string[];
  type: 'core' | 'review' | 'boss' | 'mistakes' | 'blitz';
  unlockRequirement?: string; // ID урока, который нужно пройти
  xpReward: number;
}

export interface Era {
  id: string;
  index: number;
  name: string;
  shortName: string;
  color: string;
  icon: string;
  description: string;
  lessonIds: string[];
  yearRange: string;
}

// ==================== ТИПЫ ЗАДАНИЙ ====================

export type QuestionType = 
  | 'select-date'        // Выбери дату для события
  | 'select-event'       // Выбери событие для даты
  | 'input-year'          // Введи год вручную
  | 'input-text'          // Введи текст (имя, термин)
  | 'match-pairs'        // Сопоставь пары
  | 'timeline-order'     // Расположи по хронологии
  | 'true-false'         // Правда / ложь
  | 'fill-blank'         // Заполни пропуск
  | 'odd-one-out'        // Выбери лишнее
  | 'who-is'             // Кто это? — угадай личность
  | 'quote-author'       // Цитата → автор
  | 'quiz-summary'       // Мини-квиз в конце темы
  | 'define-term'        // Выбери определение термина
  | 'identify-term'      // Назови термин по определению
  | 'select-term-by-era' // Выбери термин, относящийся к данной эпохе
  // НОВЫЕ типы (качественные задания по терминам)
  | 'term-by-context'    // Термин по исторической ситуации
  | 'term-by-function'   // Какое явление выполняло функцию X?
  | 'term-distinguish'   // Различение двух близких терминов
  | 'term-odd-one-out'   // Какой термин лишний среди 4
  | 'term-by-consequence'// Какое явление привело к последствию X?
  | 'term-scenario'      // Термин по мини-исторической ситуации
  // НОВЫЕ интерактивные форматы
  | 'grouping'           // Группировка по категориям (drag-and-drop)
  | 'missing-word'       // Вставь пропущенное слово (не год)
  | 'multiple-correct'   // Выбери ВСЕ правильные варианты
  | 'dialog-card';       // Flip-карточка для запоминания

// Режим ввода: year — только цифры и тире, text — любой текст
export type InputMode = 'year' | 'text';

export interface Question {
  id: string;
  type: QuestionType;
  cardId: string; // Основная карточка вопроса
  prompt: string;
  correctAnswer: string | string[];
  options?: string[]; // Для вопросов с вариантами ответов
  explanation: string;
  pairs?: { date: string; event: string }[]; // Для match-pairs
  timelineItems?: string[]; // Для timeline-order
  inputMode?: InputMode; // Для input-year (year) / input-text (text)
  acceptableAnswers?: string[]; // Дополнительные правильные варианты (текстовые ответы)
  aliases?: string[]; // Синонимы / упрощённые варианты (для мягкого сравнения)
  // === Новые поля для новых типов ===
  categories?: string[]; // Для grouping — названия категорий
  groupItems?: string[]; // Для grouping — элементы для распределения
  groupAnswer?: Record<string, string[]>; // Для grouping — правильное распределение по категориям
  missingWord?: string; // Для missing-word — скрытое слово
  missingHint?: string; // Для missing-word — подсказка
  scenarioSteps?: { text: string; options: { label: string; next: number; isCorrect?: boolean }[] }[]; // Для what-if
  multiCorrectAnswers?: string[]; // Для multiple-correct
}

export interface LessonQuestion {
  question: Question;
  attempts: number;
  correct: boolean;
}

// ==================== СОСТОЯНИЕ КАРТОЧКИ ====================

export type MasteryLevel = 'new' | 'learning' | 'weak' | 'good' | 'mastered';

export interface CardProgress {
  cardId: string;
  mastery: MasteryLevel;
  correctCount: number;
  incorrectCount: number;
  lastShown: string | null; // ISO date
  nextReview: string | null; // ISO date
  interval: number; // дней до следующего повтора
}

// ==================== ДОСТИЖЕНИЯ ====================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  unlocked: boolean;
  unlockedAt?: string;
}

// ==================== СОСТОЯНИЕ ПРИЛОЖЕНИЯ ====================

export interface DailyGoal {
  targetXp: number;
  currentXp: number;
}

export interface AppState {
  // Основные ресурсы
  hearts: number;
  maxHearts: number;
  lastHeartRecoveryAt: number | null; // timestamp последнего пересчёта жизней
  recoveryPracticeCompleted: boolean; // можно ли пройти тренировку ещё раз
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string | null;
  
  // Прогресс обучения
  completedLessons: string[];
  unlockedLessons: string[];
  currentLesson: string | null;
  completedReignTests: string[]; // IDs пройденных тестов на правления
  reignMastery: Record<string, number>; // reignId -> score 0-100
  
  // Карточки и mastery
  cardProgress: Record<string, CardProgress>;
  weakCards: string[];
  mistakes: { cardId: string; wrongAnswer: string; timestamp: string }[];
  confusedReignPairs: string[]; // ["ruler1|ruler2"] — пары правителей, которые путает
  
  // Достижения
  achievements: string[]; // IDs разблокированных
  
  // Ежедневная цель
  dailyGoal: DailyGoal;
  dailyGoalCompleted: boolean;
  dailyGoalCount: number; // сколько раз выполнена ежедневная цель
  
  // Статистика
  totalCorrectAnswers: number;
  totalLessonsCompleted: number;
  perfectLessons: number;
  longestStreak: number;
  
  // Onboarding
  onboardingComplete: boolean;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  
  // Настройки
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark';

  // Рекорд в режиме "Бесконечный поток"
  endlessRecord: number;

  // Telegram Mini App
  tgUser?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
  };

  // === НОВАЯ СИСТЕМА ПРОГРЕССИИ ===
  // Разблокированные эпохи (эпохи, к которым пользователь имеет доступ)
  unlockedEras: string[];
  // Результаты диагностических тестов: eraId -> { score, passedAt }
  diagnosticResults: Record<string, { score: number; passedAt: number }>;
  // Эпохи, по которым пользователь проходил диагностику (независимо от результата)
  attemptedDiagnostics: string[];
  // Флаг — все эпохи открыты админом (через URL-параметр)
  unlockedAllByAdmin: boolean;

}

// ==================== РЕЗУЛЬТАТ УРОКА ====================

export interface LessonResult {
  lessonId: string;
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number;
  heartsLost: number;
  perfectLesson: boolean;
  mistakes: { cardId: string; wrongAnswer: string }[];
  duration: number; // секунд
}

// ==================== МАГАЗИН / КОСМЕТИКА ====================

export type CosmeticType =
  | 'theme'
  | 'profile_icon'
  | 'profile_frame'
  | 'card_style'
  | 'badge'
  | 'progress_bar'
  | 'avatar_accent';

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  type: CosmeticType;
  price: number;
  icon: string;
  rarity: Rarity;
  preview?: string; // CSS-цвет или emoji для превью
  applyLabel?: string;
}

// ==================== ТИПЫ ТЕОРИИ (раздел ЕГЭ) ====================

export interface TheoryDate {
  year: string;
  event: string;
}

export interface TheoryRuler {
  name: string;
  years: string;
  description?: string;
}

export interface TheoryPerson {
  name: string;
  role: string;
  fact: string;
}

export interface TheoryCausalLink {
  cause: string;
  effect: string;
}

export interface TheorySection {
  id: string;
  title: string;
  shortTitle: string;
  icon: string;
  color: string;
  yearRange: string;
  topics: TheoryTopic[];
}

export interface TheoryTopic {
  id: string;
  title: string;
  timeRange: string;
  // Связанные cardIds из historyDates (для перехода к практике)
  relatedCardIds?: string[];
  // Связанные уроки
  relatedLessonIds?: string[];
  // Блоки содержания
  content: {
    rulers?: TheoryRuler[];
    keyDates?: TheoryDate[];
    events?: string[];
    results?: string[];
    terms?: { term: string; definition: string }[];
    persons?: TheoryPerson[];
    keyFacts?: string[];
    causalLinks?: TheoryCausalLink[];
    examFocus?: string[];
  };
}

// ==================== ТИПЫ ДЕЙСТВИЙ STORE ====================

export type StoreAction =
  | { type: 'ANSWER_QUESTION'; correct: boolean; cardId: string; xpGain: number }
  | { type: 'COMPLETE_LESSON'; result: LessonResult }
  | { type: 'RESTORE_HEART'; count: number }
  | { type: 'LOSE_HEART' }
  | { type: 'UPDATE_DAILY_GOAL'; xp: number }
  | { type: 'RESET_DAILY_GOAL' }
  | { type: 'UNLOCK_ACHIEVEMENT'; achievementId: string }
  | { type: 'COMPLETE_ONBOARDING'; level: 'beginner' | 'intermediate' | 'advanced' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'LOAD_STATE'; state: Partial<AppState> }
  | { type: 'SET_TG_USER'; user: AppState['tgUser'] }
  | { type: 'SET_THEME'; theme: 'light' | 'dark' };
