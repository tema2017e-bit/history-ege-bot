import { HistoryCard, Question } from '../types';
import { eras } from '../data/historyDates';

// ==================== УТИЛИТЫ ====================

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRandomItems<T>(array: T[], count: number, exclude?: T): T[] {
  const filtered = exclude ? array.filter(item => item !== exclude) : array;
  const shuffled = shuffle(filtered);
  return shuffled.slice(0, count);
}

/** Извлекает первый год из строки (поддерживает 882, 882–945, 1991, 24.02.2022) */
function extractYear(yearStr: string): number | null {
  const cleaned = yearStr.trim().replace(/^[IVXLCDM]+\s*–\s*/g, '');
  const match = cleaned.match(/(\d{3,4})/);
  if (match) return parseInt(match[1]);
  return null;
}

function findEraName(eraId: string): string {
  const era = eras.find(e => e.id === eraId);
  return era?.name || eraId;
}

function getYearBadge(year: string): string {
  const num = extractYear(year);
  if (num && num < 1000) return `${num}-е гг.`;
  if (num) return `${num} г.`;
  return year;
}

// ==================== ТИПЫ ЗАДАНИЙ (только про даты) ====================

/** 1. Хронологическая дуэль: два события — какое произошло раньше? */
function generateChronoDuel(
  cards: HistoryCard[],
  index: number
): Question | null {
  if (cards.length < 2) return null;

  const card1 = cards[index % cards.length];
  let card2: HistoryCard;
  do {
    card2 = cards[Math.floor(Math.random() * cards.length)];
  } while (card2.id === card1.id);

  const year1 = extractYear(card1.year);
  const year2 = extractYear(card2.year);
  if (!year1 || !year2) return null;

  if (year1 === year2) return null;

  const earlierCard = year1 < year2 ? card1 : card2;
  const laterCard = year1 < year2 ? card2 : card1;

  return {
    id: `date-chronoduel-${index}-${Date.now()}`,
    type: 'select-event',
    cardId: card1.id,
    prompt: `⚔️ Хронологическая дуэль!\n\nКакое событие произошло РАНЬШЕ?`,
    correctAnswer: earlierCard.event,
    options: shuffle([earlierCard.event, laterCard.event]),
    explanation: `«${earlierCard.event}» (${earlierCard.year}) → «${laterCard.event}» (${laterCard.year})`,
  };
}

/** 2. Правда или ложь: утверждение о годе события */
function generateTrueFalse(
  cards: HistoryCard[],
  index: number
): Question | null {
  const card = cards[index % cards.length];
  const year = extractYear(card.year);
  if (!year) return null;

  const isTrue = Math.random() < 0.5;
  const fakeYear = isTrue
    ? year
    : (year + (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1));

  const statement = `«${card.event}» произошло в ${fakeYear} году`;

  return {
    id: `date-truefalse-${index}-${Date.now()}`,
    type: 'true-false',
    cardId: card.id,
    prompt: `🤔 Правда или ложь?\n\n${statement}`,
    correctAnswer: isTrue ? 'true' : 'false',
    options: ['true', 'false'],
    explanation: `«${card.event}» — ${card.year}. ${isTrue ? 'Утверждение верно ✓' : 'Утверждение неверно ✗'}`,
  };
}

/** 3. Сопоставь события и даты (match-pairs) */
function generateMatchPairs(
  cards: HistoryCard[],
  startIndex: number
): Question | null {
  const selected: HistoryCard[] = [];
  for (let i = 0; i < 4; i++) {
    const card = cards[(startIndex + i) % cards.length];
    const year = extractYear(card.year);
    if (year && !selected.find(c => c.id === card.id)) {
      selected.push(card);
    }
    if (selected.length === 4) break;
  }

  if (selected.length < 3) return null;

  const pairs = selected.map(c => ({
    date: getYearBadge(c.year),
    event: c.event,
  }));

  return {
    id: `date-match-${startIndex}-${Date.now()}`,
    type: 'match-pairs',
    cardId: selected[0].id,
    prompt: `🔗 Сопоставь события с их датами`,
    correctAnswer: JSON.stringify(pairs),
    options: shuffle(pairs.map(p => p.date)),
    pairs,
    explanation: `Все события сопоставлены с правильными датами. Молодец!`,
  };
}

/** 4. Быстрый опрос: выбери год для события (из 4 вариантов) */
function generateQuickSelect(
  cards: HistoryCard[],
  index: number
): Question | null {
  const card = cards[index % cards.length];
  const year = extractYear(card.year);
  if (!year) return null;

  const distractorYears: number[] = [];
  for (const c of cards) {
    const y = extractYear(c.year);
    if (y && y !== year) distractorYears.push(y);
    if (distractorYears.length >= 10) break;
  }

  const options = shuffle([
    getYearBadge(card.year),
    ...getRandomItems(distractorYears.map(y => getYearBadge(String(y))), 3),
  ]);

  return {
    id: `date-quick-${index}-${Date.now()}`,
    type: 'select-date',
    cardId: card.id,
    prompt: `🎯 Когда произошло событие?\n\n«${card.event}»`,
    correctAnswer: getYearBadge(card.year),
    options,
    explanation: `«${card.event}» — ${card.year}. Эпоха: ${findEraName(card.era)}`,
  };
}

/** 5. Найди событие по дате */
function generateFindEvent(
  cards: HistoryCard[],
  index: number
): Question | null {
  const card = cards[index % cards.length];

  const distractorEvents = getRandomItems(
    cards.filter(c => c.id !== card.id),
    3,
    undefined as any
  ).map(c => c.event);

  const options = shuffle([card.event, ...distractorEvents]);

  return {
    id: `date-findevent-${index}-${Date.now()}`,
    type: 'select-event',
    cardId: card.id,
    prompt: `🔎 Какое событие произошло в ${card.year}?`,
    correctAnswer: card.event,
    options,
    explanation: `${card.year} — «${card.event}». Эпоха: ${findEraName(card.era)}`,
  };
}

/** 6. Введи год события (input-year) */
function generateInputYear(
  cards: HistoryCard[],
  index: number
): Question | null {
  const card = cards[index % cards.length];
  const year = extractYear(card.year);
  if (!year) return null;

  return {
    id: `date-inputyear-${index}-${Date.now()}`,
    type: 'input-year',
    cardId: card.id,
    prompt: `✍️ Введи год события:\n\n«${card.event}»`,
    correctAnswer: card.year,
    inputMode: 'year',
    explanation: `«${card.event}» — ${card.year}`,
  };
}

// ==================== ОСНОВНЫЕ ФУНКЦИИ ====================

const questionGenerators: ((cards: HistoryCard[], index: number) => (Question | null))[] = [
  generateChronoDuel,
  generateTrueFalse,
  generateMatchPairs,
  generateQuickSelect,
  generateFindEvent,
  generateInputYear,
];

const generatorNames: Record<string, string> = {
  'date-chronoduel': '⚔️ Хронологическая дуэль',
  'date-truefalse': '🤔 Правда или ложь',
  'date-match': '🔗 Сопоставь пары',
  'date-quick': '🎯 Быстрый опрос',
  'date-findevent': '🔎 Найди событие',
  'date-inputyear': '✍️ Введи год',
};

export function getDateGeneratorName(questionId: string): string {
  const prefix = questionId.split('-').slice(0, 2).join('-');
  return generatorNames[prefix] || '📚 Дата';
}

/**
 * Генерирует набор заданий для режима чистого заучивания дат.
 * @param cards - массив всех карточек (HistoryCard[])
 * @param count - количество вопросов (по умолчанию 12)
 * @returns массив Question[]
 */
export function generateDateMemoryQuestions(
  cards: HistoryCard[],
  count: number = 12
): Question[] {
  if (cards.length === 0) return [];

  const questions: Question[] = [];
  const shuffledCards = shuffle(cards);
  const usedGenerators = new Set<number>();

  for (let i = 0; i < count; i++) {
    let genIndex: number;
    if (usedGenerators.size < questionGenerators.length) {
      do {
        genIndex = Math.floor(Math.random() * questionGenerators.length);
      } while (usedGenerators.has(genIndex));
      usedGenerators.add(genIndex);
    } else {
      genIndex = i % questionGenerators.length;
    }

    const generator = questionGenerators[genIndex];
    const question = generator(shuffledCards, i);
    if (question) {
      questions.push(question);
    }
  }

  return shuffle(questions).slice(0, count);
}

/**
 * Генерирует вопросы для определённой эпохи.
 */
export function generateDateMemoryQuestionsForEra(
  eraId: string,
  allCards: HistoryCard[],
  count: number = 10
): Question[] {
  const eraCards = allCards.filter(c => c.era === eraId);
  if (eraCards.length === 0) return [];
  return generateDateMemoryQuestions(eraCards, count);
}

/**
 * Генерирует вопросы для конкретного урока (по его cardIds).
 */
export function generateDateMemoryQuestionsForLesson(
  cardIds: string[],
  allCards: HistoryCard[],
  count: number = 10
): Question[] {
  const lessonCards = cardIds
    .map(id => allCards.find(c => c.id === id))
    .filter((c): c is HistoryCard => c !== undefined);
  if (lessonCards.length === 0) return [];
  return generateDateMemoryQuestions(lessonCards, count);
}