// ==================== ТИПЫ ДЛЯ КАРТОГРАФИЧЕСКИХ ЗАДАНИЙ ====================

/** Зона на карте — кликабельная область */
export interface MapZone {
  id: string;
  /** Тип зоны: цифра, буква, стрелка, область */
  type: 'number' | 'letter' | 'arrow' | 'area' | 'city';
  /** Надпись/значение на карте (например, "1", "А", "Киев") */
  label: string;
  /** Что обозначает эта зона (правильный ответ) */
  meaning: string;
  /** Координаты для image-map: [x1, y1, x2, y2] в % от размеров карты */
  coords: [number, number, number, number];
  /** Дополнительная информация для подсказок */
  hint?: string;
}

/** Карта из PDF */
export interface MapData {
  id: string;
  /** Номер страницы в PDF */
  pageNumber: number;
  /** Название карты */
  title: string;
  /** Краткое описание */
  description: string;
  /** Эпоха (совпадает с era в historyDates) */
  era: string;
  /** Период (например, "IX-XIII вв.") */
  period: string;
  /** Путь к изображению (public/maps/map_001.png) */
  imagePath: string;
  /** Связанные cardId из historyDates */
  relatedCardIds: string[];
  /** Кликабельные зоны на карте */
  zones: MapZone[];
  /** Типовые вопросы ЕГЭ по этой карте */
  typicalQuestions: MapQuestionTemplate[];
  /** Подсказки для узнавания карты */
  recognitionHints: string[];
}

/** Шаблон вопроса для карты */
export interface MapQuestionTemplate {
  type: MapQuestionType;
  prompt: string;
  /** Какой zoneId является правильным ответом (если применимо) */
  correctZoneId?: string;
  /** Варианты ответов для выбора */
  options?: string[];
  /** Правильный ответ */
  correctAnswer: string;
  /** Объяснение */
  explanation: string;
}

/** Типы вопросов по картам */
export type MapQuestionType = 
  | 'map-name'           // "Укажите название войны/похода"
  | 'map-digit-meaning'  // "Что обозначено цифрой X?"
  | 'map-letter-meaning' // "Что обозначено буквой Y?"
  | 'map-event-by-digit' // "Какое сражение под цифрой Z?"
  | 'map-city-by-digit'  // "Какой город под цифрой W?"
  | 'map-commander'      // "Кто командовал в сражении X?"
  | 'map-date'           // "В каком году произошло событие на карте?"
  | 'map-treaty'         // "Какой мир был заключён по итогам?"
  | 'map-true-false'     // "Верны ли суждения о карте?"
  | 'map-multiple-choice'; // Выбор из 4 вариантов как в ЕГЭ

/** Категория карт для навигации */
export interface MapCategory {
  id: string;
  name: string;
  period: string;
  color: string;
  icon: string;
  mapIds: string[];
}