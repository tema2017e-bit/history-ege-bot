import { HistoryCard, Question, QuestionType } from '../types';
import { eras, historicalFigures, historicalQuotes } from '../data/historyDates';
import { theorySections } from '../data/theoryData';
import { eraToTheorySection } from '../data/eraTheoryMapping';
import { generateTermQuestions as generateAdvancedTermQuestions } from './termQuestionEngine';

// Утилиты для генерации вопросов из карточек

// Извлекает информацию о годе из строки (поддерживает диапазоны с –, — и -)
function parseYearInfo(yearStr: string): { startYear: string; endYear: string; isRange: boolean; fullRange: string } {
  const parts = yearStr.split(/[–—-]/);
  return {
    startYear: parts[0].trim(),
    endYear: parts.length > 1 ? parts[1].trim() : parts[0].trim(),
    isRange: parts.length > 1,
    fullRange: yearStr,
  };
}

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

// Получает информацию об эпохе для обогащения контекста
function getEraContext(eraId: string): { name: string; yearRange: string } {
  const era = eras.find(e => e.id === eraId);
  return {
    name: era?.name || eraId,
    yearRange: era?.yearRange || '',
  };
}

// Строит богатый контекст
function buildContext(card: HistoryCard): string {
  const parts: string[] = [];
  parts.push(`📅 ${card.period}`);
  const era = getEraContext(card.era);
  parts.push(`🏛 ${era.name}`);
  if (card.ruler) {
    parts.push(`👑 ${card.ruler}`);
  }
  return parts.join(' · ');
}

// Возвращает массив приемлемых вариантов и алиасов для известных правителей
function getRulerAcceptableAnswers(rulerName: string): { acceptableAnswers: string[]; aliases: string[] } {
  const rulerVariants: Record<string, string[]> = {
    'Рюрик': ['рюрик', 'князь рюрик', 'рюрик варяг'],
    'Олег': ['олег', 'князь олег', 'олег вещий', 'вещий олег'],
    'Игорь': ['игорь', 'князь игорь', 'игорь старый', 'игорь рюрикович'],
    'Ольга': ['ольга', 'княгиня ольга', 'ольга святая', 'святая ольга'],
    'Владимир': ['владимир', 'князь владимир', 'владимир красно солнышко', 'владимир святославич', 'владимир великий'],
    'Владимир Мономах': ['владимир мономах', 'мономах', 'владимир', 'князь владимир мономах', 'владимирвсеволодович'],
    'Юрий Долгорукий': ['юрий долгорукий', 'долгорукий', 'юрий', 'князь юрий долгорукий', 'юрийвладимирович'],
    'Всеволод Большое Гнездо': ['всеволод большое гнездо', 'всеволод', 'большое гнездо', 'всеволод юрьевич'],
    'Ярослав Мудрый': ['ярослав мудрый', 'князь ярослав мудрый', 'ярослав', 'ярослав владимирович', 'ярославмудрый'],
    'Андрей Боголюбский': ['андрей боголюбский', 'князь андрей боголюбский', 'андрей', 'андрейбоголюбский', 'андрей юрьевич'],
    'Александр Невский': ['александр невский', 'князь александр невский', 'александр', 'александрневский', 'невский', 'александр ярославич'],
    'Дмитрий Донской': ['дмитрий донской', 'князь дмитрий донской', 'дмитрий', 'дмитрийдонской', 'дмитрий иванович'],
    'Иван III': ['иван 3', 'иван третий', 'иван iii', 'иван великий', 'иван', 'иван васильевич', 'иван3', 'иваниванович'],
    'Иван IV': ['иван 4', 'иван четвертый', 'иван iv', 'иван грозный', 'ивангрозный', 'грозный', 'иван васильевич', 'иван4', 'иваниванович'],
    'Борис Годунов': ['борис годунов', 'борис', 'годунов', 'борисгодунов'],
    'Пётр I': ['петр 1', 'петр первый', 'пётр 1', 'пётр первый', 'петр i', 'пётр i', 'петр великий', 'пётр великий', 'петр', 'пётр', 'петр алексеевич', 'пётр алексеевич', 'петр1', 'пётр1', 'петрпервый', 'пётрпервый'],
    'Екатерина I': ['екатерина 1', 'екатерина первая', 'екатерина i', 'екатерина1'],
    'Пётр II': ['петр 2', 'пётр 2', 'петр второй', 'пётр второй', 'петр ii', 'пётр ii', 'петр2', 'пётр2'],
    'Анна Иоанновна': ['анна иоанновна', 'анна', 'аннаиоанновна'],
    'Елизавета Петровна': ['елизавета петровна', 'елизавета', 'елизавета', 'дочь петрова', 'елизаветапетровна'],
    'Пётр III': ['петр 3', 'пётр 3', 'петр третий', 'пётр третий', 'петр iii', 'пётр iii', 'петр3', 'пётр3'],
    'Екатерина II': ['екатерина 2', 'екатерина вторая', 'екатерина ii', 'екатерина великая', 'екатерина', 'екатерина2', 'екатеринавторая'],
    'Павел I': ['павел 1', 'павел первый', 'павел i', 'павел', 'павел1'],
    'Александр I': ['александр 1', 'александр первый', 'александр i', 'александр', 'александр1', 'александрпервый', 'александр павлович'],
    'Николай I': ['николай 1', 'николай первый', 'николай i', 'николай', 'николай1', 'николайпервый', 'николай павлович'],
    'Александр II': ['александр 2', 'александр второй', 'александр ii', 'александр2', 'александрвторой', 'александр николаевич', 'освободитель'],
    'Александр III': ['александр 3', 'александр третий', 'александр iii', 'александр3', 'александртретий', 'александр александрович', 'миротворец'],
    'Николай II': ['николай 2', 'николай второй', 'николай ii', 'николай', 'николай2', 'николайвторой', 'царь николай', 'николай александрович'],
    'Михаил Фёдорович': ['михаил фёдорович', 'михаил федорович', 'михаил', 'михаилроманов', 'михаил фёдорович романов'],
    'Алексей Михайлович': ['алексей михайлович', 'алексей', 'алексеямихайлович', 'тишайший', 'алексей михайлович романов'],
    'Фёдор Алексеевич': ['фёдор алексеевич', 'федор алексеевич', 'фёдор', 'федор', 'фёдор алексеевич романов'],
    'Софья Алексеевна': ['софья алексеевна', 'софья', 'царевна софья', 'софьяалексеевна'],
  };

  const found = rulerVariants[rulerName];
  if (found) {
    const aliases = found.slice(1).filter(a => a !== rulerVariants[rulerName][0]);
    return { acceptableAnswers: found, aliases };
  }

  const normalized = rulerName.toLowerCase();
  const aliases: string[] = [normalized];
  if (normalized.includes(' ')) {
    aliases.push(normalized.replace(/\s+/g, ''));
  }
  return { acceptableAnswers: aliases, aliases };
}

// ==================== УМНЫЕ ДИСТРАКТОРЫ ====================

interface DistractorConfig {
  count?: number;
  targetField?: 'date' | 'event' | 'mixed';
  excludeEvent?: string;
  excludeYear?: string;
}

function getDistractorsFromContext(
  card: HistoryCard,
  allCards: HistoryCard[],
  config: DistractorConfig = {}
): string[] {
  const { count = 3, targetField = 'date', excludeEvent, excludeYear } = config;
  const excludeValue = targetField === 'event' ? excludeEvent || card.event : excludeYear || card.year;
  const otherCards = allCards.filter(c => c.id !== card.id);

  const sameEraCandidates = otherCards.filter(c => c.era === card.era);
  const sameRulerCandidates = card.ruler
    ? otherCards.filter(c => c.ruler === card.ruler && c.era !== card.era)
    : [];
  const yearNum = parseInt(card.year.replace(/[^0-9]/g, ''));
  const nearbyCandidates = !isNaN(yearNum)
    ? otherCards.filter(c => {
        const cYear = parseInt(c.year.replace(/[^0-9]/g, ''));
        return !isNaN(cYear) && Math.abs(cYear - yearNum) <= 10 && c.era !== card.era;
      })
    : [];
  const currentEraIndex = eras.findIndex(e => e.id === card.era);
  const adjacentEraIds = [
    ...(currentEraIndex > 0 ? [eras[currentEraIndex - 1]?.id] : []),
    ...(currentEraIndex < eras.length - 1 ? [eras[currentEraIndex + 1]?.id] : []),
  ].filter(Boolean);
  const adjacentEraCandidates = otherCards.filter(c => adjacentEraIds.includes(c.era));
  const randomCandidates = shuffle(otherCards);

  const allCandidates = [
    ...sameEraCandidates,
    ...sameRulerCandidates,
    ...nearbyCandidates,
    ...adjacentEraCandidates,
    ...randomCandidates,
  ].filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);

  const getFieldValue = (c: HistoryCard): string => {
    if (targetField === 'event') return c.event;
    return c.year;
  };

  const candidateValues = allCandidates
    .map(getFieldValue)
    .filter(v => v !== excludeValue);
  const uniqueValues = candidateValues.filter((v, i, arr) => arr.indexOf(v) === i);
  const sameEraValues = sameEraCandidates.map(getFieldValue).filter(v => v !== excludeValue);
  const uniqueSameEra = sameEraValues.filter((v, i, arr) => arr.indexOf(v) === i);

  let result: string[] = [];
  if (uniqueSameEra.length >= count) {
    result = shuffle(uniqueSameEra).slice(0, count);
  } else {
    result = [...uniqueSameEra];
    const remainingCount = count - result.length;
    const remainingFromUnique = uniqueValues.filter(v => !result.includes(v));
    result = [...result, ...shuffle(remainingFromUnique).slice(0, remainingCount)];
  }

  while (result.length < count) {
    const fillers = shuffle(allCards)
      .filter(c => getFieldValue(c) !== excludeValue && !result.includes(getFieldValue(c)))
      .map(getFieldValue)
      .slice(0, count - result.length);
    result = [...result, ...fillers];
  }

  return shuffle(result).slice(0, count);
}

function getDateDistractors(card: HistoryCard, allCards: HistoryCard[]): string[] {
  return getDistractorsFromContext(card, allCards, {
    count: 3,
    targetField: 'date',
    excludeYear: card.year,
  });
}

function getEventDistractors(card: HistoryCard, allCards: HistoryCard[]): string[] {
  return getDistractorsFromContext(card, allCards, {
    count: 3,
    targetField: 'event',
    excludeEvent: card.event,
  });
}

// ==================== ГЕНЕРАТОРЫ ВОПРОСОВ ====================

// Генератор вопросов типа "Выбери дату для события"
function generateSelectDateQuestion(card: HistoryCard, allCards: HistoryCard[]): Question {
  const { fullRange } = parseYearInfo(card.year);
  const wrongDates = getDateDistractors(card, allCards);
  const options = shuffle([card.year, ...wrongDates]);
  const eraContext = getEraContext(card.era);
  const rulerHint = card.ruler ? ` (правитель: ${card.ruler})` : '';

  const eraName = getEraContext(card.era).name;
  return {
    id: `q-${card.id}-date-${Date.now()}`,
    type: 'select-date',
    cardId: card.id,
    prompt: `В каком году ${card.event}?`,
    correctAnswer: card.year,
    options,
    explanation: `${card.event} — ${fullRange} год, эпоха «${eraName}».${card.ruler ? ` Правитель: ${card.ruler}.` : ''}`,
  };
}

// Генератор вопросов типа "Выбери событие для даты"
function generateSelectEventQuestion(card: HistoryCard, allCards: HistoryCard[]): Question {
  const { fullRange } = parseYearInfo(card.year);
  const wrongEvents = getEventDistractors(card, allCards);
  const options = shuffle([card.event, ...wrongEvents]);
  const eraContext = getEraContext(card.era);
  const rulerHint = card.ruler ? ` (правитель: ${card.ruler})` : '';

  const eraName = getEraContext(card.era).name;
  return {
    id: `q-${card.id}-event-${Date.now()}`,
    type: 'select-event',
    cardId: card.id,
    prompt: `${fullRange} год — что произошло?`,
    correctAnswer: card.event,
    options,
    explanation: `В ${fullRange} году произошло: ${card.event}. Эпоха «${eraName}».${card.ruler ? ` Правитель: ${card.ruler}.` : ''}`,
  };
}

// Генератор вопросов типа "Введи год вручную"
function generateInputYearQuestion(card: HistoryCard): Question {
  const { startYear, fullRange, isRange } = parseYearInfo(card.year);
  const answer = isRange ? fullRange : startYear;
  const hint = isRange ? '\n💡 Укажите период (например, 1700–1721)' : '';

  return {
    id: `q-${card.id}-input-${Date.now()}`,
    type: 'input-year',
    cardId: card.id,
    prompt: `Введите год: ${card.event}${hint}`,
    correctAnswer: answer,
    explanation: `${card.event} — ${fullRange} год`,
  };
}

// Генератор вопросов типа "Введи текст" (личность, термин, название)
function generateInputTextQuestion(card: HistoryCard, allCards: HistoryCard[]): Question {
  const { fullRange } = parseYearInfo(card.year);
  const eraContext = getEraContext(card.era);
  const hasRuler = !!card.ruler;
  const prompts: string[] = [];

  if (hasRuler) {
    prompts.push(`Введите имя правителя, при котором произошло: «${card.event}»`);
  } else {
    prompts.push(`Введите название события, которое произошло в ${fullRange} году`);
  }

  const prompt = prompts[Math.floor(Math.random() * prompts.length)];
  const correctAnswer = card.ruler || card.event;
  let acceptableAnswers: string[] = [];
  let aliases: string[] = [];

  if (card.ruler) {
    const rulerData = getRulerAcceptableAnswers(card.ruler);
    acceptableAnswers = rulerData.acceptableAnswers;
    aliases = rulerData.aliases;
  }

  return {
    id: `q-${card.id}-text-${Date.now()}`,
    type: 'input-text' as QuestionType,
    cardId: card.id,
    prompt,
    correctAnswer,
    explanation: `${card.event}. ${fullRange} год. ${eraContext.name}${card.ruler ? `. Правитель: ${card.ruler}` : ''}`,
    inputMode: 'text',
    acceptableAnswers: acceptableAnswers.length > 0 ? acceptableAnswers : undefined,
    aliases: aliases.length > 0 ? aliases : undefined,
  };
}

// Генератор вопросов типа "Верно / Неверно"
function generateTrueFalseQuestion(card: HistoryCard, allCards: HistoryCard[]): Question {
  const { fullRange } = parseYearInfo(card.year);
  const isCorrect = Math.random() > 0.5;
  let displayYear: string;

  if (isCorrect) {
    displayYear = fullRange;
  } else {
    const sameEraCards = allCards.filter(c => c.era === card.era && c.id !== card.id);
    if (sameEraCards.length > 0) {
      const wrongCard = getRandomItems(sameEraCards, 1)[0];
      const { fullRange: wrongRange } = parseYearInfo(wrongCard.year);
      displayYear = wrongRange;
    } else {
      const wrongCard = getRandomItems(allCards.filter(c => c.id !== card.id), 1)[0];
      if (wrongCard) {
        const { fullRange: wrongRange } = parseYearInfo(wrongCard.year);
        displayYear = wrongRange;
      } else {
        displayYear = String(parseInt(fullRange) + Math.floor(Math.random() * 10) - 5);
      }
    }
  }

  return {
    id: `q-${card.id}-tf-${Date.now()}`,
    type: 'true-false',
    cardId: card.id,
    prompt: `${card.event} произошло в ${displayYear} году.`,
    correctAnswer: isCorrect ? 'true' : 'false',
    options: ['true', 'false'],
    explanation: isCorrect
      ? `Да, верно. ${card.event} — ${fullRange} год.`
      : `Нет, неверно. ${card.event} случилось в ${fullRange} году.`,
  };
}

// Генератор вопросов типа "Заполни пропуск"
function generateFillBlankQuestion(card: HistoryCard): Question {
  const { startYear, fullRange, isRange } = parseYearInfo(card.year);
  const answer = isRange ? fullRange : startYear;
  const hint = isRange ? '\n💡 Укажите период (например, 1700–1721)' : '';

  return {
    id: `q-${card.id}-blank-${Date.now()}`,
    type: 'fill-blank',
    cardId: card.id,
    prompt: `Заполните пропуск: ${card.event} произошло в _____.${hint}`,
    correctAnswer: answer,
    explanation: `${card.event} — ${fullRange} год`,
  };
}

// Генератор вопросов типа "Выбери лишнее"
function generateOddOneOutQuestion(card: HistoryCard, allCards: HistoryCard[]): Question {
  const sameEra = allCards.filter(c => c.era === card.era && c.id !== card.id);
  const differentEra = allCards.filter(c => c.era !== card.era);

  let options: string[];
  let diffCard: HistoryCard | undefined;
  let sameEraEvents: string[] = [];

  if (sameEra.length >= 2 && differentEra.length >= 1) {
    const sameEraCards = getRandomItems(sameEra, 2);
    sameEraEvents = sameEraCards.map(c => c.event);
    diffCard = getRandomItems(differentEra, 1)[0];
    if (diffCard) {
      options = shuffle([card.event, ...sameEraEvents, diffCard.event]);
    } else {
      const diffCardAlt = getRandomItems(allCards.filter(c => c.id !== card.id), 1)[0];
      diffCard = diffCardAlt;
      options = shuffle([card.event, ...sameEraEvents, diffCardAlt?.event || '']);
    }
  } else {
    const others = getRandomItems(allCards.filter(c => c.id !== card.id), 3);
    diffCard = others[0];
    options = shuffle([card.event, ...others.map(c => c.event)]);
  }

  const diffEraName = diffCard ? getEraContext(diffCard.era).name : 'другой эпохе';
  const mainEraName = getEraContext(card.era).name;
  const oddEvent = diffCard ? diffCard.event : (options.find(o => o !== card.event && !sameEraEvents.includes(o)) || '');

  return {
    id: `q-${card.id}-odd-${Date.now()}`,
    type: 'odd-one-out',
    cardId: card.id,
    prompt: `Какое событие лишнее?`,
    correctAnswer: oddEvent,
    options,
    explanation: `Лишнее событие относится к эпохе «${diffEraName}». Остальные — к эпохе «${mainEraName}».`,
  };
}

// ==================== ГЕНЕРАТОР "Кто это?" ====================

function generateWhoIsQuestion(figure: typeof historicalFigures[0], allCards: HistoryCard[], overrideCardId?: string): Question {
  const era = getEraContext(figure.era);
  const relatedEvents = figure.relatedEvents
    .map(id => allCards.find(c => c.id === id))
    .filter((c): c is HistoryCard => c !== undefined)
    .map(c => c.event);

  const otherFigures = historicalFigures
    .filter(f => f.id !== figure.id && f.era !== figure.era)
    .map(f => f.name);
  const sameEraFigures = historicalFigures
    .filter(f => f.id !== figure.id && f.era === figure.era)
    .map(f => f.name);

  let wrongNames: string[];
  if (sameEraFigures.length >= 3) {
    wrongNames = getRandomItems(sameEraFigures, 3);
  } else {
    wrongNames = [
      ...sameEraFigures,
      ...getRandomItems(otherFigures, 3 - sameEraFigures.length)
    ];
  }

  const options = shuffle([figure.name, ...wrongNames]);

  return {
    id: `q-fig-${figure.id}-${Date.now()}`,
    type: 'who-is',
    cardId: overrideCardId || figure.id,
    prompt: `${figure.description}`,
    correctAnswer: figure.name,
    explanation: `${figure.name} — ${figure.role} (${figure.period}). Эпоха: ${era.name}.${relatedEvents.length > 0 ? ` Связанные события: ${relatedEvents.join(', ')}.` : ''}`,
    options: options.length >= 2 ? options : [figure.name, 'Другая личность'],
  };
}

// ==================== ГЕНЕРАТОР "Цитата → автор" ====================

function generateQuoteAuthorQuestion(quote: typeof historicalQuotes[0], overrideCardId?: string): Question {
  const era = getEraContext(quote.era);

  const otherAuthors = historicalQuotes
    .filter(q => q.id !== quote.id)
    .map(q => q.author);
  const uniqueWrongAuthors = [...new Set(otherAuthors)];
  const wrongAuthors = getRandomItems(uniqueWrongAuthors, 3);
  const options = shuffle([quote.author, ...wrongAuthors]);

  return {
    id: `q-quote-${quote.id}-${Date.now()}`,
    type: 'quote-author',
    cardId: overrideCardId || quote.id,
    prompt: `Кто сказал: «${quote.quote}»?`,
    correctAnswer: quote.author,
    explanation: `${quote.author}. ${quote.context}. ${quote.period}, эпоха ${era.name}.`,
    options: options.length >= 2 ? options : [quote.author, 'Другой исторический деятель'],
  };
}

// ==================== НОВЫЕ ТИПЫ ВОПРОСОВ ====================

// Генератор вопросов "Установи соответствие" (match-pairs)
// Всегда в рамках ОДНОЙ эпохи, не смешиваем
function generateMatchPairsQuestion(card: HistoryCard, allCards: HistoryCard[]): Question {
  const sameEraCards = allCards
    .filter(c => c.era === card.era && c.id !== card.id);
  
  // Берём до 4 карт из той же эпохи (включая целевую)
  const selected = shuffle([card, ...sameEraCards]).slice(0, Math.min(4, sameEraCards.length + 1));
  
  // Если меньше 2 пар — не создаём вопрос (недостаточно данных эпохи)
  if (selected.length < 2) {
    // fallback: селект-дата
    return generateSelectDateQuestion(card, allCards);
  }
  
  const pairs = selected.map(c => ({
    date: c.year,
    event: c.event,
  }));

  return {
    id: `q-${card.id}-match-${Date.now()}`,
    type: 'match-pairs',
    cardId: card.id,
    prompt: `Установите соответствие между датами и событиями`,
    correctAnswer: JSON.stringify(pairs),
    pairs,
    explanation: `Правильные пары:\n${pairs.map(p => `${p.date} — ${p.event}`).join('\n')}`,
  };
}

// Генератор вопросов "Расположи в хронологическом порядке" (timeline-order)
function generateTimelineOrderQuestion(card: HistoryCard, allCards: HistoryCard[]): Question {
  const sameEraCards = allCards
    .filter(c => c.era === card.era && c.id !== card.id)
    .slice(0, 3);
  const selectedCards = shuffle([card, ...sameEraCards]).slice(0, 4);
  const correctOrder = [...selectedCards].sort((a, b) => {
    const aYear = parseInt(parseYearInfo(a.year).startYear);
    const bYear = parseInt(parseYearInfo(b.year).startYear);
    return aYear - bYear;
  });
  const shuffledEvents = shuffle(selectedCards.map(c => c.event));

  return {
    id: `q-${card.id}-timeline-${Date.now()}`,
    type: 'timeline-order',
    cardId: card.id,
    prompt: `Расположите события в хронологической последовательности`,
    correctAnswer: correctOrder.map(c => c.event),
    timelineItems: shuffledEvents,
    explanation: `Правильный порядок:\n${correctOrder.map((c, i) => `  ${i + 1}. ${c.year} — ${c.event}`).join('\n')}`,
  };
}

// ==================== NEW: GROUPING TASK (распределение по категориям) ====================

function generateGroupingQuestion(card: HistoryCard, allCards: HistoryCard[]): Question {
  // Берём 3 эпохи: основная + 2 соседних (на одну-две позиции от основной)
  const currentEraIndex = eras.findIndex(e => e.id === card.era);
  
  // Собираем индексы 3 эпох: основная и две соседних (одна слева, одна справа)
  const eraIndices = [currentEraIndex];
  const possibleNeighbors: number[] = [];
  for (let i = 0; i < eras.length; i++) {
    if (i !== currentEraIndex) possibleNeighbors.push(i);
  }
  // Ближайшие соседи
  const leftIndex = currentEraIndex > 0 ? currentEraIndex - 1 : currentEraIndex + 1;
  const rightIndex = currentEraIndex < eras.length - 1 ? currentEraIndex + 1 : currentEraIndex - 2;
  eraIndices.push(leftIndex >= 0 ? leftIndex : possibleNeighbors[0]);
  eraIndices.push(rightIndex < eras.length ? rightIndex : possibleNeighbors[possibleNeighbors.length - 1]);
  
  // Убираем дубликаты и берём уникальные 3 индекса
  const uniqueIndices = [...new Set(eraIndices)].slice(0, 3);
  
  // Если почему-то меньше 3 — добираем случайными
  while (uniqueIndices.length < 3 && possibleNeighbors.length > 0) {
    const extra = possibleNeighbors.find(i => !uniqueIndices.includes(i));
    if (extra !== undefined) uniqueIndices.push(extra);
    else break;
  }

  const selectedEraIds = uniqueIndices.map(i => eras[i].id);
  
  // Из каждой эпохи берём по 2-3 элемента (события или правители)
  const eraItems: Record<string, { label: string; eraId: string }[]> = {};
  
  selectedEraIds.forEach(eraId => {
    const eraCards = allCards.filter(c => c.era === eraId);
    const shuffled = shuffle(eraCards);
    const count = 2 + Math.floor(Math.random() * 2); // 2 или 3 элемента
    const selected = shuffled.slice(0, count);
    
    // Для каждого элемента: если есть ruler — берём правителя с пометкой, иначе событие
    eraItems[eraId] = selected.map(c => ({
      label: c.ruler ? `${c.event}` : c.event,
      eraId,
    }));
  });

  const eraContexts = selectedEraIds.map(id => getEraContext(id));
  const categories = eraContexts.map(e => e.name);
  
  // Все элементы перемешиваем
  const allLabels = shuffle(Object.values(eraItems).flat().map(item => item.label));
  
  // Правильный ответ для обратной совместимости
  const groupAnswer: Record<string, string[]> = {};
  Object.entries(eraItems).forEach(([eraId, items]) => {
    const eraName = eraContexts.find(e => eras.find(ee => ee.id === eraId)?.name === e.name)?.name || getEraContext(eraId).name;
    groupAnswer[eraName] = items.map(i => i.label);
  });

  const categoryNames = eraContexts.map(e => e.name);

  return {
    id: `q-${card.id}-group-${Date.now()}`,
    type: 'grouping',
    cardId: card.id,
    prompt: `Распределите по эпохам`,
    correctAnswer: JSON.stringify(groupAnswer),
    categories: categoryNames,
    groupItems: allLabels,
    groupAnswer,
    explanation: Object.entries(groupAnswer)
      .map(([era, events]) => `«${era}»: ${events.join(', ')}`)
      .join('\n'),
  };
}

// ==================== NEW: MISSING WORD (вставь пропущенное слово) ====================

function generateMissingWordQuestion(card: HistoryCard): Question {
  const { fullRange } = parseYearInfo(card.year);
  // Формируем предложение с пропуском ключевого слова (не года)
  const templates = [
    { template: `Событие «____» произошло в ${fullRange} году.`, answer: card.event },
    { template: `В ${fullRange} году произошло «____».`, answer: card.event },
  ];
  const selected = templates[Math.floor(Math.random() * templates.length)];

  const missingWord = card.ruler || card.event;
  const prompt = selected.template.replace('____', '______');
  const hintWord = selected.answer;

  return {
    id: `q-${card.id}-missing-${Date.now()}`,
    type: 'missing-word',
    cardId: card.id,
    prompt: `Вставьте пропущенное слово:\n\n«${prompt}»`,
    correctAnswer: hintWord,
    explanation: `Правильный ответ: «${hintWord}». ${card.event}, ${fullRange} год.`,
    inputMode: 'text',
  };
}


// ==================== NEW: MULTIPLE CORRECT (выбери все верные) ====================

function generateMultipleCorrectQuestion(card: HistoryCard, allCards: HistoryCard[]): Question {
  const sameEraCards = allCards.filter(c => c.era === card.era && c.id !== card.id);
  
  // Берем карточки этой эпохи (максимум 4)
  const correctEvents = shuffle([card, ...sameEraCards]).slice(0, 4).map(c => c.event);
  
  // Неправильные — из соседних эпох (на одну-две эпохи вперед/назад)
  const erasList = eras.map(e => e.id);
  const cardEraIndex = erasList.indexOf(card.era);
  const adjacentEraIds: string[] = [];
  if (cardEraIndex - 1 >= 0) adjacentEraIds.push(erasList[cardEraIndex - 1]);
  if (cardEraIndex + 1 < erasList.length) adjacentEraIds.push(erasList[cardEraIndex + 1]);
  if (cardEraIndex - 2 >= 0) adjacentEraIds.push(erasList[cardEraIndex - 2]);
  if (cardEraIndex + 2 < erasList.length) adjacentEraIds.push(erasList[cardEraIndex + 2]);
  
  const adjacentCards = allCards.filter(c => adjacentEraIds.includes(c.era));
  const wrongEvents = shuffle(adjacentCards).slice(0, Math.min(3, adjacentCards.length)).map(c => c.event);
  
  // Если мало соседних — добираем из других эпох, но не слишком далеких
  if (wrongEvents.length < 2) {
    const otherEraCards = allCards.filter(c => c.era !== card.era && !adjacentEraIds.includes(c.era));
    const extra = shuffle(otherEraCards).slice(0, 3 - wrongEvents.length).map(c => c.event);
    wrongEvents.push(...extra);
  }
  
  const options = shuffle([...correctEvents, ...wrongEvents]);
  const eraContext = getEraContext(card.era);

  return {
    id: `q-${card.id}-multicorrect-${Date.now()}`,
    type: 'multiple-correct',
    cardId: card.id,
    prompt: `Какие из этих событий относятся к эпохе «${eraContext.name}» (${eraContext.yearRange})?`,
    correctAnswer: correctEvents,
    options,
    multiCorrectAnswers: correctEvents,
    explanation: `К эпохе «${eraContext.name}» относятся: ${correctEvents.join(', ')}.`,
  };
}

// ==================== NEW: DIALOG CARD (flip-карточка) ====================

function generateDialogCardQuestion(card: HistoryCard, allCards: HistoryCard[]): Question {
  const { fullRange } = parseYearInfo(card.year);
  const eraContext = getEraContext(card.era);

  // 50/50: дата→событие или термин→определение
  const isDateToEvent = Math.random() > 0.5;

  if (isDateToEvent) {
    return {
      id: `q-${card.id}-dialog-${Date.now()}`,
      type: 'dialog-card',
      cardId: card.id,
      prompt: `Запомните: ${fullRange} год`,
      correctAnswer: card.event,
      explanation: `${card.event} — ${fullRange} год, ${eraContext.name}.`,
    };
  }

  // Терминальная версия: если есть ruler → вопрос по правителю
  if (card.ruler) {
    return {
      id: `q-${card.id}-dialog-${Date.now()}`,
      type: 'dialog-card',
      cardId: card.id,
      prompt: `Запомните правителя эпохи «${eraContext.name}»`,
      correctAnswer: card.ruler,
      explanation: `${card.ruler} — правитель эпохи ${eraContext.name}. ${card.event} (${fullRange}).`,
    };
  }

  // fallback: дата→событие
  return {
    id: `q-${card.id}-dialog-${Date.now()}`,
    type: 'dialog-card',
    cardId: card.id,
    prompt: `Запомните: ${fullRange} год`,
    correctAnswer: card.event,
    explanation: `${card.event} — ${fullRange} год, ${eraContext.name}.`,
  };
}

// ==================== STRUGGLE MODE ====================
export function generateStruggleQuestion(card: HistoryCard, allCards: HistoryCard[]): Question {
  const { startYear, fullRange, isRange } = parseYearInfo(card.year);
  const displayCorrect = fullRange;

  let wrongYear: string;
  if (isRange) {
    const distractors = getDateDistractors(card, allCards);
    wrongYear = distractors.length > 0 ? distractors[0] : String(parseInt(startYear) + 10);
  } else {
    wrongYear = String(parseInt(startYear) + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 1));
  }

  const options = shuffle([displayCorrect, wrongYear]);

  return {
    id: `q-${card.id}-struggle-${Date.now()}`,
    type: 'select-date',
    cardId: card.id,
    prompt: `В каком году ${card.event}?`,
    correctAnswer: displayCorrect,
    options: options.slice(0, 2),
    explanation: `${card.event} — ${fullRange} год. ${card.period}, эпоха «${getEraContext(card.era).name}».`,
  };
}

// Простые типы вопросов — для телефона и повторения
// Не содержат сложных drag&drop, кликабельных миниконтейнеров
const SIMPLE_QUESTION_TYPES: QuestionType[] = [
  'select-date', 'select-event', 'input-year', 'input-text',
  'true-false', 'fill-blank', 'odd-one-out', 'who-is', 'quote-author',
  'define-term', 'identify-term', 'select-term-by-era',
  'term-by-context', 'term-by-function', 'term-distinguish',
  'term-odd-one-out', 'term-by-consequence', 'term-scenario',
];

// Сложные типы — для десктопа и уроков
const ADVANCED_QUESTION_TYPES: QuestionType[] = [
  'match-pairs', 'timeline-order', 'grouping',
  'multiple-correct', 'dialog-card', 'missing-word',
];

export function normalizeQuestion(q: Question): Question {
  if (!q || !q.type || !q.prompt || !q.correctAnswer) {
    return createFallbackQuestion();
  }

  switch (q.type) {
    case 'select-date':
    case 'select-event':
    case 'odd-one-out':
    case 'who-is':
    case 'quote-author':
      if (!q.options || q.options.length < 2) {
        return createFallbackQuestion();
      }
      if (Array.isArray(q.correctAnswer)) {
        q.correctAnswer = q.correctAnswer[0] || '';
      }
      break;

    case 'true-false':
      if (!q.options || q.options.length < 2) {
        q.options = ['true', 'false'];
      }
      if (q.correctAnswer !== 'true' && q.correctAnswer !== 'false') {
        q.correctAnswer = 'true';
      }
      break;

    case 'input-year':
      if (!q.inputMode) q.inputMode = 'year';
      if (Array.isArray(q.correctAnswer)) {
        q.correctAnswer = q.correctAnswer[0] || '';
      }
      break;

    case 'input-text':
    case 'fill-blank':
    case 'define-term':
    case 'identify-term':
    case 'select-term-by-era':
    case 'term-by-context':
    case 'term-by-function':
    case 'term-distinguish':
    case 'term-odd-one-out':
    case 'term-by-consequence':
    case 'term-scenario':
      if (!q.inputMode) q.inputMode = 'text';
      if (Array.isArray(q.correctAnswer)) {
        q.correctAnswer = q.correctAnswer[0] || '';
      }
      break;

    case 'match-pairs':
      if (!q.pairs || q.pairs.length < 2) {
        return createFallbackQuestion();
      }
      if (Array.isArray(q.correctAnswer)) {
        q.correctAnswer = JSON.stringify(q.pairs);
      }
      break;

    case 'timeline-order':
      if (!q.timelineItems || q.timelineItems.length < 2) {
        return createFallbackQuestion();
      }
      if (typeof q.correctAnswer === 'string') {
        try {
          const parsed = JSON.parse(q.correctAnswer);
          if (Array.isArray(parsed)) {
            q.correctAnswer = parsed;
          }
        } catch {
          q.correctAnswer = q.timelineItems;
        }
      }
      break;

    case 'grouping':
      if (!q.categories || !q.groupItems || q.groupItems.length < 2) {
        return createFallbackQuestion();
      }
      if (Array.isArray(q.correctAnswer)) {
        q.correctAnswer = JSON.stringify(q.groupAnswer || {});
      }
      break;

    case 'missing-word':
      if (!q.inputMode) q.inputMode = 'text';
      if (Array.isArray(q.correctAnswer)) {
        q.correctAnswer = q.correctAnswer[0] || '';
      }
      break;

    case 'multiple-correct':
      if (!q.options || q.options.length < 2) {
        return createFallbackQuestion();
      }
      if (Array.isArray(q.multiCorrectAnswers)) {
        q.correctAnswer = q.multiCorrectAnswers;
      }
      break;

    case 'dialog-card':
      if (!q.prompt || !q.correctAnswer) {
        return createFallbackQuestion();
      }
      break;

    default:
      return createFallbackQuestion();
  }

  return q;
}

function createFallbackQuestion(): Question {
  return {
    id: `fallback-${Date.now()}`,
    type: 'select-date',
    cardId: 'fallback',
    prompt: 'Какое событие связано с этим годом?',
    correctAnswer: 'неизвестно',
    options: ['неизвестно', 'проверьте данные'],
    explanation: 'Вопрос был сформирован некорректно. Сообщите об этой ошибке.',
  };
}

export function generateQuestions(
  cardIds: string[],
  allCards: HistoryCard[],
  countOrOptions?: number | { count?: number; includeAdvanced?: boolean }
): Question[] {
  const opts = typeof countOrOptions === 'number' ? { count: countOrOptions } : countOrOptions || {};
  const count = opts.count;
  const includeAdvanced = opts.includeAdvanced ?? true;

  const cards = cardIds
    .map(id => allCards.find(c => c.id === id))
    .filter((c): c is HistoryCard => c !== undefined);

  if (cards.length === 0) return [];

  const questionTypes: QuestionType[] = [...SIMPLE_QUESTION_TYPES];
  if (includeAdvanced && cards.length >= 4) {
    questionTypes.push(...ADVANCED_QUESTION_TYPES);
  }

  const questions: Question[] = [];
  const usedCardTypes = new Set<string>();

  const shuffledCards = shuffle(cards);
  const questionsPerCard = Math.min(count ? Math.ceil(count / cards.length) : 2, 3);

  for (const card of shuffledCards) {
    const availableTypes = shuffle([...questionTypes]);
    let questionsAddedForThisCard = 0;

    for (const type of availableTypes) {
      if (questionsAddedForThisCard >= questionsPerCard) break;
      if (questions.length >= (count || cards.length * 2)) break;

      const cardTypeKey = `${card.id}-${type}`;
      if (usedCardTypes.has(cardTypeKey)) continue;

      let question: Question;

      switch (type) {
        case 'select-date':
          question = generateSelectDateQuestion(card, allCards);
          break;
        case 'select-event':
          question = generateSelectEventQuestion(card, allCards);
          break;
        case 'input-year':
          question = generateInputYearQuestion(card);
          break;
        case 'input-text':
          question = generateInputTextQuestion(card, allCards);
          break;
        case 'true-false':
          question = generateTrueFalseQuestion(card, allCards);
          break;
        case 'fill-blank':
          question = generateFillBlankQuestion(card);
          break;
        case 'odd-one-out':
          question = generateOddOneOutQuestion(card, allCards);
          break;
        case 'match-pairs':
          question = generateMatchPairsQuestion(card, allCards);
          break;
        case 'timeline-order':
          question = generateTimelineOrderQuestion(card, allCards);
          break;
        case 'who-is': {
          const figures = historicalFigures.filter(f => f.era === card.era);
          if (figures.length > 0) {
            const figure = figures[Math.floor(Math.random() * figures.length)];
            question = generateWhoIsQuestion(figure, allCards, card.id);
          } else {
            question = generateSelectDateQuestion(card, allCards);
          }
          break;
        }
        case 'quote-author': {
          const quotes = historicalQuotes.filter(q => q.era === card.era);
          if (quotes.length > 0) {
            const quote = quotes[Math.floor(Math.random() * quotes.length)];
            question = generateQuoteAuthorQuestion(quote, card.id);
          } else {
            question = generateSelectDateQuestion(card, allCards);
          }
          break;
        }
        case 'define-term':
        case 'identify-term':
        case 'select-term-by-era': {
          const eraId = card.era;
          const eraTerms = getTermsForEra(eraId);
          const allTerms = getAllTerms();

          if (eraTerms.length > 0 && allTerms.length >= 2) {
            const randomTerm = eraTerms[Math.floor(Math.random() * eraTerms.length)];
            switch (type) {
              case 'define-term':
                question = generateDefineTermQuestion(randomTerm, eraId, eraTerms, allTerms);
                break;
              case 'identify-term':
                question = generateIdentifyTermQuestion(randomTerm, eraId, eraTerms, allTerms);
                break;
              case 'select-term-by-era':
                question = generateSelectTermByEraQuestion(randomTerm, eraId, allTerms);
                break;
            }
          } else {
            question = generateSelectDateQuestion(card, allCards);
          }
          break;
        }
        case 'grouping':
          question = generateGroupingQuestion(card, allCards);
          break;
        case 'missing-word':
          question = generateMissingWordQuestion(card);
          break;
        case 'multiple-correct':
          question = generateMultipleCorrectQuestion(card, allCards);
          break;
        case 'dialog-card':
          question = generateDialogCardQuestion(card, allCards);
          break;
        default:
          question = generateSelectDateQuestion(card, allCards);
      }

      questions.push(question);
      usedCardTypes.add(cardTypeKey);
      questionsAddedForThisCard++;
    }
  }

  return shuffle(questions).slice(0, count || questions.length);
}

// ==================== ГЕНЕРАТОРЫ ВОПРОСОВ ПО ТЕРМИНАМ ====================

function getTermsForEra(eraId: string): { term: string; definition: string }[] {
  const sectionId = eraToTheorySection[eraId];
  if (!sectionId) return [];

  const section = theorySections.find(s => s.id === sectionId);
  if (!section) return [];

  const allTerms: { term: string; definition: string }[] = [];
  for (const topic of section.topics) {
    if (typeof topic.content !== 'string' && topic.content.terms) {
      allTerms.push(...topic.content.terms);
    }
  }
  const seen = new Set<string>();
  return allTerms.filter(t => {
    if (seen.has(t.term)) return false;
    seen.add(t.term);
    return true;
  });
}

function getAllTerms(): { term: string; definition: string }[] {
  const allTerms: { term: string; definition: string }[] = [];
  for (const section of theorySections) {
    for (const topic of section.topics) {
      if (typeof topic.content !== 'string' && topic.content.terms) {
        allTerms.push(...topic.content.terms);
      }
    }
  }
  const seen = new Set<string>();
  return allTerms.filter(t => {
    if (seen.has(t.term)) return false;
    seen.add(t.term);
    return true;
  });
}

function getTermDefinitionDistractors(
  correctTerm: string,
  eraTerms: { term: string; definition: string }[],
  _allTerms: { term: string; definition: string }[]
): string[] {
  const sameEraDefs = eraTerms
    .filter(t => t.term !== correctTerm)
    .map(t => t.definition);
  shuffle(sameEraDefs);
  return sameEraDefs.slice(0, 3);
}

function getTermNameDistractors(
  correctDefinition: string,
  eraTerms: { term: string; definition: string }[],
  _allTerms: { term: string; definition: string }[]
): string[] {
  const sameEraTerms = eraTerms
    .filter(t => t.definition !== correctDefinition)
    .map(t => t.term);
  shuffle(sameEraTerms);
  return sameEraTerms.slice(0, 3);
}

function generateDefineTermQuestion(
  term: { term: string; definition: string },
  eraId: string,
  eraTerms: { term: string; definition: string }[],
  allTerms: { term: string; definition: string }[]
): Question {
  const wrongDefs = getTermDefinitionDistractors(term.term, eraTerms, allTerms);
  const options = shuffle([term.definition, ...wrongDefs]);
  const eraContext = getEraContext(eraId);

  return {
    id: `q-term-${term.term}-define-${Date.now()}`,
    type: 'define-term',
    cardId: eraId,
    prompt: `Выберите правильное определение для термина «${term.term}»`,
    correctAnswer: term.definition,
    options,
    explanation: `«${term.term}» — ${term.definition}. Эпоха: ${eraContext.name}.`,
  };
}

function generateIdentifyTermQuestion(
  term: { term: string; definition: string },
  eraId: string,
  eraTerms: { term: string; definition: string }[],
  allTerms: { term: string; definition: string }[]
): Question {
  const wrongTerms = getTermNameDistractors(term.definition, eraTerms, allTerms);
  const options = shuffle([term.term, ...wrongTerms]);
  const eraContext = getEraContext(eraId);

  return {
    id: `q-term-${term.term}-identify-${Date.now()}`,
    type: 'identify-term',
    cardId: eraId,
    prompt: `Какой термин соответствует данному определению?\n\n«${term.definition}»`,
    correctAnswer: term.term,
    options,
    explanation: `${term.term} — ${term.definition}. Эпоха: ${eraContext.name}.`,
  };
}

function generateSelectTermByEraQuestion(
  term: { term: string; definition: string },
  eraId: string,
  allTerms: { term: string; definition: string }[]
): Question {
  const eraContext = getEraContext(eraId);

  // Дистракторы — ТОЛЬКО из терминов ДРУГИХ эпох, чтобы не было нескольких
  // правильных вариантов (как "Полюдье", "Варяги", "Рюриковичи" — всё Древняя Русь)
  const eraTermNames = new Set(
    getTermsForEra(eraId).map(t => t.term.toLowerCase())
  );
  
  const otherEraTerms = allTerms
    .filter(t => {
      if (t.term === term.term) return false;
      // Если термин тоже из этой эпохи — выкидываем
      if (eraTermNames.has(t.term.toLowerCase())) return false;
      return true;
    })
    .map(t => t.term);
  
  shuffle(otherEraTerms);
  const wrongTerms = otherEraTerms.slice(0, 3);
  const options = shuffle([term.term, ...wrongTerms]);

  return {
    id: `q-term-${term.term}-era-${Date.now()}`,
    type: 'select-term-by-era',
    cardId: eraId,
    prompt: `Какой из перечисленных терминов относится к эпохе «${eraContext.name}» (${eraContext.yearRange})?`,
    correctAnswer: term.term,
    options,
    explanation: `${term.term} — ${term.definition}. Эпоха: ${eraContext.name} (${eraContext.yearRange}).`,
  };
}

export function generateTermQuestionsForEra(
  eraId: string,
  count: number = 2
): Question[] {
  const eraTerms = getTermsForEra(eraId);
  if (eraTerms.length === 0) return [];

  const allTerms = getAllTerms();
  if (allTerms.length < 2) return [];

  const questions: Question[] = [];
  const shuffledTerms = shuffle(eraTerms);
  const usedTypes = new Set<string>();
  const termQuestionTypes = ['define-term', 'identify-term', 'select-term-by-era'] as const;

  for (const term of shuffledTerms) {
    if (questions.length >= count) break;
    const availableTypes = shuffle([...termQuestionTypes]);

    for (const type of availableTypes) {
      if (questions.length >= count) break;
      const typeKey = `${term.term}-${type}`;
      if (usedTypes.has(typeKey)) continue;

      let q: Question;
      switch (type) {
        case 'define-term':
          q = generateDefineTermQuestion(term, eraId, eraTerms, allTerms);
          break;
        case 'identify-term':
          q = generateIdentifyTermQuestion(term, eraId, eraTerms, allTerms);
          break;
        case 'select-term-by-era':
          q = generateSelectTermByEraQuestion(term, eraId, allTerms);
          break;
        default:
          continue;
      }

      questions.push(q);
      usedTypes.add(typeKey);
    }
  }

  return questions;
}

export function generateLessonQuestions(
  cardIds: string[],
  allCards: HistoryCard[],
  options: { count?: number; prioritizeWeak?: boolean; weakCardIds?: string[] } = {}
): Question[] {
  const { count = 8, prioritizeWeak = false, weakCardIds = [] } = options;

  let selectedCards = [...cardIds];

  if (prioritizeWeak && weakCardIds.length > 0) {
    const weakInLesson = weakCardIds.filter(id => cardIds.includes(id));
    const remaining = cardIds.filter(id => !weakInLesson.includes(id));
    const weakCount = Math.min(weakInLesson.length, Math.ceil(count * 0.4));
    selectedCards = [...weakInLesson.slice(0, weakCount), ...remaining];
  }

  const termQuestionCount = Math.max(2, Math.floor(count * 0.3));

  const erasInLesson = [...new Set(
    selectedCards
      .map(id => allCards.find(c => c.id === id))
      .filter((c): c is HistoryCard => c !== undefined)
      .map(c => c.era)
  )];

  const advancedTermQuestions = erasInLesson.flatMap(
    eraId => generateAdvancedTermQuestions(eraId, allCards, Math.ceil(termQuestionCount / Math.max(1, erasInLesson.length)))
  ).slice(0, termQuestionCount);

  const cardQuestionsCount = count - advancedTermQuestions.length;
  const cardQuestions = generateQuestions(selectedCards, allCards, { count: Math.max(2, cardQuestionsCount) });

  return shuffle([...cardQuestions, ...advancedTermQuestions]).slice(0, count);
}