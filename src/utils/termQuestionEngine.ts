/**
 * Улучшенный движок генерации вопросов по историческим терминам.
 *
 * Ключевые принципы:
 * 1. Вопросы проверяют ПОНИМАНИЕ, а не узнавание слов
 * 2. Дистракторы подбираются только из ТЕКУЩЕЙ ЭПОХИ (не смешиваем эпохи)
 * 3. Запрещены угадайки по совпадению слов/корней/имён
 * 4. Разнообразие типов вопросов (6 типов)
 * 5. Если данных недостаточно — вопрос не создаётся
 * 6. explanation строится строго на полях termMeta (definition, function, consequence, typicalMistake)
 */

import { Question, HistoryCard } from '../types';
import { termMetaList, getTermMetaByEra, getTermMeta, TermMeta } from '../data/termMeta';
import { eras } from '../data/historyDates';

// ==================== ВСПОМОГАТЕЛЬНЫЕ ====================

let questionCounter = 100000;

function nextId(type: string): string {
  return `term-${type}-${++questionCounter}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Проверяет, есть ли у двух строк общие корни (запрет угадывания по совпадению слов).
 */
function hasWordOverlap(a: string, b: string): boolean {
  const wordsA = a.toLowerCase().split(/[\s,()–—\-]+/).filter(w => w.length > 2);
  const wordsB = b.toLowerCase().split(/[\s,()–—\-]+/).filter(w => w.length > 2);
  for (const wa of wordsA) {
    for (const wb of wordsB) {
      if (wa.includes(wb) || wb.includes(wa)) return true;
      if (wa.length >= 4 && wb.length >= 4 && (wa.slice(0, 4) === wb.slice(0, 4) || wa.slice(-4) === wb.slice(-4))) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Проверяет, что правильный ответ не угадывается по совпадению слов с вопросом.
 */
function isGuessableByWordMatch(prompt: string, options: string[], correctIndex: number): boolean {
  const promptWords = prompt.toLowerCase();
  for (let i = 0; i < options.length; i++) {
    const optWords = options[i].toLowerCase();
    const overlap = hasWordOverlap(promptWords, optWords);
    if (i === correctIndex && overlap) {
      return true;
    }
  }
  return false;
}

/**
 * Проверяет, что длина правильного ответа не выбивается из остальных.
 */
function isAnswerLengthSuspicious(options: string[], correctIndex: number): boolean {
  const lengths = options.map(o => o.length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const correctLen = lengths[correctIndex];
  if (Math.abs(correctLen - avg) > avg * 0.4) return true;
  return false;
}

/**
 * Подбор качественных дистракторов ТОЛЬКО из текущей эпохи.
 *
 * Категории (все строго из eraTerms):
 * - очень близкий (та же эпоха, похожая функция)
 * - близкий по эпохе (другая функция)
 * - типичная ошибка (из typicalMistake связанных терминов этой же эпохи)
 *
 * ВАЖНО: дистракторы НИКОГДА не берутся из других эпох.
 * Исключение: generateTermOddOneOut использует отдельную логику.
 */
function selectQualityDistractors(
  correctMeta: TermMeta,
  eraTerms: TermMeta[],
  count: number = 3
): string[] {
  const distractors: string[] = [];
  const correctName = correctMeta.term;

  // Исключаем конфликтующие термины (они не должны быть в одном вопросе)
  const conflictingSet = new Set([
    ...(correctMeta.conflictingWith || []),
    ...eraTerms
      .filter(t => (t.conflictingWith || []).includes(correctName))
      .map(t => t.term),
  ]);

  // 1) Очень близкий — relatedTerms или термины с похожей функцией (только из eraTerms)
  const veryClose = eraTerms.filter(t =>
    t.term !== correctName &&
    !conflictingSet.has(t.term) &&
    (
      correctMeta.relatedTerms.includes(t.term) ||
      hasSimilarFunction(correctMeta.function, t.function)
    )
  );
  shuffle(veryClose);

  if (veryClose.length > 0) {
    distractors.push(veryClose[0].term);
  }

  // 2) Другие термины из той же эпохи (ДРУГАЯ функция)
  const sameEraOthers = eraTerms.filter(t =>
    t.term !== correctName &&
    !distractors.includes(t.term) &&
    !hasSimilarFunction(correctMeta.function, t.function)
  );
  shuffle(sameEraOthers);

  if (sameEraOthers.length > 0) {
    distractors.push(sameEraOthers[0].term);
  }

  // 3) Типичная ошибка — ищем термины ТОЛЬКО из eraTerms, которые в typicalMistake упоминают путаницу
  const mistakePool = eraTerms.filter(t =>
    t.term !== correctName &&
    !distractors.includes(t.term) &&
    (t.typicalMistake.toLowerCase().includes(correctName.toLowerCase()) ||
     correctMeta.typicalMistake.toLowerCase().includes(t.term.toLowerCase()) ||
     correctMeta.relatedTerms.includes(t.term))
  );
  shuffle(mistakePool);

  if (mistakePool.length > 0) {
    distractors.push(mistakePool[0].term);
  }

  // Добираем из оставшихся терминов той же эпохи
  if (distractors.length < count) {
    const remaining = sameEraOthers.filter(t =>
      !distractors.includes(t.term)
    );
    shuffle(remaining);
    for (const r of remaining) {
      if (distractors.length >= count) break;
      if (!distractors.includes(r.term)) {
        distractors.push(r.term);
      }
    }
  }

  // Если всё ещё не хватает — пробуем из других эпох, но это плохой сценарий
  // (этот случай редкость, только если в эпохе <4 терминов)
  if (distractors.length < count) {
    const fallback = termMetaList.filter(t =>
      t.term !== correctName &&
      !distractors.includes(t.term)
    );
    shuffle(fallback);
    for (const f of fallback) {
      if (distractors.length >= count) break;
      if (!distractors.includes(f.term)) {
        distractors.push(f.term);
      }
    }
  }

  return distractors.slice(0, count);
}

function hasSimilarFunction(fn1: string, fn2: string): boolean {
  const key1 = fn1.toLowerCase().split(/[\s,]+/).filter(w => w.length > 3).slice(0, 3).join(' ');
  const key2 = fn2.toLowerCase().split(/[\s,]+/).filter(w => w.length > 3).slice(0, 3).join(' ');
  if (!key1 || !key2) return false;
  return key1.split(' ').some((w: string) => key2.includes(w));
}

/**
 * Финальная проверка качества: убираем опции, где правильный ответ угадывается.
 * Если проверка не пройдена — возвращаем null (вопрос не создаётся).
 */
function validateQuestion(
  prompt: string,
  options: string[],
  correctAnswer: string
): boolean {
  const correctIndex = options.indexOf(correctAnswer);
  if (correctIndex === -1) return false;

  // 1. Угадывание по совпадению слов
  if (isGuessableByWordMatch(prompt, options, correctIndex)) {
    return false;
  }

  // 2. Подозрительная длина ответа
  if (isAnswerLengthSuspicious(options, correctIndex)) {
    return false;
  }

  return true;
}

/**
 * Проверяет, что все варианты ответа — термины (не даты, не события, не имена).
 */
function areAllOptionsTerms(options: string[], eraTerms: TermMeta[]): boolean {
  const termNames = new Set(eraTerms.map(t => t.term));
  return options.every(o => termNames.has(o));
}

// ==================== ГЕНЕРАТОРЫ ВОПРОСОВ ====================

/**
 * 1. term-by-context — термин по исторической ситуации (описание, КАК это работало).
 *    Варианты: только термины из текущей эпохи.
 *    Explanation: только поля termMeta (definition, function, consequence).
 */
function generateTermByContext(cardMeta: TermMeta, eraTerms: TermMeta[], allCards: HistoryCard[]): Question | null {
  const { term, definition, contextHint, function: func, consequence, era } = cardMeta;

  const prompt = `Что из перечисленного соответствует описанию: «${contextHint}»?`;

  const distractors = selectQualityDistractors(cardMeta, eraTerms, 3);
  let options = shuffle([term, ...distractors]);

  if (!validateQuestion(prompt, options, term)) {
    return null;
  }

  // Проверка: все варианты — термины из этой эпохи
  if (!areAllOptionsTerms(options, eraTerms)) {
    return null;
  }

  const card = allCards.find(c => c.tags.includes(term) || c.event.includes(term));
  const cardId = card?.id || `term-context-${era}`;

  return {
    id: nextId('by-context'),
    type: 'term-by-context',
    cardId,
    prompt,
    correctAnswer: term,
    options,
    explanation: `«${term}» — ${definition}. Функция: ${func}. Последствие: ${consequence}.`,
  };
}

/**
 * 2. term-by-function — «Какое явление выполняло функцию X?»
 *    Варианты: только термины из текущей эпохи.
 *    Explanation: только поля termMeta (definition, function, consequence).
 */
function generateTermByFunction(cardMeta: TermMeta, eraTerms: TermMeta[], allCards: HistoryCard[]): Question | null {
  const { term, function: func, consequence, definition, era } = cardMeta;

  const prompt = `Что из перечисленного означает: «${func}»?`;

  const distractors = selectQualityDistractors(cardMeta, eraTerms, 3);
  let options = shuffle([term, ...distractors]);

  if (!validateQuestion(prompt, options, term)) {
    return null;
  }

  if (!areAllOptionsTerms(options, eraTerms)) {
    return null;
  }

  const card = allCards.find(c => c.tags.includes(term) || c.event.includes(term));
  const cardId = card?.id || `term-function-${era}`;

  return {
    id: nextId('by-function'),
    type: 'term-by-function',
    cardId,
    prompt,
    correctAnswer: term,
    options,
    explanation: `«${term}» — ${definition}. Функция: ${func}. Последствие: ${consequence}.`,
  };
}

/**
 * 3. term-distinguish — различение двух близких терминов.
 *    Варианты: только термины из текущей эпохи.
 *    Без пометок (это верно)/(это неверно).
 *    Explanation: разница на основе typicalMistake.
 */
function generateTermDistinguish(cardMeta: TermMeta, eraTerms: TermMeta[], allCards: HistoryCard[]): Question | null {
  const { term, definition, relatedTerms, function: func, era } = cardMeta;

  // Берём первый близкий термин из relatedTerms, который есть в ТЕКУЩЕЙ ЭПОХЕ
  const closeTermMeta = eraTerms.find(t => relatedTerms.includes(t.term) && t.term !== term);
  if (!closeTermMeta) return null;

  const prompt = `Что из перечисленного означает: «${definition}»?`;

  // Варианты — сам термин и близкий термин + дистракторы ТОЛЬКО из этой эпохи
  const extraDistractors = selectQualityDistractors(cardMeta, eraTerms, 2)
    .filter(d => d !== term && d !== closeTermMeta.term)
    .filter(d => eraTerms.some(t => t.term === d)); // дополнительная гарантия — только из eraTerms
  
  const options = shuffle([term, closeTermMeta.term, ...extraDistractors]);

  if (!validateQuestion(prompt, options, term)) {
    return null;
  }

  if (!areAllOptionsTerms(options, eraTerms)) {
    return null;
  }

  const card = allCards.find(c => c.tags.includes(term) || c.event.includes(term));
  const cardId = card?.id || `term-dist-${era}`;

  return {
    id: nextId('distinguish'),
    type: 'term-distinguish',
    cardId,
    prompt,
    correctAnswer: term,
    options,
    explanation: `«${term}» — ${definition}. Отличие от «${closeTermMeta.term}»: ${cardMeta.typicalMistake}.`,
  };
}

/**
 * 4. term-odd-one-out — какой термин ЛИШНИЙ среди четырёх.
 *    Три термина из одной эпохи, один — из другой.
 *    Единственный тип, где смешение эпох — фича.
 *    ОСТАВЛЯЕМ КАК ЕСТЬ.
 */
function generateTermOddOneOut(cardMeta: TermMeta, eraTerms: TermMeta[], allCards: HistoryCard[]): Question | null {
  const { term, era } = cardMeta;

  const sameEra = eraTerms.filter(t => t.term !== term);
  if (sameEra.length < 3) return null;

  // Берём 3 термина из той же эпохи (включая наш целевой)
  const cluster = shuffle([cardMeta, ...sameEra]).slice(0, 3);
  const clusterTerms = cluster.map(t => t.term);

  // Один дистрактор из ДРУГОЙ эпохи (должен быть правдоподобным, но не из этой эпохи)
  const otherEraTerms = termMetaList.filter(t => t.era !== era && !clusterTerms.includes(t.term));
  shuffle(otherEraTerms);

  if (otherEraTerms.length === 0) return null;

  const oddOneOut = otherEraTerms[0].term;
  const correct = oddOneOut;
  const all = shuffle([...clusterTerms, oddOneOut]);

  const prompt = `Какой термин лишний?`;

  if (!validateQuestion(prompt, all, correct)) return null;

  const card = allCards.find(c => c.tags.includes(term) || c.event.includes(term));
  const cardId = card?.id || `term-odd-${era}`;

  const eraName = eras.find(e => e.id === era)?.name || era;

  return {
    id: nextId('odd-one-out'),
    type: 'term-odd-one-out',
    cardId,
    prompt,
    correctAnswer: correct,
    options: all,
    explanation: `Лишний — «${oddOneOut}». Он относится к другой эпохе. Остальные термины («${clusterTerms.join('», «')}») относятся к эпохе «${eraName}».`,
  };
}

/**
 * 5. term-by-consequence — вопрос о реальном последствии/результате явления.
 *    Создаётся ТОЛЬКО если поле consequence содержит явный маркер последствия
 *    (стрелка "→", глаголы результата: "привело", "вызвало", "облегчило", "усилло" и т.д.).
 *    Если consequence — просто описание, роль или характеристика — вопрос не создаётся.
 *    Варианты: только термины из текущей эпохи.
 *    Explanation: только поля termMeta (definition, function, consequence).
 */
function generateTermByConsequence(cardMeta: TermMeta, eraTerms: TermMeta[], allCards: HistoryCard[]): Question | null {
  const { term, consequence, definition, function: func, era } = cardMeta;

  // Маркеры, указывающие, что consequence — это реальное последствие/результат
  const resultMarkers = [
    '→', 'привело', 'вызвало', 'облегчило', 'усилило', 'закрепило',
    'стало причиной', 'послужило основой',
    'ослабление', 'утечка', 'разорение', 'торможение', 'консервация', 'упадок',
    'гибель', 'распущена', 'отмена', 'прекращение', 'ликвидация',
    'растянутость', 'сохранение феодальных', 'сохранение малоземелья',
  ];

  const consequenceLower = consequence.toLowerCase();
  const hasResultMarker = resultMarkers.some(m => consequenceLower.includes(m));
  if (!hasResultMarker) {
    return null;
  }

  const prompt = `Что из перечисленного привело к такому последствию: «${consequence}»?`;

  const distractors = selectQualityDistractors(cardMeta, eraTerms, 3);
  let options = shuffle([term, ...distractors]);

  if (!validateQuestion(prompt, options, term)) {
    return null;
  }

  if (!areAllOptionsTerms(options, eraTerms)) {
    return null;
  }

  const card = allCards.find(c => c.tags.includes(term) || c.event.includes(term));
  const cardId = card?.id || `term-conseq-${era}`;

  return {
    id: nextId('by-consequence'),
    type: 'term-by-consequence',
    cardId,
    prompt,
    correctAnswer: term,
    options,
    explanation: `«${term}» — ${definition}. Последствие: ${consequence}.`,
  };
}

/**
 * 6. term-scenario — мини-историческая ситуация.
 *    Варианты: только термины из текущей эпохи.
 *    Explanation: только поля termMeta (definition, function).
 *    Сценарии берутся ТОЛЬКО из предопределённого списка, без внешних знаний.
 *    Если сценария нет — не создаётся.
 */
function generateTermScenario(cardMeta: TermMeta, eraTerms: TermMeta[], historyCards: HistoryCard[]): Question | null {
  const { term, definition, contextHint, function: func, era } = cardMeta;

  // Предопределённые сценарии — только из теории
  const scenarios: Record<string, string> = {
    'Варяги': 'Князь нанимает отряд воинов-скандинавов для охраны торговых путей и военных походов. Они получают плату и долю добычи.',
    'Полюдье': 'Князь с дружиной с ноября по апрель объезжает подвластные племена и собирает с них дань натурой.',
    'Уроки': 'Княгиня установила фиксированный размер дани для каждой земли, чтобы избежать произвола при сборе.',
    'Погосты': 'Княгиня создала специальные административные центры, куда жители должны были свозить дань, а не ждать объезда князя.',
    'Вече': 'По звону колокола жители города собираются на площади, чтобы решить: пригласить нового князя, начать войну или заключить мир.',
    'Русская Правда': 'Князь Ярослав Мудрый издаёт письменный свод законов, в котором впервые устанавливаются штрафы за убийство, кражу и оскорбление.',
    'Местничество': 'Боярин отказывается занять пост воеводы, поскольку его род менее знатен, чем род того, кто назначен командовать. Военный опыт не учитывается.',
    'Кормление': 'Наместник отправляется управлять городом и содержит себя со свитой за счёт местных жителей — они «кормят» его.',
    'Опричнина': 'Царь Иван IV делит страну на две части. В одной из них действуют его верные слуги в чёрных одеждах — они казнят неугодных и отбирают земли у знати.',
    'Семибоярщина': 'В 1610 году группа бояр, опасаясь народного бунта больше, чем поляков, впускает польский гарнизон в Москву и призывает на престол польсого королевича.',
    'Бироновщина': 'В царствование Анны Иоанновны власть сосредоточена в руках её фаворита-курляндца. Он расставляет на главные должности иностранцев, что вызывает возмущение русского дворянства.',
    'Кондиции': 'Верховный тайный совет предлагает новой императрице Анне Иоанновне подписать «кондиции» — условия, ограничивающие её власть в пользу Совета.',
  };

  // Если сценария нет в словаре — не создаём вопрос (нет внешних знаний)
  const scenario = scenarios[term];
  if (!scenario) return null;

  const prompt = `Что из перечисленного соответствует описанию: «${scenario}»?`;

  const distractors = selectQualityDistractors(cardMeta, eraTerms, 3);
  let options = shuffle([term, ...distractors]);

  if (!validateQuestion(prompt, options, term)) {
    return null;
  }

  if (!areAllOptionsTerms(options, eraTerms)) {
    return null;
  }

  const card = historyCards.find(c => c.tags.includes(term) || c.event.includes(term));
  const cardId = card?.id || `term-scenario-${era}`;

  return {
    id: nextId('scenario'),
    type: 'term-scenario',
    cardId,
    prompt,
    correctAnswer: term,
    options,
    explanation: `«${term}» — ${definition}. Функция: ${func.toLowerCase()}.`,
  };
}

// ==================== ОСНОВНАЯ ФУНКЦИЯ ====================

/**
 * Генерирует вопросы по терминам для указанной эпохи.
 * @param eraId — ID эпохи (например 'ancient', 'tsardom')
 * @param eraTerms — список TermMeta для этой эпохи
 * @param historyCards — все карточки истории (для привязки cardId)
 * @param count — сколько вопросов сгенерировать (по умолчанию 4-6)
 */
export function generateTermQuestions(
  eraId: string,
  historyCards: HistoryCard[],
  count?: number
): Question[] {
  const eraTerms = getTermMetaByEra(eraId);
  if (eraTerms.length < 3) return []; // минимум 3 термина для качественных вариантов

  const targetCount = count ?? Math.min(eraTerms.length, 6);
  const result: Question[] = [];

  // Типы генераторов и их вероятности
  type GeneratorFn = (meta: TermMeta, terms: TermMeta[], cards: HistoryCard[]) => Question | null;
  const generators: { name: string; fn: GeneratorFn; weight: number }[] = [
    { name: 'term-by-context', fn: generateTermByContext, weight: 2 },
    { name: 'term-by-function', fn: generateTermByFunction, weight: 2 },
    { name: 'term-distinguish', fn: generateTermDistinguish, weight: 1 },
    { name: 'term-odd-one-out', fn: generateTermOddOneOut, weight: 1 },
    { name: 'term-by-consequence', fn: generateTermByConsequence, weight: 2 },
    { name: 'term-scenario', fn: generateTermScenario, weight: 2 },
  ];

  // Создаём взвешенный цикл генерации
  let attempts = 0;
  const usedTerms = new Set<string>();
  const maxAttempts = targetCount * 10; // защита от бесконечного цикла

  while (result.length < targetCount && attempts < maxAttempts) {
    attempts++;

    // Выбираем случайный генератор
    const totalWeight = generators.reduce((s, g) => s + g.weight, 0);
    let r = Math.random() * totalWeight;
    let selectedGen = generators[0];
    for (const gen of generators) {
      r -= gen.weight;
      if (r <= 0) {
        selectedGen = gen;
        break;
      }
    }

    // Выбираем случайный термин (предпочитаем неиспользованные)
    const availableTerms = eraTerms.filter(t => !usedTerms.has(t.term));
    if (availableTerms.length === 0) break;
    const chosenMeta = availableTerms[Math.floor(Math.random() * availableTerms.length)];

    const question = selectedGen.fn(chosenMeta, eraTerms, historyCards);
    if (question) {
      result.push(question);
      usedTerms.add(chosenMeta.term);
    }
  }

  return shuffle(result);
}

/**
 * Генерирует вопрос по термину для Struggle Mode (упрощённый).
 * Берёт самую простую формулировку.
 * Варианты: только из текущей эпохи.
 * Explanation: только поля termMeta.
 */
export function generateStruggleTermQuestion(
  termName: string,
  historyCards: HistoryCard[]
): Question | null {
  const meta = getTermMeta(termName);
  if (!meta) return null;

  const eraTerms = getTermMetaByEra(meta.era);

  // Самый простой вариант: определение → термин
  const prompt = `Что из перечисленного означает: «${meta.definition}»?`;
  const distractors = selectQualityDistractors(meta, eraTerms, 3);
  let options = shuffle([meta.term, ...distractors]);

  if (!validateQuestion(prompt, options, meta.term)) {
    return {
      id: nextId('struggle'),
      type: 'identify-term',
      cardId: `term-struggle-${meta.era}`,
      prompt,
      correctAnswer: meta.term,
      options: shuffle([meta.term, ...distractors.slice(0, 3)]),
      explanation: `Правильный ответ: ${meta.term}. ${meta.definition}`,
    };
  }

  const card = historyCards.find(c => c.tags.includes(meta.term) || c.event.includes(meta.term));
  const cardId = card?.id || `term-struggle-${meta.era}`;

  return {
    id: nextId('struggle'),
    type: 'identify-term',
    cardId,
    prompt,
    correctAnswer: meta.term,
    options,
    explanation: `Правильный ответ: ${meta.term}. ${meta.definition}`,
  };
}