import { HistoryCard, CardProgress, MasteryLevel } from '../types';

export interface WeakCardEntry {
  card: HistoryCard;
  progress: CardProgress;
  wrongCount: number;
  totalAttempts: number;
  accuracy: number; // 0..1, чем ниже — тем хуже
  lastShown: number | null; // timestamp
  score: number; // комбинированный рейтинг (выше = нужно повторить раньше)
}

/**
 * Отбирает топ-30 карточек для повторения, сортируя по приоритету.
 *
 * Критерии сортировки (по убыванию важности):
 * 1. wrongCount (incorrectCount) — чем больше ошибок, тем выше
 * 2. accuracy (correctCount / totalAttempts) — чем ниже точность, тем выше
 * 3. lastShown — чем давнее показана, тем выше
 * 4. totalAttempts — чем больше попыток с ошибками, тем выше
 *
 * Карточки без попыток (totalAttempts === 0) не включаются.
 * Возвращает максимум 30 карточек.
 */
export function getTopWeakCards(
  allCards: HistoryCard[],
  cardProgress: Record<string, CardProgress>,
  maxCount = 30
): WeakCardEntry[] {
  const entries: WeakCardEntry[] = [];

  for (const [cardId, progress] of Object.entries(cardProgress)) {
    const total = progress.correctCount + progress.incorrectCount;
    if (total === 0) continue; // нет попыток
    if (progress.incorrectCount === 0 && progress.correctCount > 0) continue; // ни одной ошибки — не слабая

    const card = allCards.find(c => c.id === cardId);
    if (!card) continue;

    const accuracy = total > 0 ? progress.correctCount / total : 0;
    const wrongCount = progress.incorrectCount;
    const lastShown = progress.lastShown ? new Date(progress.lastShown).getTime() : null;

    // Комбинированный score: чем выше, тем нужнее повторение
    // wrongCount даёт основной вес, accuracy даёт модификатор, lastShown — бонус за старость
    const timeSinceLastShown = lastShown ? (Date.now() - lastShown) / (1000 * 60 * 60 * 24) : 999; // дни
    const accuracyPenalty = Math.max(0, 1 - accuracy) * 50; // 0..50
    const wrongScore = wrongCount * 100; // 0..∞
    const timeBonus = Math.min(timeSinceLastShown, 30); // максимум 30 дней бонуса

    const score = wrongScore + accuracyPenalty + timeBonus + (total > 0 ? total : 0);

    entries.push({
      card,
      progress,
      wrongCount,
      totalAttempts: total,
      accuracy,
      lastShown,
      score,
    });
  }

  // Сортировка по score (убывание)
  entries.sort((a, b) => b.score - a.score);

  // Возвращаем топ-N
  return entries.slice(0, maxCount);
}

/**
 * Проверяет, нужно ли удалить карточку из списка слабых.
 * Карточка считается "исправленной", если:
 * - accuracy >= 0.75 И totalAttempts >= 3
 * - ИЛИ mastery === 'mastered'
 * - ИЛИ последние 3 ответа были правильными (определяем по correctCount - incorrectCount >= 2 при correctCount >= 3)
 */
export function isCardFixed(progress: CardProgress): boolean {
  const total = progress.correctCount + progress.incorrectCount;
  if (total === 0) return false;

  const accuracy = progress.correctCount / total;

  // Если мастерство mastered — точно фиксирована
  if (progress.mastery === 'mastered') return true;

  // Высокая точность при достаточном числе попыток
  if (accuracy >= 0.75 && total >= 3) return true;

  // Если correctCount значительно больше incorrectCount
  if (progress.correctCount >= 3 && (progress.correctCount - progress.incorrectCount) >= 2) return true;

  return false;
}

/**
 * Возвращает ID карточек, которые стоит удалить из weakCards.
 */
export function getFixedCardIds(
  cardProgress: Record<string, CardProgress>,
  currentWeakCardIds: string[]
): string[] {
  return currentWeakCardIds.filter(id => {
    const progress = cardProgress[id];
    if (!progress) return false;
    return isCardFixed(progress);
  });
}