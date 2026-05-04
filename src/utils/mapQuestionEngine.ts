import { MapData, MapZone, MapQuestionTemplate } from '../types/mapTypes';

export interface GeneratedMapQuestion {
  id: string;
  mapId: string;
  prompt: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  relatedZoneId?: string;
  type: string;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Извлечь зоны с типом 'number' для вопросов "что под цифрой" */
function getNumberedZones(map: MapData): MapZone[] {
  return map.zones.filter(z => z.type === 'number');
}

/** Извлечь зоны с типом 'letter' для вопросов "что под буквой" */
function getLetterZones(map: MapData): MapZone[] {
  return map.zones.filter(z => z.type === 'letter');
}

/** Выбрать неправильные варианты из других зон той же карты */
function getWrongAnswers(map: MapData, correctZone: MapZone, count: number = 3): string[] {
  const others = map.zones
    .filter(z => z.id !== correctZone.id)
    .map(z => z.meaning);
  
  const shuffled = shuffleArray(others);
  return shuffled.slice(0, count);
}

/** Генерация вопроса из шаблона */
function generateFromTemplate(
  map: MapData,
  template: MapQuestionTemplate,
): GeneratedMapQuestion {
  return {
    id: `map_q_${map.id}_${template.type}_${Date.now()}`,
    mapId: map.id,
    prompt: template.prompt,
    correctAnswer: template.correctAnswer,
    options: template.options || shuffleArray([
      template.correctAnswer,
      ...getWrongAnswers(map, template.correctZoneId 
        ? map.zones.find(z => z.id === template.correctZoneId)! 
        : map.zones[0], 3)
    ]),
    explanation: template.explanation,
    relatedZoneId: template.correctZoneId,
    type: template.type,
  };
}

/** Основная функция — получить случайный вопрос по карте */
export function getMapQuestion(map: MapData): GeneratedMapQuestion {
  const templates = map.typicalQuestions;
  if (templates.length === 0) {
    // fallback — простой вопрос
    return {
      id: `map_q_${map.id}_fallback_${Date.now()}`,
      mapId: map.id,
      prompt: `Какая война/событие изображено на карте?`,
      correctAnswer: map.title,
      options: shuffleArray([map.title, 'Русско-турецкая война', 'Северная война', 'Ливонская война']),
      explanation: `На карте изображено: ${map.title}. ${map.description}`,
      type: 'map-name',
    };
  }

  const template = templates[Math.floor(Math.random() * templates.length)];
  return generateFromTemplate(map, template);
}

/** Получить несколько вопросов по карте (для режима "все вопросы") */
export function getMapQuestions(map: MapData, count: number = 3): GeneratedMapQuestion[] {
  const shuffled = shuffleArray(map.typicalQuestions);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  
  if (selected.length === 0) {
    return [getMapQuestion(map)];
  }
  
  return selected.map(t => generateFromTemplate(map, t));
}

/** Проверить ответ пользователя на вопрос */
export function checkMapAnswer(
  question: GeneratedMapQuestion,
  userAnswer: string,
): boolean {
  return userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
}

/** Проверить ответ по зоне (клик на карту) */
export function checkMapZoneAnswer(
  question: GeneratedMapQuestion,
  clickedZoneId: string,
): boolean {
  return question.relatedZoneId === clickedZoneId;
}

/** Получить подсказку для вопроса */
export function getMapHint(map: MapData, question: GeneratedMapQuestion): string {
  // Если есть relatedZoneId, дать подсказку по этой зоне
  if (question.relatedZoneId) {
    const zone = map.zones.find(z => z.id === question.relatedZoneId);
    if (zone?.hint) return zone.hint;
  }

  // Дать случайную подсказку из recognitionHints
  const hints = map.recognitionHints;
  if (hints.length > 0) {
    return hints[Math.floor(Math.random() * hints.length)];
  }

  return 'Посмотрите на легенду карты и обозначения (цифры, буквы, стрелки).';
}

/** Получить правильный вариант для подсветки на карте */
export function getCorrectZoneId(question: GeneratedMapQuestion): string | undefined {
  return question.relatedZoneId;
}