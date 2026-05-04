export interface Ruler {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  century: string;
  keyEvents: string[]; // опорные события для запоминания
  predecessor?: string; // id предшественника
  successor?: string; // id преемника
  tags: string[]; // теги для группировки: dynasty, era-feature и т.д.
}

export interface ReignCluster {
  id: string;
  name: string; // название учебного блока
  subtitle: string; // пояснение
  yearRange: string;
  rulerIds: string[]; // правители в этом блоке
  icon: string;
  color: string;
  description: string;
  // Когда блок открывается: нужно пройти N обычных уроков
  unlockLessonCount: number;
}

export const rulers: Record<string, Ruler> = {
  // === КЛАСТЕР 1: Ранние князья ===
  'ryurik': { id: 'ryurik', name: 'Рюрик', startYear: 862, endYear: 879, century: 'IX', keyEvents: ['Призвание варягов'], tags: ['Рюриковичи', 'Древняя Русь'] },
  'oleg': { id: 'oleg', name: 'Олег', startYear: 879, endYear: 912, century: 'IX–X', keyEvents: ['Захват Киева', 'Походы на Царьград'], predecessor: 'ryurik', successor: 'igor', tags: ['Рюриковичи', 'Древняя Русь'] },
  'igor': { id: 'igor', name: 'Игорь', startYear: 912, endYear: 945, century: 'X', keyEvents: ['Походы на Византию', 'Восстание древлян'], predecessor: 'oleg', successor: 'olga', tags: ['Рюриковичи', 'Древняя Русь'] },
  'olga': { id: 'olga', name: 'Ольга', startYear: 945, endYear: 962, century: 'X', keyEvents: ['Крещение Ольги', 'Налоговая реформа (уроки и погосты)'], predecessor: 'igor', successor: 'svyatoslav', tags: ['Рюриковичи', 'Древняя Русь'] },
  'svyatoslav': { id: 'svyatoslav', name: 'Святослав', startYear: 962, endYear: 972, century: 'X', keyEvents: ['Разгром Хазарии', 'Война с Болгарией', 'Битва при Доростоле'], predecessor: 'olga', successor: 'yaropolk', tags: ['Рюриковичи', 'Древняя Русь'] },
  'vladimir1': { id: 'vladimir1', name: 'Владимир I Святой', startYear: 980, endYear: 1015, century: 'X–XI', keyEvents: ['Крещение Руси (988)', 'Десятинная церковь'], predecessor: 'yaropolk', successor: 'svyatopolk', tags: ['Рюриковичи', 'Древняя Русь'] },

  // === КЛАСТЕР 2: Киевская Русь и раздробленность ===
  'yaroslav': { id: 'yaroslav', name: 'Ярослав Мудрый', startYear: 1019, endYear: 1054, century: 'XI', keyEvents: ['Русская Правда', 'Софийский собор', 'Победа над печенегами'], tags: ['Рюриковичи', 'Киевская Русь'] },
  'vladimir_monomah': { id: 'vladimir_monomah', name: 'Владимир Мономах', startYear: 1113, endYear: 1125, century: 'XII', keyEvents: ['Долобский съезд', 'Походы на половцев', 'Повесть временных лет'], tags: ['Рюриковичи', 'Киевская Русь'] },
  'mstislav': { id: 'mstislav', name: 'Мстислав Великий', startYear: 1125, endYear: 1132, century: 'XII', keyEvents: ['Последний год единой Руси'], predecessor: 'vladimir_monomah', successor: 'yaropolk2', tags: ['Рюриковичи', 'Киевская Русь'] },
  'andrey_bogolyubsky': { id: 'andrey_bogolyubsky', name: 'Андрей Боголюбский', startYear: 1157, endYear: 1174, century: 'XII', keyEvents: ['Покров на Нерли', 'Захват Киева (1169)', 'Перенос столицы во Владимир'], tags: ['Рюриковичи', 'Владимиро-Суздальская земля'] },
  'vsevolod_big_nest': { id: 'vsevolod_big_nest', name: 'Всеволод Большое Гнездо', startYear: 1176, endYear: 1212, century: 'XII–XIII', keyEvents: ['Расцвет Владимиро-Суздальского княжества'], predecessor: 'andrey_bogolyubsky', tags: ['Рюриковичи', 'Владимиро-Суздальская земля'] },

  // === КЛАСТЕР 3: Возвышение Москвы ===
  'daniil_moscow': { id: 'daniil_moscow', name: 'Даниил Московский', startYear: 1276, endYear: 1303, century: 'XIII–XIV', keyEvents: ['Начало возвышения Москвы', 'Присоединение Коломны'], tags: ['Рюриковичи', 'Москва'] },
  'ivan_kalita': { id: 'ivan_kalita', name: 'Иван I Калита', startYear: 1325, endYear: 1340, century: 'XIV', keyEvents: ['Переезд митрополита в Москву', '"Собирание земель"'], tags: ['Рюриковичи', 'Москва'] },
  'dmitry_donskoy': { id: 'dmitry_donskoy', name: 'Дмитрий Донской', startYear: 1359, endYear: 1389, century: 'XIV', keyEvents: ['Куликовская битва (1380)', 'Белокаменный Кремль'], predecessor: 'ivan_kalita', tags: ['Рюриковичи', 'Москва'] },
  'vasily1': { id: 'vasily1', name: 'Василий I', startYear: 1389, endYear: 1425, century: 'XIV–XV', keyEvents: ['Нашествие Тохтамыша (1382)'], predecessor: 'dmitry_donskoy', tags: ['Рюриковичи', 'Москва'] },
  'vasily2': { id: 'vasily2', name: 'Василий II Тёмный', startYear: 1425, endYear: 1462, century: 'XV', keyEvents: ['Феодальная война', 'Ослепление'], predecessor: 'vasily1', successor: 'ivan3', tags: ['Рюриковичи', 'Москва'] },

  // === КЛАСТЕР 4: Московское государство XV–XVI вв. ===
  'ivan3': { id: 'ivan3', name: 'Иван III', startYear: 1462, endYear: 1505, century: 'XV–XVI', keyEvents: ['Стояние на Угре (1480)', 'Судебник 1497', 'Двуглавый орёл', 'Присоединение Новгорода'], predecessor: 'vasily2', successor: 'vasily3', tags: ['Рюриковичи', 'Московское государство'] },
  'vasily3': { id: 'vasily3', name: 'Василий III', startYear: 1505, endYear: 1533, century: 'XVI', keyEvents: ['Присоединение Пскова, Смоленска, Рязани'], predecessor: 'ivan3', successor: 'ivan4', tags: ['Рюриковичи', 'Московское государство'] },
  'ivan4': { id: 'ivan4', name: 'Иван IV Грозный', startYear: 1533, endYear: 1584, century: 'XVI', keyEvents: ['Венчание на царство (1547)', 'Присоединение Казани и Астрахани', 'Опричнина', 'Ливонская война', 'Стоглавый собор'], predecessor: 'vasily3', successor: 'fedor1', tags: ['Рюриковичи', 'Московское государство'] },
  'fedor1': { id: 'fedor1', name: 'Фёдор I Иоаннович', startYear: 1584, endYear: 1598, century: 'XVI', keyEvents: ['Учреждение патриаршества (1589)'], predecessor: 'ivan4', successor: 'boris_godunov', tags: ['Рюриковичи', 'Московское государство'] },

  // === КЛАСТЕР 5: Смутное время и первые Романовы ===
  'boris_godunov': { id: 'boris_godunov', name: 'Борис Годунов', startYear: 1598, endYear: 1605, century: 'XVI–XVII', keyEvents: ['Начало Смуты', 'Голод 1601–1603'], predecessor: 'fedor1', successor: 'false_dmitry1', tags: ['Смута'] },
  'false_dmitry1': { id: 'false_dmitry1', name: 'Лжедмитрий I', startYear: 1605, endYear: 1606, century: 'XVII', keyEvents: ['Самозванец', 'Свергнут'], predecessor: 'boris_godunov', tags: ['Смута'] },
  'mikhail_romanov': { id: 'mikhail_romanov', name: 'Михаил Фёдорович', startYear: 1613, endYear: 1645, century: 'XVII', keyEvents: ['Избрание на царство', 'Окончание Смуты', 'Столбовский мир'], successor: 'aleksey_mikhailovich', tags: ['Романовы', 'Смутное время'] },
  'aleksey_mikhailovich': { id: 'aleksey_mikhailovich', name: 'Алексей Михайлович', startYear: 1645, endYear: 1676, century: 'XVII', keyEvents: ['Соборное уложение (1649)', 'Восстание Хмельницкого', 'Медный бунт', 'Церковная реформа Никона'], predecessor: 'mikhail_romanov', successor: 'fedor3', tags: ['Романовы'] },
  'fedor3': { id: 'fedor3', name: 'Фёдор III Алексеевич', startYear: 1676, endYear: 1682, century: 'XVII', keyEvents: ['Отмена местничества (1682)'], predecessor: 'aleksey_mikhailovich', successor: 'peter1', tags: ['Романовы'] },
  'sofia': { id: 'sofia', name: 'Софья (регентство)', startYear: 1682, endYear: 1689, century: 'XVII', keyEvents: ['Стрелецкий бунт', 'Регентство при малолетних Петре и Иване'], tags: ['Романовы'] },

  // === КЛАСТЕР 6: Империя XVIII век ===
  'peter1': { id: 'peter1', name: 'Пётр I Великий', startYear: 1682, endYear: 1725, century: 'XVII–XVIII', keyEvents: ['Северная война', 'Основание Петербурга (1703)', 'Полтавская битва (1709)', 'Табель о рангах'], predecessor: 'fedor3', successor: 'ekaterina1', tags: ['Романовы', 'Империя'] },
  'ekaterina1': { id: 'ekaterina1', name: 'Екатерина I', startYear: 1725, endYear: 1727, century: 'XVIII', keyEvents: ['Учреждение Верховного тайного совета'], predecessor: 'peter1', tags: ['Романовы', 'Дворцовые перевороты'] },
  'anna_ioannovna': { id: 'anna_ioannovna', name: 'Анна Иоанновна', startYear: 1730, endYear: 1740, century: 'XVIII', keyEvents: ['Бироновщина', 'Сухопутный шляхетский корпус'], tags: ['Романовы', 'Дворцовые перевороты'] },
  'elizaveta_petrovna': { id: 'elizaveta_petrovna', name: 'Елизавета Петровна', startYear: 1741, endYear: 1761, century: 'XVIII', keyEvents: ['Открытие МГУ (1755)', 'Семилетняя война', 'Взятие Берлина'], tags: ['Романовы', 'Дворцовые перевороты'] },
  'peter3': { id: 'peter3', name: 'Пётр III', startYear: 1761, endYear: 1762, century: 'XVIII', keyEvents: ['Манифест о вольности дворянской'], predecessor: 'elizaveta_petrovna', successor: 'ekaterina2', tags: ['Романовы', 'Дворцовые перевороты'] },
  'ekaterina2': { id: 'ekaterina2', name: 'Екатерина II Великая', startYear: 1762, endYear: 1796, century: 'XVIII', keyEvents: ['Присоединение Крыма (1783)', 'Восстание Пугачёва', 'Жалованные грамоты', 'Уложенная комиссия', 'Взятие Измаила'], predecessor: 'peter3', successor: 'pavel1', tags: ['Романовы', 'Империя'] },
  'pavel1': { id: 'pavel1', name: 'Павел I', startYear: 1796, endYear: 1801, century: 'XVIII–XIX', keyEvents: ['Манифест о трёхдневной барщине', 'Указ о престолонаследии'], predecessor: 'ekaterina2', successor: 'alexander1', tags: ['Романовы', 'Империя'] },

  // === КЛАСТЕР 7: XIX век — от реформ к контрреформам ===
  'alexander1': { id: 'alexander1', name: 'Александр I', startYear: 1801, endYear: 1825, century: 'XIX', keyEvents: ['Министерская реформа', 'Тильзитский мир', 'Отечественная война 1812', 'Венский конгресс', 'Союзы спасения и благоденствия'], predecessor: 'pavel1', successor: 'nicholas1', tags: ['Романовы', 'Империя'] },
  'nicholas1': { id: 'nicholas1', name: 'Николай I', startYear: 1825, endYear: 1855, century: 'XIX', keyEvents: ['Восстание декабристов', '3-е отделение', 'Крымская война', 'Первая ж/д'], predecessor: 'alexander1', successor: 'alexander2', tags: ['Романовы', 'Империя'] },
  'alexander2': { id: 'alexander2', name: 'Александр II Освободитель', startYear: 1855, endYear: 1881, century: 'XIX', keyEvents: ['Отмена крепостного права (1861)', 'Земская и судебная реформы', 'Продажа Аляски', 'Военная реформа'], predecessor: 'nicholas1', successor: 'alexander3', tags: ['Романовы', 'Великие реформы'] },
  'alexander3': { id: 'alexander3', name: 'Александр III Миротворец', startYear: 1881, endYear: 1894, century: 'XIX', keyEvents: ['Манифест о незыблемости самодержавия', 'Строительство Транссиба', 'Циркуляр о "кухаркиных детях"'], predecessor: 'alexander2', successor: 'nicholas2', tags: ['Романовы', 'Контрреформы'] },
  'nicholas2': { id: 'nicholas2', name: 'Николай II', startYear: 1894, endYear: 1917, century: 'XIX–XX', keyEvents: ['Ходынская катастрофа', 'Революция 1905', 'Манифест 17 октября', 'Первая мировая война', 'Отречение'], predecessor: 'alexander3', tags: ['Романовы', 'Конец империи'] },

  // === КЛАСТЕР 8: Лидеры XX–XXI вв. ===
  'lenin': { id: 'lenin', name: 'Ленин', startYear: 1917, endYear: 1924, century: 'XX', keyEvents: ['Октябрьская революция', 'Брестский мир', 'НЭП', 'Образование СССР'], successor: 'stalin', tags: ['Советская Россия'] },
  'stalin': { id: 'stalin', name: 'Сталин', startYear: 1924, endYear: 1953, century: 'XX', keyEvents: ['Индустриализация', 'Коллективизация', 'ВОВ', 'Атомная бомба'], predecessor: 'lenin', successor: 'khrushchev', tags: ['СССР'] },
  'khrushchev': { id: 'khrushchev', name: 'Хрущёв', startYear: 1953, endYear: 1964, century: 'XX', keyEvents: ['XX съезд', 'Запуск спутника', 'Полёт Гагарина', 'Карибский кризис'], predecessor: 'stalin', successor: 'brezhnev', tags: ['СССР', 'Оттепель'] },
  'brezhnev': { id: 'brezhnev', name: 'Брежнев', startYear: 1964, endYear: 1982, century: 'XX', keyEvents: ['Пражская весна', 'Разрядка', 'Ввод в Афганистан', 'Конституция 1977'], predecessor: 'khrushchev', successor: 'andropov', tags: ['СССР', 'Застой'] },
  'gorbachev': { id: 'gorbachev', name: 'Горбачёв', startYear: 1985, endYear: 1991, century: 'XX', keyEvents: ['Перестройка', 'Чернобыль', 'Вывод из Афганистана', 'Распад СССР'], successor: 'yeltsin', tags: ['СССР', 'Перестройка'] },
  'yeltsin': { id: 'yeltsin', name: 'Ельцин', startYear: 1991, endYear: 1999, century: 'XX', keyEvents: ['Шоковая терапия', 'Конституция 1993', 'Дефолт 1998'], predecessor: 'gorbachev', successor: 'putin', tags: ['Постсоветская Россия'] },
  'putin': { id: 'putin', name: 'Путин', startYear: 1999, endYear: null as any, century: 'XX–XXI', keyEvents: ['Чемпионат мира по футболу', 'Присоединение Крыма (2014)', 'Поправки в Конституцию (2020)'], predecessor: 'yeltsin', tags: ['Постсоветская Россия'] },
};

// Кластеры (учебные блоки по 4–8 правителей)
export const reignClusters: ReignCluster[] = [
  {
    id: 'early_rus',
    name: 'Ранние князья',
    subtitle: 'От призвания варягов до Крещения',
    yearRange: '862–1015',
    rulerIds: ['ryurik', 'oleg', 'igor', 'olga', 'svyatoslav', 'vladimir1'],
    icon: '🏰',
    color: '#22c55e',
    description: 'Научись различать первых правителей Руси',
    unlockLessonCount: 2,
  },
  {
    id: 'kiev_rus',
    name: 'Киевская Русь и раздробленность',
    subtitle: 'Расцвет и распад единого государства',
    yearRange: '1019–1212',
    rulerIds: ['yaroslav', 'vladimir_monomah', 'mstislav', 'andrey_bogolyubsky', 'vsevolod_big_nest'],
    icon: '⚔️',
    color: '#3b82f6',
    description: 'Различай князей эпохи расцвета и раздробленности',
    unlockLessonCount: 5,
  },
  {
    id: 'moscow_rise',
    name: 'Возвышение Москвы',
    subtitle: 'От Даниила до Ивана III',
    yearRange: '1276–1462',
    rulerIds: ['daniil_moscow', 'ivan_kalita', 'dmitry_donskoy', 'vasily1', 'vasily2'],
    icon: '⭐',
    color: '#f59e0b',
    description: 'Пойми, как Москва стала центром Руси',
    unlockLessonCount: 8,
  },
  {
    id: 'russian_state',
    name: 'Московское государство',
    subtitle: 'От Ивана III до конца Рюриковичей',
    yearRange: '1462–1598',
    rulerIds: ['ivan3', 'vasily3', 'ivan4', 'fedor1'],
    icon: '👑',
    color: '#8b5cf6',
    description: 'Цари и государи единого государства',
    unlockLessonCount: 11,
  },
  {
    id: 'troubles_early_romanovs',
    name: 'Смута и первые Романовы',
    subtitle: 'Кризис власти и новая династия',
    yearRange: '1598–1689',
    rulerIds: ['boris_godunov', 'false_dmitry1', 'mikhail_romanov', 'aleksey_mikhailovich', 'fedor3', 'sofia'],
    icon: '🌑',
    color: '#78716c',
    description: 'Не путай самозванцев, Романовых и регентов',
    unlockLessonCount: 14,
  },
  {
    id: 'empire_18',
    name: 'Империя XVIII века',
    subtitle: 'От Петра до Павла',
    yearRange: '1682–1801',
    rulerIds: ['peter1', 'ekaterina1', 'anna_ioannovna', 'elizaveta_petrovna', 'peter3', 'ekaterina2', 'pavel1'],
    icon: '⚓',
    color: '#0ea5e9',
    description: 'Ориентируйся в дворцовых переворотах и великих императорах',
    unlockLessonCount: 17,
  },
  {
    id: 'imperial_19',
    name: 'Императоры XIX века',
    subtitle: 'От реформ до контрреформ',
    yearRange: '1801–1917',
    rulerIds: ['alexander1', 'nicholas1', 'alexander2', 'alexander3', 'nicholas2'],
    icon: '🦅',
    color: '#6366f1',
    description: 'Не путай соседних императоров — ключ к ЕГЭ',
    unlockLessonCount: 20,
  },
  {
    id: 'leaders_20',
    name: 'Лидеры XX–XXI вв.',
    subtitle: 'От Ленина до наших дней',
    yearRange: '1917–наст. время',
    rulerIds: ['lenin', 'stalin', 'khrushchev', 'brezhnev', 'gorbachev', 'yeltsin', 'putin'],
    icon: '☭',
    color: '#dc2626',
    description: 'Лидеры советской и постсоветской эпохи',
    unlockLessonCount: 28,
  },
];

// Часто путаемые пары
export const confusedPairs: [string, string][] = [
  ['alexander1', 'nicholas1'], // оба нач. XIX в.
  ['alexander2', 'alexander3'], // оба Александр, соседи
  ['ivan3', 'ivan4'], // оба Иваны, великие правители
  ['peter1', 'ekaterina2'], // оба «Великие»
  ['khrushchev', 'brezhnev'], // соседи
  ['boris_godunov', 'false_dmitry1'], // Смута
  ['oleg', 'svyatoslav'], // ранние князья
  ['yaroslav', 'vladimir_monomah'], // князья Киевской Руси
];

// Получить rulers по cluster id
export const getRulersInCluster = (clusterId: string): Ruler[] => {
  const cluster = reignClusters.find(c => c.id === clusterId);
  if (!cluster) return [];
  return cluster.rulerIds.map(id => rulers[id]).filter(Boolean);
};

// Найти правителя по году
export const findRulerByYear = (year: number): Ruler | undefined => {
  return Object.values(rulers).find(r => year >= r.startYear && year <= r.endYear);
};

// Получить кластер по ruler id
export const getClusterByRulerId = (rulerId: string): ReignCluster | undefined => {
  return reignClusters.find(c => c.rulerIds.includes(rulerId));
};

// Соседние правители (predecessor / successor)
export const getAdjacentRulers = (rulerId: string): Ruler[] => {
  const ruler = rulers[rulerId];
  if (!ruler) return [];
  const result: Ruler[] = [];
  if (ruler.predecessor && rulers[ruler.predecessor]) result.push(rulers[ruler.predecessor]);
  if (ruler.successor && rulers[ruler.successor]) result.push(rulers[ruler.successor]);
  return result;
};
