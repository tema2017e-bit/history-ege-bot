import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, LessonResult, CardProgress, MasteryLevel } from '../types';
import { confusedPairs as confPairs } from '../data/reigns';
import { eras, historyCards } from '../data/historyDates';
import { getTopWeakCards, getFixedCardIds } from '../utils/cardAnalysis';
import { reignClusters } from '../data/reigns';
import { getNewlyUnlockedAchievements } from '../data/achievements';

// ==================== FREEMIUM ====================
// Бесплатно доступны первые 3 эпохи
export const FREE_ERAS_COUNT = 3;
// Адрес API сервера подписок (на VPS)
const SUBSCRIPTION_API_URL = import.meta.env.VITE_SUBSCRIPTION_API_URL || 'https://api.history-ege.ru';

// Получить статус подписки с сервера
export async function checkSubscriptionStatus(tgUser?: AppState['tgUser']): Promise<{ subscription: boolean; freeEras: number }> {
  try {
    const response = await fetch(`${SUBSCRIPTION_API_URL}/api/subscription-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Init-Data': getTelegramInitData() || '',
      },
    });
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return { subscription: data.subscription, freeEras: data.freeEras || FREE_ERAS_COUNT };
  } catch {
    // Если сервер недоступен — считаем пользователя без подписки
    return { subscription: false, freeEras: FREE_ERAS_COUNT };
  }
}

// Вспомогательная функция для получения initData Telegram
function getTelegramInitData(): string | null {
  try {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initData) {
      return (window as any).Telegram.WebApp.initData;
    }
  } catch {}
  return null;
}

// Ключ изменён для принудительного сброса старых битых данных
const STORAGE_KEY = 'history-ege-state-v3';
const HEART_RECOVERY_INTERVAL = 30 * 60 * 1000; // 30 минут в мс

// ==================== НОВАЯ СИСТЕМА ПРОГРЕССИИ ЭПОХ ====================

// Проверить, пройдена ли диагностика по всем предыдущим эпохам
function isAllPreviousErasPassed(targetEraIndex: number, diagnosticResults: AppState['diagnosticResults']): boolean {
  if (targetEraIndex === 0) return true; // Первая эпоха всегда доступна
  
  // Проверяем, что все эпохи с индексом < targetEraIndex пройдены (score >= 70)
  for (let i = 0; i < targetEraIndex; i++) {
    const eraId = eras[i]?.id;
    if (!eraId) continue;
    if (!diagnosticResults[eraId] || diagnosticResults[eraId].score < 70) {
      return false;
    }
  }
  return true;
}

// Получить все предыдущие эпохи для диагностики
function getDiagnosticErasForTarget(targetEraIndex: number): string[] {
  return eras.slice(0, targetEraIndex).map(e => e.id);
}

// Порог прохождения диагностики (70%)
const DIAGNOSTIC_PASS_THRESHOLD = 70;

function getInitialState(): AppState {
  // Только первая эпоха разблокирована по умолчанию
  const firstEra = eras[0]?.id;
  const unlockedEras = firstEra ? [firstEra] : [];
  
  // Разблокируем первые уроки для первой эпохи
  const unlockedLessons: string[] = ['l1'];
  const era = eras[0];
  if (era && era.lessonIds.length > 0) {
    const firstLesson = era.lessonIds[0];
    if (!unlockedLessons.includes(firstLesson)) {
      unlockedLessons.push(firstLesson);
    }
  }

  return {
    hearts: 5,
    maxHearts: 5,
    lastHeartRecoveryAt: Date.now(),
    recoveryPracticeCompleted: false,
    xp: 0,
    level: 1,
    streak: 0,
    lastStudyDate: null,
    completedLessons: [],
    unlockedLessons,
    currentLesson: null,
    completedReignTests: [],
    reignMastery: {},
    cardProgress: {},
    weakCards: [],
    mistakes: [],
    confusedReignPairs: [],
    achievements: [],
    dailyGoal: { targetXp: 30, currentXp: 0 },
    dailyGoalCompleted: false,
    totalCorrectAnswers: 0,
    totalLessonsCompleted: 0,
    perfectLessons: 0,
    longestStreak: 0,
    dailyGoalCount: 0,
    onboardingComplete: false,
    userLevel: 'beginner',
    soundEnabled: true,
    notificationsEnabled: true,
    theme: 'light',
    endlessRecord: 0,
    // Новая система прогрессии
    unlockedEras,
    diagnosticResults: {},
    attemptedDiagnostics: [],
    unlockedAllByAdmin: false,
  };
}

// Принудительно синхронизирует сердца с учётом прошедшего времени.
// Вызывается при каждом возможном взаимодействии с сердцами.
function applyHeartRecovery(state: AppState): AppState {
  if (state.hearts >= state.maxHearts) {
    return { ...state, lastHeartRecoveryAt: Date.now(), recoveryPracticeCompleted: false };
  }

  const now = Date.now();
  const lastAt = state.lastHeartRecoveryAt || now;
  const elapsed = now - lastAt;
  const heartsToAdd = Math.floor(elapsed / HEART_RECOVERY_INTERVAL);

  if (heartsToAdd <= 0) return state;

  const newHearts = Math.min(state.maxHearts, state.hearts + heartsToAdd);
  const actualAdded = newHearts - state.hearts;

  return {
    ...state,
    hearts: newHearts,
    lastHeartRecoveryAt: lastAt + actualAdded * HEART_RECOVERY_INTERVAL,
    recoveryPracticeCompleted: false,
  };
}

// Время до следующего сердца в мс
function getTimeUntilNextHeart(state: AppState): number {
  if (state.hearts >= state.maxHearts) return 0;
  const lastAt = state.lastHeartRecoveryAt || Date.now();
  const nextAt = lastAt + HEART_RECOVERY_INTERVAL;
  return Math.max(0, nextAt - Date.now());
}

function updateMastery(cardProgress: CardProgress, correct: boolean): { newProgress: CardProgress; newLevel: MasteryLevel } {
  const progress = { ...cardProgress };
  if (correct) {
    progress.correctCount += 1;
    progress.interval = Math.max(1, Math.floor(progress.interval * 1.5));
  } else {
    progress.incorrectCount += 1;
    progress.interval = 1;
  }
  progress.lastShown = new Date().toISOString();
  progress.nextReview = new Date(Date.now() + progress.interval * 24 * 60 * 60 * 1000).toISOString();

  const total = progress.correctCount + progress.incorrectCount;
  const ratio = total > 0 ? progress.correctCount / total : 0;
  let newLevel: MasteryLevel;
  if (total === 0) newLevel = 'new';
  else if (ratio < 0.4) newLevel = 'weak';
  else if (ratio < 0.6) newLevel = 'learning';
  else if (ratio < 0.85) newLevel = 'good';
  else if (progress.correctCount >= 5) newLevel = 'mastered';
  else newLevel = 'good';

  return { newProgress: progress, newLevel };
}

function getLevelFromXp(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

const allLessonIds = [
  'l1', 'l2', 'l3', 'l3b', 'l4', 'l5', 'l5b', 'l6', 'l7', 'l7b',
  'l8', 'l9', 'l9b', 'l10', 'l11', 'l11b', 'l12', 'l13', 'l13b',
  'l14', 'l15', 'l15b', 'l16', 'l17', 'l17b', 'l18', 'l19', 'l19b',
  'l20', 'l21', 'l21b', 'l22', 'l23', 'l23b', 'l24', 'l25', 'l25b',
  'l26', 'l27', 'l27b', 'l28', 'l29', 'l29b', 'l30', 'l31', 'l31b',
  'l32', 'l33', 'l33b', 'l34', 'l35', 'l35b', 'l36', 'l37', 'l37b',
  'l38', 'l39', 'l39b', 'l40', 'l41', 'l41b'
];

type StoreActions = {
  answerQuestion: (correct: boolean, cardId: string, isPractice?: boolean, wrongAnswer?: string) => void;
  completeLesson: (result: LessonResult) => void;
  completeReignTest: (eraId: string, correctCount: number, totalCount: number) => void;
  restoreHeart: () => void;
  loseHeart: () => void;
  awardHeartFromPractice: () => boolean;
  updateDailyGoal: (xp: number) => void;
  resetDailyGoal: () => void;
  unlockAchievement: (achievementId: string) => void;
  completeOnboarding: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  toggleSound: () => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setTgUser: (user: AppState['tgUser']) => void;
  resetProgress: () => void;
  updateEndlessRecord: (record: number) => void;
  getCardMastery: (cardId: string) => MasteryLevel;
  getWeakCards: () => string[];
  getMistakesForLesson: () => string[];
  canStartLesson: () => boolean;
  getTimeUntilNextHeart: () => number;
  formatHeartTimer: () => string;
  // === СИСТЕМА ПОВТОРЕНИЯ ===
  getWeakCardsForReview: (maxCount?: number) => string[]; // топ-N слабых карточек
  cleanFixedCards: () => void; // удаляет "исправленные" карточки из weakCards
  // === НОВАЯ СИСТЕМА ПРОГРЕССИИ ===
  isEraUnlocked: (eraId: string) => boolean;
  getEraStatus: (eraId: string) => 'unlocked' | 'locked' | 'completed';
  getDiagnosticEras: (targetEraId: string) => string[];
  submitDiagnosticResult: (targetEraId: string, score: number) => boolean;
  canAttemptDiagnostic: (eraId: string) => boolean;
  getDiagnosticProgress: () => Record<string, { score: number; passedAt: number }>;
};

export const useStore = create<AppState & StoreActions>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      getCardMastery: (cardId: string) => {
        const progress = get().cardProgress[cardId];
        if (!progress) return 'new';
        return progress.mastery;
      },

      getWeakCards: () => {
        return Object.entries(get().cardProgress)
          .filter(([_, p]) => p.mastery === 'weak' || p.mastery === 'learning')
          .map(([id]) => id);
      },

      getMistakesForLesson: () => {
        return get().mistakes.map(m => m.cardId).filter((v, i, a) => a.indexOf(v) === i);
      },

      getTimeUntilNextHeart: () => {
        return getTimeUntilNextHeart(get());
      },

      formatHeartTimer: () => {
        const ms = getTimeUntilNextHeart(get());
        if (ms <= 0) return '00:00';
        const totalSec = Math.ceil(ms / 1000);
        const min = Math.floor(totalSec / 60);
        const sec = totalSec % 60;
        return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
      },

      canStartLesson: () => {
        const s = get();
        const recovered = applyHeartRecovery(s);
        return recovered.hearts > 0;
      },

      answerQuestion: (correct: boolean, cardId: string, isPractice = false, wrongAnswer?: string) => set((state) => {
        // Сначала пересчитываем сердца (восстанавливаем, если прошло время)
        const recovered = applyHeartRecovery(state);
        const hearts = recovered.hearts;
        const lastHeartRecoveryAt = recovered.lastHeartRecoveryAt;

        const xpGain = correct ? (isPractice ? 5 : 10) : 0;
        const newState: Partial<AppState> = { hearts, lastHeartRecoveryAt };

        // ==================== СНАЧАЛА обрабатываем смену дня (ДО начисления XP) ====================
        const today = new Date().toDateString();
        const lastDate = state.lastStudyDate ? new Date(state.lastStudyDate).toDateString() : null;

        if (lastDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastDate === yesterday.toDateString()) {
            newState.streak = state.streak + 1;
          } else {
            newState.streak = 1;
          }
          newState.lastStudyDate = new Date().toISOString();
          // Сброс dailyGoal на новый день (счётчик начинается с 0)
          newState.dailyGoal = { targetXp: 30, currentXp: 0 };
          newState.dailyGoalCompleted = false;
        }

        // ==================== Теперь начисляем XP и обновляем карточки ====================
        const currentProgress = state.cardProgress[cardId] || {
          cardId,
          mastery: 'new' as MasteryLevel,
          correctCount: 0,
          incorrectCount: 0,
          lastShown: null,
          nextReview: null,
          interval: 0,
        };

        const { newProgress, newLevel } = updateMastery(currentProgress, correct);
        newState.cardProgress = { ...state.cardProgress, [cardId]: newProgress };

        if (correct) {
          newState.xp = state.xp + xpGain;
          newState.level = getLevelFromXp(state.xp + xpGain);
          newState.totalCorrectAnswers = state.totalCorrectAnswers + 1;
        }

        // В режиме практики сердца НЕ отнимаются
        if (!correct && !isPractice) {
          // Отнимаем от УЖЕ ВОССТАНОВЛЕННЫХ сердец, а не от старых!
          newState.hearts = Math.max(0, recovered.hearts - 1);
          // При потере сердца перезапускаем таймер восстановления
          newState.lastHeartRecoveryAt = Date.now();
        }

        if (!correct) {
          newState.weakCards = [...new Set([...state.weakCards, cardId])];
          newState.mistakes = [...state.mistakes, { cardId, wrongAnswer: wrongAnswer || '', timestamp: new Date().toISOString() }];

          // Отслеживаем путаемые пары правлений
          if (cardId.startsWith('reign-')) {
            const rulerId = cardId.replace('reign-', '');
            const relatedPairs = confPairs.filter(([a, b]) => a === rulerId || b === rulerId);
            const pairKeys = relatedPairs.map(([a, b]) => `${a}|${b}`);
            const newPairs = [...new Set([...state.confusedReignPairs, ...pairKeys])];
            if (newPairs.length > state.confusedReignPairs.length) {
              newState.confusedReignPairs = newPairs;
            }
          }
        } else {
          if (newLevel === 'good' || newLevel === 'mastered') {
            newState.weakCards = state.weakCards.filter(id => id !== cardId);
          }
        }

        // ==================== Начисляем XP в dailyGoal (уже после сброса, если был новый день) ====================
        if (correct) {
          const baseDailyGoal = newState.dailyGoal || state.dailyGoal;
          newState.dailyGoal = {
            ...baseDailyGoal,
            currentXp: baseDailyGoal.currentXp + xpGain,
          };
          if (newState.dailyGoal.currentXp >= newState.dailyGoal.targetXp && !newState.dailyGoalCompleted && !state.dailyGoalCompleted) {
            newState.dailyGoalCompleted = true;
            newState.dailyGoalCount = (newState.dailyGoalCount ?? state.dailyGoalCount) + 1;
          }
        }

        // Обновляем longestStreak
        const newStreak = newState.streak !== undefined ? newState.streak : state.streak;
        if (newStreak > state.longestStreak) {
          newState.longestStreak = newStreak;
        }

        return { ...state, ...newState };
      }),

      // ==================== XP больше не удваивается ====================
      completeLesson: (result: LessonResult) => set((state) => {
        const newState: Partial<AppState> = {};

        // Добавляем урок в список пройденных
        if (!state.completedLessons.includes(result.lessonId)) {
          newState.completedLessons = [...state.completedLessons, result.lessonId];
        }

        // XP уже начислен per-question в answerQuestion.
        // Здесь добавляем ТОЛЬКО бонус за идеальный урок
        if (result.perfectLesson) {
          newState.xp = state.xp + 50;
          newState.level = getLevelFromXp(state.xp + 50);
          newState.perfectLessons = state.perfectLessons + 1;
        }

        newState.totalLessonsCompleted = state.totalLessonsCompleted + 1;

        // Разблокировка следующего урока (линейная)
        const currentIndex = allLessonIds.indexOf(result.lessonId);
        if (currentIndex >= 0 && currentIndex < allLessonIds.length - 1) {
          const nextLesson = allLessonIds[currentIndex + 1];
          if (!state.unlockedLessons.includes(nextLesson)) {
            newState.unlockedLessons = [...state.unlockedLessons, nextLesson];
          }
        }

        // Авто-разблокировка следующей эпохи
        const currentEra = eras.find(e => e.lessonIds.includes(result.lessonId));
        if (currentEra) {
          const allEraLessonsCompleted = currentEra.lessonIds.every(id => 
            [...state.completedLessons, result.lessonId].includes(id)
          );
          
          if (allEraLessonsCompleted) {
            const currentEraIndex = eras.findIndex(e => e.id === currentEra.id);
            const nextEra = eras[currentEraIndex + 1];
            
            if (nextEra && !state.unlockedEras.includes(nextEra.id)) {
              newState.unlockedEras = [...state.unlockedEras, nextEra.id];
              
              if (nextEra.lessonIds.length > 0) {
                const firstLessonOfNextEra = nextEra.lessonIds[0];
                if (![...state.unlockedLessons, ...(newState.unlockedLessons || [])].includes(firstLessonOfNextEra)) {
                  newState.unlockedLessons = [
                    ...(newState.unlockedLessons || state.unlockedLessons),
                    firstLessonOfNextEra
                  ];
                }
              }
              
              newState.xp = (newState.xp !== undefined ? newState.xp : state.xp) + 100;
              newState.level = getLevelFromXp(newState.xp);
            }
          }
        }

        // Добавляем ошибки в список
        if (result.mistakes.length > 0) {
          const newMistakes = result.mistakes.map(m => ({
            ...m,
            timestamp: new Date().toISOString(),
          }));
          newState.mistakes = [...state.mistakes, ...newMistakes];
        }
        
        const finalState = { ...state, ...newState };
        return checkAndUnlockAchievements(finalState);
      }),

      completeReignTest: (eraId: string, correctCount: number, totalCount: number) => set((state) => {
        const score = Math.round((correctCount / totalCount) * 100);
        const xpEarned = correctCount * 8;
        const testId = `reign-${eraId}`;

        const newState = {
          completedReignTests: state.completedReignTests.includes(testId)
            ? state.completedReignTests
            : [...state.completedReignTests, testId],
          reignMastery: {
            ...state.reignMastery,
            [eraId]: Math.max(state.reignMastery[eraId] || 0, score),
          },
          xp: state.xp + xpEarned,
          level: getLevelFromXp(state.xp + xpEarned),
        };

        const finalState = { ...state, ...newState };
        return checkAndUnlockAchievements(finalState);
      }),

      restoreHeart: () => set((state) => ({
        hearts: Math.min(state.maxHearts, state.hearts + 1),
      })),

      loseHeart: () => set((state) => ({
        hearts: Math.max(0, state.hearts - 1),
        lastHeartRecoveryAt: Date.now(),
      })),

      awardHeartFromPractice: () => {
        const state = get();
        if (state.hearts >= state.maxHearts) return false;
        if (state.recoveryPracticeCompleted) return false;

        set({
          hearts: state.hearts + 1,
          recoveryPracticeCompleted: true,
        });
        return true;
      },

      updateDailyGoal: (xp: number) => set((state) => {
        const newCurrent = state.dailyGoal.currentXp + xp;
        return {
          dailyGoal: { ...state.dailyGoal, currentXp: newCurrent },
          dailyGoalCompleted: newCurrent >= state.dailyGoal.targetXp ? true : state.dailyGoalCompleted,
        };
      }),

      resetDailyGoal: () => set((state) => ({
        dailyGoal: { targetXp: state.dailyGoal.targetXp, currentXp: 0 },
        dailyGoalCompleted: false,
      })),

      unlockAchievement: (achievementId: string) => set((state) => {
        if (state.achievements.includes(achievementId)) return {};
        return { achievements: [...state.achievements, achievementId] };
      }),

      completeOnboarding: (level: 'beginner' | 'intermediate' | 'advanced') => set({
        onboardingComplete: true,
        userLevel: level,
      }),

      toggleSound: () => set((state) => ({
        soundEnabled: !state.soundEnabled,
      })),

      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light',
      })),

      setTheme: (theme: 'light' | 'dark') => set({ theme }),

      setTgUser: (user: AppState['tgUser']) => set({ tgUser: user }),

      resetProgress: () => {
        localStorage.removeItem(STORAGE_KEY);
        set(getInitialState());
      },

      updateEndlessRecord: (record: number) => set((state) => {
        if (record > state.endlessRecord) {
          return { endlessRecord: record };
        }
        return {};
      }),

      // === СИСТЕМА ПОВТОРЕНИЯ ===
      getWeakCardsForReview: (maxCount = 30) => {
        const state = get();
        const entries = getTopWeakCards(historyCards, state.cardProgress, maxCount);
        return entries.map(e => e.card.id);
      },

      cleanFixedCards: () => {
        const state = get();
        const fixedIds = getFixedCardIds(state.cardProgress, state.weakCards);
        if (fixedIds.length === 0) return;
        set({
          weakCards: state.weakCards.filter(id => !fixedIds.includes(id)),
        });
      },

      // === НОВАЯ СИСТЕМА ПРОГРЕССИИ ===
      isEraUnlocked: (eraId: string) => {
        const s = get();
        if (s.unlockedAllByAdmin) return true;
        return s.unlockedEras.includes(eraId);
      },

      getEraStatus: (eraId: string) => {
        const era = eras.find(e => e.id === eraId);
        if (!era) return 'locked';
        
        const { completedLessons, unlockedEras, unlockedAllByAdmin } = get();
        
        if (unlockedAllByAdmin) return 'unlocked';
        if (!unlockedEras.includes(eraId)) return 'locked';
        
        const allLessonsCompleted = era.lessonIds.every(id => completedLessons.includes(id));
        if (allLessonsCompleted) return 'completed';
        
        return 'unlocked';
      },

      getDiagnosticEras: (targetEraId: string) => {
        const targetEra = eras.find(e => e.id === targetEraId);
        if (!targetEra) return [];
        return getDiagnosticErasForTarget(targetEra.index);
      },

      canAttemptDiagnostic: (eraId: string) => {
        const { unlockedEras, unlockedAllByAdmin, diagnosticResults } = get();
        
        if (unlockedAllByAdmin) return false;
        if (unlockedEras.includes(eraId)) return false;
        
        const diag = diagnosticResults[eraId];
        if (diag && diag.score >= DIAGNOSTIC_PASS_THRESHOLD) return false;
        
        return true;
      },

      submitDiagnosticResult: (targetEraId: string, score: number) => {
        const targetEra = eras.find(e => e.id === targetEraId);
        if (!targetEra) return false;
        
        const { unlockedEras, diagnosticResults, attemptedDiagnostics } = get();
        
        if (unlockedEras.includes(targetEraId)) return false;
        
        const passed = score >= DIAGNOSTIC_PASS_THRESHOLD;
        const newDiagnosticResults = {
          ...diagnosticResults,
          [targetEraId]: { score, passedAt: Date.now() },
        };
        const newAttemptedDiagnostics = [...new Set([...attemptedDiagnostics, targetEraId])];
        
        if (passed) {
          const newUnlockedEras = [...new Set([...unlockedEras, targetEraId])];
          
          const newUnlockedLessons = [...get().unlockedLessons];
          if (targetEra.lessonIds.length > 0) {
            const firstLesson = targetEra.lessonIds[0];
            if (!newUnlockedLessons.includes(firstLesson)) {
              newUnlockedLessons.push(firstLesson);
            }
          }
          
          set({
            unlockedEras: newUnlockedEras,
            unlockedLessons: newUnlockedLessons,
            diagnosticResults: newDiagnosticResults,
            attemptedDiagnostics: newAttemptedDiagnostics,
            xp: get().xp + 50,
          });
          
          return true;
        } else {
          set({
            diagnosticResults: newDiagnosticResults,
            attemptedDiagnostics: newAttemptedDiagnostics,
          });
          
          return false;
        }
      },

      getDiagnosticProgress: () => {
        return get().diagnosticResults;
      },

    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        if (version < 2) {
          return getInitialState();
        }
        return persistedState as AppState & StoreActions;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          const recovered = applyHeartRecovery(state);
          if (recovered.hearts !== state.hearts) {
            useStore.setState({ hearts: recovered.hearts, lastHeartRecoveryAt: recovered.lastHeartRecoveryAt });
          }
        }
      },
    }
  )
);

// ==================== АВТО-РАЗБЛОКИРОВКА ДОСТИЖЕНИЙ ====================

function checkAndUnlockAchievements(state: AppState): AppState {
  const masteredCards = Object.values(state.cardProgress).filter(p => p.mastery === 'mastered').length;
  const goodCards = Object.values(state.cardProgress).filter(p => p.mastery === 'good').length;
  const learnedCards = masteredCards + goodCards;
  const totalAttempts = state.totalCorrectAnswers + state.mistakes.length;
  const accuracy = totalAttempts > 0 ? Math.round((state.totalCorrectAnswers / totalAttempts) * 100) : 0;
  const totalLessons = 41;
  const totalReignTests = reignClusters.length;

  const newlyUnlocked = getNewlyUnlockedAchievements({
    achievements: state.achievements,
    totalLessonsCompleted: state.totalLessonsCompleted,
    masteredCards,
    goodCards,
    learnedCards,
    accuracy,
    perfectLessons: state.perfectLessons,
    streak: state.streak,
    xp: state.xp,
    totalLessons,
    totalCards: historyCards.length,
    completedLessonsCount: state.completedLessons.length,
    completedReignTestsCount: state.completedReignTests.length,
    totalReignTests,
    attemptedDiagnostics: state.attemptedDiagnostics.length > 0,
    dailyGoalCompleted: state.dailyGoalCompleted,
    dailyGoalCount: state.dailyGoalCount,
  });

  if (newlyUnlocked.length === 0) return state;

  return {
    ...state,
    achievements: [...state.achievements, ...newlyUnlocked],
  };
}

setInterval(() => {
  const state = useStore.getState();
  const recovered = applyHeartRecovery(state);
  if (recovered.hearts > state.hearts) {
    useStore.setState({ hearts: recovered.hearts, lastHeartRecoveryAt: recovered.lastHeartRecoveryAt });
  }
}, 60000);

// ==================== АДМИН-ФУНКЦИИ: РАЗБЛОКИРОВАТЬ / ЗАБЛОКИРОВАТЬ ВСЁ ====================

export function unlockAllEras() {
  const state = useStore.getState();
  
  const allEraIds = eras.map(e => e.id);
  const allLessonIdsArray = eras.flatMap(e => e.lessonIds);
  
  useStore.setState({
    unlockedAllByAdmin: true,
    unlockedEras: allEraIds,
    unlockedLessons: [...new Set([...state.unlockedLessons, ...allLessonIdsArray])],
  });
}

export function lockAllEras() {
  const state = useStore.getState();
  
  // Возвращаем к исходному состоянию — только первая эпоха
  const firstEra = eras[0]?.id;
  const unlockedEras = firstEra ? [firstEra] : [];
  const unlockedLessons = ['l1'];
  const era = eras[0];
  if (era && era.lessonIds.length > 0) {
    const firstLesson = era.lessonIds[0];
    if (!unlockedLessons.includes(firstLesson)) {
      unlockedLessons.push(firstLesson);
    }
  }
  
  useStore.setState({
    unlockedAllByAdmin: false,
    unlockedEras,
    unlockedLessons,
  });
}
