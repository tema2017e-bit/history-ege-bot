import { Question } from '../types';
import { Ruler, reignClusters, rulers, confusedPairs, getAdjacentRulers, findRulerByYear } from '../data/reigns';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Получить дистракторов из того же кластера (соседние/похожие правления)
function getDistractors(targetRuler: Ruler, clusterRulers: Ruler[], count: number): Ruler[] {
  // Приоритет 1: confused pairs — если целевой правитель в путаемой паре
  const confusedTargets = confusedPairs
    .filter(([a, b]) => a === targetRuler.id || b === targetRuler.id)
    .map(([a, b]) => (a === targetRuler.id ? b : a));

  const confusedRulers = confusedTargets
    .map(id => rulers[id])
    .filter(Boolean) as Ruler[];

  // Приоритет 2: соседи (predecessor/successor)
  const adjacent = getAdjacentRulers(targetRuler.id);

  // Приоритет 3: остальные из кластера
  const restOfCluster = clusterRulers.filter(
    r => r.id !== targetRuler.id && !confusedRulers.includes(r) && !adjacent.includes(r)
  );

  // Собираем дистракторов: сначала confused, потом adjacent, потом остальные
  const pool = [...confusedRulers, ...adjacent, ...restOfCluster];
  const unique: Ruler[] = [];
  const seen = new Set<string>();
  for (const r of pool) {
    if (!seen.has(r.id)) {
      seen.add(r.id);
      unique.push(r);
    }
  }

  return getRandomItems(unique, count);
}

// === Тип 1: Кто правил в этот ГОД? ===
// Не показываем годы правления в вариантах — только имена
function generateWhoRuledInYear(clusterRulers: Ruler[]): Question | null {
  const ruler = clusterRulers[Math.floor(Math.random() * clusterRulers.length)];
  const year = ruler.startYear + Math.floor(Math.random() * Math.max(1, ruler.endYear - ruler.startYear));

  const distractors = getDistractors(ruler, clusterRulers, 3);
  if (distractors.length < 2) return null;

  const options = shuffle([ruler.name, ...distractors.slice(0, 3).map(d => d.name)]);

  return {
    id: `q-who-ruled-${ruler.id}-${year}-${Date.now()}`,
    type: 'select-date' as any,
    cardId: `reign-${ruler.id}`,
    prompt: `Кто правил в ${year} году?`,
    correctAnswer: ruler.name,
    options,
    explanation: `${ruler.name} правил с ${ruler.startYear} по ${ruler.endYear || 'наст. время'}. ${ruler.keyEvents.length > 0 ? `Опорные события: ${ruler.keyEvents.slice(0, 2).join('; ')}.` : ''}`,
  };
}

// === Тип 2: Кто правил в этот ПЕРИОД? (выбери по диапазону лет) ===
function generateWhoRuledInPeriod(clusterRulers: Ruler[]): Question | null {
  const ruler = clusterRulers[Math.floor(Math.random() * clusterRulers.length)];
  const distractors = getDistractors(ruler, clusterRulers, 3);
  if (distractors.length < 2) return null;

  const options = shuffle([ruler.name, ...distractors.slice(0, 3).map(d => d.name)]);

  return {
    id: `q-who-ruled-period-${ruler.id}-${Date.now()}`,
    type: 'select-date' as any,
    cardId: `reign-${ruler.id}`,
    prompt: `Кто правил в ${ruler.startYear}–${ruler.endYear || 'наст. время'} годах?`,
    correctAnswer: ruler.name,
    options,
    explanation: `${ruler.name} (${ruler.startYear}–${ruler.endYear || 'наст. время'}). ${ruler.keyEvents.slice(0, 2).join('; ')}.`,
  };
}

// === Тип 3: Выбери годы правления по имени правителя ===
// Дистракторы — диапазоны лет из того же кластера (соседние!)
function generateYearsOfRuler(clusterRulers: Ruler[]): Question | null {
  const ruler = clusterRulers[Math.floor(Math.random() * clusterRulers.length)];

  const wrongYearRanges = getRandomItems(
    clusterRulers.filter(r => r.id !== ruler.id),
    3
  ).map(r => `${r.startYear}–${r.endYear || 'наст. время'}`);

  // Если мало правителей в кластере, генерируем близкие неверные диапазоны
  while (wrongYearRanges.length < 3) {
    const offset = (Math.floor(Math.random() * 3) + 1) * 10;
    const fakeStart = ruler.startYear + (Math.random() > 0.5 ? offset : -offset);
    const fakeEnd = ruler.endYear ? ruler.endYear + offset : fakeStart + 20;
    wrongYearRanges.push(`${fakeStart}–${fakeEnd}`);
  }

  const options = shuffle([`${ruler.startYear}–${ruler.endYear || 'наст. время'}`, ...wrongYearRanges]);

  return {
    id: `q-years-${ruler.id}-${Date.now()}`,
    type: 'select-event' as any,
    cardId: `reign-${ruler.id}`,
    prompt: `Выбери годы правления: ${ruler.name}`,
    correctAnswer: `${ruler.startYear}–${ruler.endYear || 'наст. время'}`,
    options,
    explanation: `${ruler.name}: ${ruler.startYear}–${ruler.endYear || 'наст. время'}. ${ruler.keyEvents.slice(0, 2).join('; ')}.`,
  };
}

// === Тип 4: В чьё правление произошло событие? ===
function generateEventToRuler(clusterRulers: Ruler[]): Question | null {
  // Собираем правителей с событиями
  const withEvents = clusterRulers.filter(r => r.keyEvents.length > 0);
  if (withEvents.length < 2) return null;

  const ruler = withEvents[Math.floor(Math.random() * withEvents.length)];
  const event = ruler.keyEvents[Math.floor(Math.random() * ruler.keyEvents.length)];

  const distractors = getDistractors(ruler, withEvents, 3);
  if (distractors.length < 2) return null;

  const options = shuffle([ruler.name, ...distractors.slice(0, 3).map(d => d.name)]);

  return {
    id: `q-event-${ruler.id}-${Date.now()}`,
    type: 'select-date' as any,
    cardId: `reign-${ruler.id}`,
    prompt: `В чьё правление произошло: "${event}"?`,
    correctAnswer: ruler.name,
    options,
    explanation: `"${event}" — эпоха правления ${ruler.name} (${ruler.startYear}–${ruler.endYear || 'наст. время'}).`,
  };
}

// === Тип 5: Правда / Ложь ===
// Генерируем утверждение о правителе
function generateTrueFalseRuler(clusterRulers: Ruler[]): Question | null {
  const ruler = clusterRulers[Math.floor(Math.random() * clusterRulers.length)];

  // Создаём ложное утверждение, подменяя данные
  const falsifyType = Math.random();

  if (falsifyType < 0.33) {
    // Подменяем годы правления на годы из другого правителя кластера
    const wrongRuler = clusterRulers.find(r => r.id !== ruler.id);
    if (!wrongRuler) return null;
    return {
      id: `q-tf-years-${ruler.id}-${Date.now()}`,
      type: 'true-false' as any,
      cardId: `reign-${ruler.id}`,
      prompt: `${ruler.name} правил в ${wrongRuler.startYear}–${wrongRuler.endYear || 'наст. время'} годах. Это правда?`,
      correctAnswer: 'false',
      options: ['true', 'false'],
      explanation: `Неверно. ${ruler.name} правил в ${ruler.startYear}–${ruler.endYear || 'наст. время'}, а ${wrongRuler.startYear}–${wrongRuler.endYear} — это годы правления ${wrongRuler.name}.`,
    };
  } else if (falsifyType < 0.66) {
    // Подменяем ключевое событие
    const otherRuler = clusterRulers.find(r => r.keyEvents.length > 0 && r.id !== ruler.id);
    if (!otherRuler || otherRuler.keyEvents.length === 0) return null;
    const wrongEvent = otherRuler.keyEvents[Math.floor(Math.random() * otherRuler.keyEvents.length)];
    return {
      id: `q-tf-event-${ruler.id}-${Date.now()}`,
      type: 'true-false' as any,
      cardId: `reign-${ruler.id}`,
      prompt: `"${wrongEvent}" произошло в правление ${ruler.name}. Это правда?`,
      correctAnswer: 'false',
      options: ['true', 'false'],
      explanation: `Неверно. "${wrongEvent}" относится к эпохе ${otherRuler.name}. Ключевые события правления ${ruler.name}: ${ruler.keyEvents.slice(0, 2).join('; ')}.`,
    };
  } else {
    // Правдивое утверждение
    if (ruler.keyEvents.length === 0) return null;
    const event = ruler.keyEvents[Math.floor(Math.random() * ruler.keyEvents.length)];
    return {
      id: `q-tf-true-${ruler.id}-${Date.now()}`,
      type: 'true-false' as any,
      cardId: `reign-${ruler.id}`,
      prompt: `"${event}" произошло в правление ${ruler.name}. Это правда?`,
      correctAnswer: 'true',
      options: ['true', 'false'],
      explanation: `Верно! ${ruler.name} (${ruler.startYear}–${ruler.endYear || 'наст. время'}), ${event}.`,
    };
  }
}

// === Тип 6: Кто правил РАНЬШЕ? (сравни двух) ===
function generateWhoRuledEarlier(clusterRulers: Ruler[]): Question | null {
  const sorted = [...clusterRulers].sort((a, b) => a.startYear - b.startYear);
  if (sorted.length < 4) return null;

  const first = sorted[Math.floor(Math.random() * sorted.length)];
  let second: Ruler;
  do {
    second = sorted[Math.floor(Math.random() * sorted.length)];
  } while (second.id === first.id || Math.abs(first.startYear - second.startYear) > 200);

  const earlier = first.startYear < second.startYear ? first : second;
  const later = first.startYear < second.startYear ? second : first;

  const options = shuffle([earlier.name, later.name]);

  return {
    id: `q-earlier-${earlier.id}-${later.id}-${Date.now()}`,
    type: 'select-date' as any,
    cardId: `reign-${earlier.id}`,
    prompt: `Кто правил раньше: ${first.name} или ${second.name}?`,
    correctAnswer: earlier.name,
    options,
    explanation: `${earlier.name} (${earlier.startYear}–${earlier.endYear || 'текущий'}) правил раньше, чем ${later.name} (${later.startYear}–${later.endYear || 'текущий'}).`,
  };
}

// === Тип 7: Найди лишнего (правитель не из этого кластера) ===
function generateOddOneOut(clusterRulers: Ruler[]): Question | null {
  if (clusterRulers.length < 3) return null;

  // Находим правителя из ДРУГОГО кластера
  const otherClusters = reignClusters.filter(c => c.id !== reignClusters.find(rc => rc.rulerIds.includes(clusterRulers[0].id))?.id);
  if (otherClusters.length === 0) return null;

  const randomCluster = otherClusters[Math.floor(Math.random() * otherClusters.length)];
  const oddRuler = randomCluster.rulerIds.map(id => rulers[id]).find(Boolean);
  if (!oddRuler) return null;

  const correctRulers = getRandomItems(clusterRulers, 3);
  if (correctRulers.length < 3) return null;

  const options = shuffle([oddRuler.name, ...correctRulers.map(r => r.name)]);

  return {
    id: `q-odd-${oddRuler.id}-${Date.now()}`,
    type: 'odd-one-out' as any,
    cardId: `reign-${oddRuler.id}`,
    prompt: 'Какой правитель относится к другой эпохе?',
    correctAnswer: oddRuler.name,
    options,
    explanation: `${oddRuler.name} правил в другую эпоху (${oddRuler.startYear}–${oddRuler.endYear || 'наст. время'}).`,
  };
}

// === Тип 8: Кто был ПРЯМЫМ преемником? ===
function generateSuccessorQuestion(clusterRulers: Ruler[]): Question | null {
  const withSuccessor = clusterRulers.filter(r => r.successor && rulers[r.successor]);
  if (withSuccessor.length < 2) return null;

  const ruler = withSuccessor[Math.floor(Math.random() * withSuccessor.length)];
  const correctSuccessor = rulers[ruler.successor!];

  const distractors = getDistractors(correctSuccessor, clusterRulers, 3);
  if (distractors.length < 2) return null;

  const options = shuffle([correctSuccessor.name, ...distractors.slice(0, 3).map(d => d.name)]);

  return {
    id: `q-successor-${ruler.id}-${Date.now()}`,
    type: 'select-date' as any,
    cardId: `reign-${correctSuccessor.id}`,
    prompt: `Кто правил сразу после: ${ruler.name}?`,
    correctAnswer: correctSuccessor.name,
    options,
    explanation: `После ${ruler.name} (${ruler.startYear}–${ruler.endYear}) правил ${correctSuccessor.name} (${correctSuccessor.startYear}–${correctSuccessor.endYear || 'наст. время'}).`,
  };
}

// === ГЛАВНЫЙ ГЕНЕРАТОР ===
export function generateReignQuestions(
  clusterId: string,
  count: number = 8,
  confusedRulerIds: string[] = [] // правители, которые пользователь путает — им приоритет
): Question[] {
  const cluster = reignClusters.find(c => c.id === clusterId);
  if (!cluster) return [];

  const clusterRulers = cluster.rulerIds.map(id => rulers[id]).filter(Boolean) as Ruler[];
  if (clusterRulers.length < 2) return [];

  // Если есть путаемые правители, даём им приоритет
  let targetRulers = [...clusterRulers];
  if (confusedRulerIds.length > 0) {
    const confused = confusedRulerIds.map(id => rulers[id]).filter(Boolean) as Ruler[];
    const rest = clusterRulers.filter(r => !confused.includes(r));
    // 40% вопросов — путаемые правители
    const confusedCount = Math.max(1, Math.floor(count * 0.4));
    targetRulers = [...confused.slice(0, confusedCount), ...rest];
  }

  const generators = [
    generateWhoRuledInYear,
    generateWhoRuledInPeriod,
    generateYearsOfRuler,
    generateEventToRuler,
    generateTrueFalseRuler,
    generateWhoRuledEarlier,
    generateOddOneOut,
    generateSuccessorQuestion,
  ];

  const questions: Question[] = [];
  let genIndex = 0;
  let safety = 0;

  while (questions.length < count && safety < count * 10) {
    safety++;
    const gen = generators[genIndex % generators.length];
    const question = gen(targetRulers);
    if (question) {
      questions.push(question);
    }
    genIndex++;
  }

  // Перемешиваем, чтобы типы не шли подряд
  return shuffle(questions).slice(0, count);
}
