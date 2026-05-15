/**
 * Утилиты для гибкой нормализации и сравнения текстовых ответов.
 * Используются ТОЛЬКО для текстовых типов вопросов (input-text, fill-blank, и т.д.).
 * НЕ применяются к вопросам на годы (input-year) и к вопросам с выбором из вариантов.
 */

/**
 * Словарь для конвертации римских цифр в арабские.
 * Обрабатывает цифры от I до X (основные римские цифры в исторических контекстах).
 */
const romanToArabicMap: Record<string, string> = {
  'i': '1',
  'ii': '2',
  'iii': '3',
  'iv': '4',
  'v': '5',
  'vi': '6',
  'vii': '7',
  'viii': '8',
  'ix': '9',
  'x': '10',
};

/**
 * Нормализует строку ответа для сравнения:
 * - приводит к нижнему регистру
 * - убирает лишние пробелы в начале/конце
 * - схлопывает множественные пробелы в один
 * - заменяет ё → е
 * - заменяет римские цифры (I, II, III и т.д.) на арабские (1, 2, 3...)
 * - заменяет русские порядковые (первый, второй...) на цифры
 * - убирает лишние знаки препинания (оставляя буквы, цифры, пробелы, дефисы)
 */
export function normalizeTextAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')                // множественные пробелы → один
    .replace(/ё/g, 'е')                  // ё → е
    .replace(/\b(i{1,3}|iv|vi{0,3}|ix|x)\b/gi, match => romanToArabicMap[match.toLowerCase()] || match)  // римские цифры → арабские
    .replace(/\bпервый\b/g, '1')
    .replace(/\bвторой\b/g, '2')
    .replace(/\bтретий\b/g, '3')
    .replace(/\bчетвертый\b/g, '4')
    .replace(/\bпятый\b/g, '5')
    .replace(/\bшестой\b/g, '6')
    .replace(/\bседьмой\b/g, '7')
    .replace(/\bвосьмой\b/g, '8')
    .replace(/\bдевятый\b/g, '9')
    .replace(/\bдесятый\b/g, '10')
    .replace(/[^а-яa-z0-9\s\-]/gi, '')   // удаляем всё кроме букв, цифр, пробелов, дефисов
    .trim();
}

/**
 * Создаёт "слитную" версию (без пробелов и дефисов) для мягкого сравнения.
 * Например "ярослав мудрый" → "ярославмудрый", "иван-грозный" → "ивангрозный"
 */
export function normalizeConcatenated(answer: string): string {
  return normalizeTextAnswer(answer).replace(/[\s\-]/g, '');
}

/**
 * Извлекает значимые ключевые слова из нормализованного текста.
 * Убирает предлоги, союзы, частицы и короткие слова (< 3 букв).
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'в', 'на', 'по', 'за', 'из', 'у', 'о', 'об', 'от', 'до',
    'при', 'с', 'со', 'к', 'ко', 'во', 'под', 'над', 'для',
    'и', 'а', 'но', 'да', 'или', 'ни', 'не', 'нет', 'же',
    'бы', 'ли', 'как', 'так', 'что', 'чтобы', 'если', 'то',
    'этот', 'эта', 'это', 'эти', 'его', 'её', 'их', 'все',
    'год', 'году', 'годы', 'век', 'веке', 'века',
  ]);

  return text
    .split(/\s+/)
    .filter(w => w.length >= 3 && !stopWords.has(w));
}

/**
 * Проверяет, является ли ответ правильным для текстового вопроса.
 * Использует несколько стратегий сравнения (от строгих к мягким).
 *
 * @param userAnswer - ответ пользователя
 * @param correctAnswer - основной правильный ответ
 * @param acceptableAnswers - массив дополнительных допустимых вариантов
 * @param aliases - массив синонимов (упрощённые версии)
 * @returns boolean
 */
export function checkTextAnswer(
  userAnswer: string,
  correctAnswer: string,
  acceptableAnswers: string[] = [],
  aliases: string[] = []
): boolean {
  const normalizedUser = normalizeTextAnswer(userAnswer);

  // 1. Прямое сравнение нормализованных строк
  const normalizedCorrect = normalizeTextAnswer(correctAnswer);
  if (normalizedUser === normalizedCorrect) return true;

  // 2. Сравнение с acceptableAnswers
  for (const acceptable of acceptableAnswers) {
    if (normalizeTextAnswer(acceptable) === normalizedUser) return true;
  }

  // 3. Сравнение с aliases
  for (const alias of aliases) {
    if (normalizeTextAnswer(alias) === normalizedUser) return true;
  }

  // 4. Сравнение "слитных" версий
  const concatenatedUser = normalizeConcatenated(userAnswer);
  const concatenatedCorrect = normalizeConcatenated(correctAnswer);
  if (concatenatedUser === concatenatedCorrect) return true;

  for (const acceptable of acceptableAnswers) {
    if (normalizeConcatenated(acceptable) === concatenatedUser) return true;
  }

  for (const alias of aliases) {
    if (normalizeConcatenated(alias) === concatenatedUser) return true;
  }

  // 5. Сравнение по ключевым словам с учётом форм слова (подстрока)
  // Позволяет принять "правительствующий сенат" вместо "Учреждение Правительствующего сената"
  // (разные падежи — сравниваем по вхождению подстроки)
  const userKeywords = extractKeywords(normalizedUser);
  const correctKeywords = extractKeywords(normalizedCorrect);

  /**
   * Проверяет, "совпадают" ли два слова по смыслу (с учётом разных падежей/окончаний):
   * - точное совпадение
   * - одно содержит другое как подстроку
   * - общий префикс длиной ≥ 4 символов (разные окончания: "правительствующий" / "правительствующего")
   */
  const wordsMatch = (a: string, b: string): boolean => {
    if (a === b) return true;
    if (a.includes(b) || b.includes(a)) return true;
    // Проверяем общий префикс (разные падежи/окончания)
    const minLen = Math.min(a.length, b.length);
    let commonPrefix = 0;
    for (let i = 0; i < minLen; i++) {
      if (a[i] === b[i]) commonPrefix++;
      else break;
    }
    return commonPrefix >= 4;
  };

  /**
   * Проверяет, все ли слова из набора words совпадают хотя бы с одним словом из targetSet.
   */
  const allWordsMatch = (words: string[], targetSet: string[]): boolean => {
    return words.every(w => targetSet.some(t => wordsMatch(w, t)));
  };

  // Все слова пользователя есть в правильном ответе?
  if (userKeywords.length >= 2 && allWordsMatch(userKeywords, correctKeywords)) {
    return true;
  }

  // Все ключевые слова правильного ответа есть в ответе пользователя?
  if (correctKeywords.length >= 2 && allWordsMatch(correctKeywords, userKeywords)) {
    return true;
  }

  // Проверка по acceptableAnswers и aliases через ключевые слова
  const allVariants = [...acceptableAnswers, ...aliases];
  for (const variant of allVariants) {
    const variantKeywords = extractKeywords(normalizeTextAnswer(variant));
    if (variantKeywords.length >= 2) {
      if (allWordsMatch(userKeywords, variantKeywords)) return true;
      if (allWordsMatch(variantKeywords, userKeywords)) return true;
    }
  }

  return false;
}

/**
 * Определяет, является ли вопрос текстовым (требует мягкой проверки).
 * Возвращает true для типов, где пользователь вводит текст.
 */
export function isTextQuestion(type: string): boolean {
  return type === 'input-text' || type === 'fill-blank' || type === 'who-is' || type === 'quote-author' || type === 'missing-word';
}

/**
 * Определяет, является ли вопрос числовым (год) — требует строгой проверки.
 */
export function isYearQuestion(type: string): boolean {
  return type === 'input-year' || type === 'fill-blank'; // fill-blank может быть и текстовым, и годовым — смотрим по inputMode
}

/**
 * Нормализует строку с годом для сравнения:
 * - убирает пробелы
 * - убирает лидирующие нули
 * - заменяет тире (–, —) на обычный дефис (-)
 * - убирает все нецифровые символы кроме дефиса
 * - нормализует диапазоны: "1700-1721" и "1700–1721" → одинаковый результат
 */
export function normalizeYearAnswer(yearStr: string): string {
  // Сначала нормализуем тире и убираем пробелы
  const normalized = yearStr
    .trim()
    .replace(/\s+/g, '')
    .replace(/[–—]/g, '-')
    .replace(/[^0-9\-]/g, '');
  
  // Убираем лидирующие нули из каждого года в диапазоне
  // Например: "0862-0879" → "862-879"
  const parts = normalized.split('-');
  const cleanedParts = parts.map(part => {
    // Убираем лидирующие нули, но оставляем хотя бы одну цифру
    const cleaned = part.replace(/^0+/, '') || '0';
    return cleaned;
  });
  
  return cleanedParts.join('-');
}
