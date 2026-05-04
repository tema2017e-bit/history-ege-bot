import { MapData, MapCategory } from '../types/mapTypes';

// ==================== КАТЕГОРИИ КАРТ ПО ЭПОХАМ ====================

export const mapCategories: MapCategory[] = [
  { id: 'ancient_rus', name: 'Древняя Русь', period: 'IX-XIII вв.', color: '#8B4513', icon: '🏰', mapIds: ['map_002', 'map_003', 'map_004', 'map_006'] },
  { id: 'mongol', name: 'Монгольское нашествие', period: 'XIII в.', color: '#800000', icon: '🏹', mapIds: ['map_005', 'map_006', 'map_007', 'map_008'] },
  { id: 'muscovy', name: 'Московское государство', period: 'XIV-XVI вв.', color: '#B22222', icon: '🕌', mapIds: ['map_009', 'map_010', 'map_011', 'map_012', 'map_013', 'map_014', 'map_015', 'map_016', 'map_017', 'map_018', 'map_019'] },
  { id: 'troubles', name: 'Смутное время и XVII век', period: 'XVII в.', color: '#D2691E', icon: '🗡️', mapIds: ['map_020', 'map_021', 'map_022', 'map_023', 'map_024'] },
  { id: 'petrine', name: 'Пётр I и Северная война', period: 'XVIII в.', color: '#1E90FF', icon: '⚓', mapIds: ['map_025', 'map_026', 'map_027', 'map_028'] },
  { id: 'palace_coup', name: 'Дворцовые перевороты', period: 'XVIII в.', color: '#9370DB', icon: '👑', mapIds: ['map_029', 'map_030'] },
  { id: 'catherine', name: 'Екатерина II', period: 'XVIII в.', color: '#FF69B4', icon: '👸', mapIds: ['map_031', 'map_032', 'map_033', 'map_034', 'map_035', 'map_036'] },
  { id: 'napoleon', name: 'Наполеоновские войны', period: 'XIX в.', color: '#006400', icon: '🗺️', mapIds: ['map_037', 'map_038', 'map_039', 'map_040'] },
  { id: '19century', name: 'XIX век (Николай I — Александр II)', period: 'XIX в.', color: '#4B0082', icon: '🎖️', mapIds: ['map_041', 'map_042', 'map_043', 'map_044', 'map_045', 'map_046', 'map_047'] },
  { id: 'early_20', name: 'Начало XX века — Революции', period: 'XX в.', color: '#DC143C', icon: '🔥', mapIds: ['map_001'] },
  { id: 'wwii', name: 'Великая Отечественная война', period: '1941-1945 гг.', color: '#2F4F4F', icon: '🎖️', mapIds: ['map_001'] },
];

// ==================== ДАННЫЕ КАРТ ====================

export const mapData: MapData[] = [
  // ===== СТР. 1: Обложка / Титульный лист =====
  {
    id: 'map_001',
    pageNumber: 1,
    title: 'Все карты ЕГЭ по истории',
    description: 'Сборник карт для подготовки к ЕГЭ по истории России',
    era: 'all',
    period: 'IX-XX вв.',
    imagePath: '/maps/map_001.png',
    relatedCardIds: [],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Титульная страница сборника карт ЕГЭ по истории'],
  },

  // ===== СТР. 2: Походы первых киевских князей =====
  {
    id: 'map_002',
    pageNumber: 2,
    title: 'Походы первых киевских князей',
    description: 'Карта походов Олега, Игоря, Святослава. Путь "из варяг в греки".',
    era: 'kievan_rus',
    period: 'IX-XIII вв.',
    imagePath: '/maps/map_002.png',
    relatedCardIds: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Новгород (оз. Ильмень)', coords: [15, 10, 22, 18] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Смоленск (на Днепре)', coords: [28, 28, 35, 34] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Константинополь (Царьград)', coords: [48, 75, 58, 82] },
      { id: 'z_a', type: 'letter', label: 'А', meaning: 'Вятичи (на Оке)', coords: [40, 35, 48, 43] },
      { id: 'z_b', type: 'letter', label: 'Б', meaning: 'Волжская Булгария (Булгар)', coords: [55, 18, 65, 28] },
      { id: 'z_c', type: 'letter', label: 'В', meaning: 'Хазарский каганат (Итиль)', coords: [65, 40, 75, 50] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Укажите название водного пути, соединявшего Скандинавию с Византией', correctAnswer: 'Путь "из варяг в греки"', explanation: 'Этот путь проходил по рекам и озёрам от Балтийского моря до Чёрного. На карте он обозначен через Новгород → Смоленск → Киев → Константинополь.' },
      { type: 'map-digit-meaning', prompt: 'Что на карте обозначено цифрой 1?', correctZoneId: 'z_1', correctAnswer: 'Новгород (оз. Ильмень)', explanation: 'Новгород — крупнейший торговый и политический центр Древней Руси, расположен у озера Ильмень.' },
      { type: 'map-letter-meaning', prompt: 'Какое племя/государство обозначено буквой В?', correctZoneId: 'z_c', options: ['Вятичи', 'Хазарский каганат', 'Волжская Булгария', 'Половцы'], correctAnswer: 'Хазарский каганат (Итиль)', explanation: 'Хазарский каганат — государство в нижнем течении Волги и Дона. Его столица Итиль находилась в дельте Волги.' },
    ],
    recognitionHints: ['Ищите путь из варяг в греки через Днепр', 'Три основных центра: Новгород, Киев, Константинополь'],
  },

  // ===== СТР. 3: Походы Святослава =====
  {
    id: 'map_003',
    pageNumber: 3,
    title: 'Походы Святослава Игоревича (X в.)',
    description: 'Военные походы князя Святослава на вятичей, хазар, дунайских болгар и Византию.',
    era: 'kievan_rus',
    period: 'IX-XIII вв.',
    imagePath: '/maps/map_003.png',
    relatedCardIds: ['c6', 'c7'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Киев (на Днепре)', coords: [35, 45, 45, 55] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Константинополь', coords: [55, 80, 65, 88] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Переяславец на Дунае', coords: [55, 65, 65, 75] },
      { id: 'z_4', type: 'number', label: '4', meaning: 'Новгород', coords: [20, 10, 30, 20] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Укажите название походов, изображённых на карте', options: ['Походы Олега', 'Походы Святослава', 'Походы Игоря', 'Походы Владимира'], correctAnswer: 'Походы Святослава', explanation: 'На карте изображены походы Святослава Игоревича (964-972 гг.).' },
      { type: 'map-digit-meaning', prompt: 'Какой город обозначен цифрой 3 и почему он важен?', correctZoneId: 'z_3', options: ['Киев', 'Переяславец на Дунае', 'Константинополь', 'Новгород'], correctAnswer: 'Переяславец на Дунае', explanation: 'Святослав говорил: "Не любо мне сидеть в Киеве, хочу жить в Переяславце на Дунае".' },
    ],
    recognitionHints: ['Ищите три похода: на вятичей, Хазарию и Болгарию', 'Переяславец на Дунае — ключевая точка'],
  },

  // ===== СТР. 4: Политическая раздробленность XII век =====
  {
    id: 'map_004',
    pageNumber: 4,
    title: 'Политическая раздробленность на Руси (XII век)',
    description: 'Карта русских княжеств в период раздробленности. Поход Игоря против половцев.',
    era: 'feudal_frag',
    period: 'IX-XIII вв.',
    imagePath: '/maps/map_004.png',
    relatedCardIds: ['c12', 'c13', 'c14', 'c15'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Новгород (озеро Ильмень)', coords: [20, 5, 30, 15] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Киев (на Днепре)', coords: [40, 45, 50, 55] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Владимир (на Клязьме)', coords: [45, 22, 55, 32] },
      { id: 'z_4', type: 'number', label: '4', meaning: 'Набеги половцев', coords: [60, 50, 75, 65] },
      { id: 'z_5', type: 'number', label: '5', meaning: 'Поход Игоря против половцев (1185 г.)', coords: [50, 38, 62, 48] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Какой период истории Руси изображён на карте?', options: ['Древнерусское государство', 'Период политической раздробленности', 'Монгольское нашествие', 'Объединение русских земель'], correctAnswer: 'Период политической раздробленности (XII-XIII вв.)', explanation: 'На карте показаны отдельные княжества.' },
      { type: 'map-digit-meaning', prompt: 'Какое княжество обозначено цифрой 3?', correctZoneId: 'z_3', options: ['Киевское', 'Новгородское', 'Владимиро-Суздальское', 'Черниговское'], correctAnswer: 'Владимиро-Суздальское', explanation: 'Владимир-на-Клязьме — столица Владимиро-Суздальского княжества.' },
    ],
    recognitionHints: ['Множество мелких княжеств с границами', 'Поход Игоря (1185) — ключевая деталь'],
  },

  // ===== СТР. 5: Поход Батыя на Северо-Восточную Русь =====
  {
    id: 'map_005',
    pageNumber: 5,
    title: 'Поход Батыя на Северо-Восточную Русь (1237-1238 гг.)',
    description: 'Монгольское нашествие на Рязань, Владимир и другие города Северо-Восточной Руси.',
    era: 'mongol_invasion',
    period: 'IX-XIII вв.',
    imagePath: '/maps/map_005.png',
    relatedCardIds: ['c16', 'c17', 'c18'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Владимир (на Клязьме)', coords: [40, 30, 50, 40] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Новгород', coords: [25, 5, 35, 15] },
      { id: 'z_4', type: 'number', label: '4', meaning: 'Рязань (разорена в декабре 1237)', coords: [48, 48, 58, 58] },
      { id: 'z_5', type: 'number', label: '5', meaning: 'Козельск ("злой город", 7 недель обороны)', coords: [38, 25, 48, 35] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Укажите название похода, изображённого на карте', options: ['Поход Батыя на Северо-Восточную Русь', 'Куликовская битва', 'Нашествие Батыя на Южную Русь', 'Походы Святослава'], correctAnswer: 'Поход Батыя на Северо-Восточную Русь (1237-1238 гг.)', explanation: 'Зимой 1237-1238 гг. Батый разорил Рязань, Коломну, Москву, Владимир.' },
      { type: 'map-digit-meaning', prompt: 'Какой город назван "злым городом"?', correctZoneId: 'z_5', options: ['Рязань', 'Козельск', 'Владимир', 'Новгород'], correctAnswer: 'Козельск', explanation: 'Козельск оборонялся 7 недель. Батый назвал его "злым городом".' },
    ],
    recognitionHints: ['Стрелки вторжения с востока', 'Козельск = "злой город"', 'Новгород остался нетронутым'],
  },

  // ===== СТР. 6: Поход Батыя на Южную Русь =====
  {
    id: 'map_006',
    pageNumber: 6,
    title: 'Поход Батыя на Южную Русь (1240 г.)',
    description: 'Разорение Киева и Галицко-Волынского княжества монголами.',
    era: 'mongol_invasion',
    period: 'IX-XIII вв.',
    imagePath: '/maps/map_006.png',
    relatedCardIds: ['c16', 'c17', 'c18'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Киев (разорён в декабре 1240 г.)', coords: [45, 35, 55, 45] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Галич', coords: [35, 40, 45, 50] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Владимир-Волынский', coords: [30, 35, 40, 45] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Какой поход изображён на карте?', options: ['Поход на С-В Русь', 'Поход на Южную Русь', 'Куликовская битва', 'Походы Святослава'], correctAnswer: 'Поход Батыя на Южную Русь (1240 г.)', explanation: 'В 1240 г. Батый взял Киев, разрушил Галицко-Волынское княжество.' },
      { type: 'map-digit-meaning', prompt: 'Что обозначено цифрой 1?', correctZoneId: 'z_1', correctAnswer: 'Киев (разорён в декабре 1240 г.)', explanation: 'Киев пал 6 декабря 1240 г. после долгой осады.' },
    ],
    recognitionHints: ['Южное направление: Киев → Галицко-Волынская земля', 'Киев — главная цель похода'],
  },

  // ===== СТР. 7: Невская битва и Ледовое побоище =====
  {
    id: 'map_007',
    pageNumber: 7,
    title: 'Борьба Северо-Западной Руси с западной угрозой (XIII в.)',
    description: 'Невская битва (1240) и Ледовое побоище (1242). Действия Александра Невского.',
    era: 'mongol_invasion',
    period: 'IX-XIII вв.',
    imagePath: '/maps/map_007.png',
    relatedCardIds: ['c19', 'c20'],
    zones: [
      { id: 'z_a', type: 'letter', label: 'А', meaning: 'Невская битва 1240 г.', coords: [25, 15, 40, 30] },
      { id: 'z_b', type: 'letter', label: 'Б', meaning: 'Ледовое побоище — Чудское озеро 1242 г.', coords: [20, 35, 35, 50] },
      { id: 'z_1', type: 'number', label: '1', meaning: 'Действия Александра Невского', coords: [30, 20, 45, 40] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Псков', coords: [22, 42, 30, 50] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Дерпт (Юрьев)', coords: [25, 38, 35, 48] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Какие сражения XIII века изображены на карте?', options: ['Куликовская битва и стояние на Угре', 'Невская битва (1240) и Ледовое побоище (1242)', 'Битва на реке Воже', 'Грюнвальдская битва'], correctAnswer: 'Невская битва (1240) и Ледовое побоище (1242)', explanation: 'Александр Невский разбил шведов на Неве и немецких крестоносцев на Чудском озере.' },
      { type: 'map-letter-meaning', prompt: 'Что обозначено буквой А?', correctZoneId: 'z_a', options: ['Ледовое побоище', 'Невская битва', 'Грюнвальдская битва', 'Битва на Калке'], correctAnswer: 'Невская битва 1240 г.', explanation: 'Невская битва произошла 15 июля 1240 г. на реке Неве.' },
    ],
    recognitionHints: ['Ищите Чудское озеро и реку Неву', 'Два сражения: на западе и северо-западе', 'Датировки: 1240 и 1242'],
  },

  // ===== СТР. 8: Карта XIII в. (продолжение) =====
  {
    id: 'map_008',
    pageNumber: 8,
    title: 'Северо-Западная Русь (XIII в.)',
    description: 'Карта региона: Новгородская земля, Ливонский орден, шведские владения.',
    era: 'mongol_invasion',
    period: 'IX-XIII вв.',
    imagePath: '/maps/map_008.png',
    relatedCardIds: ['c19', 'c20'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Регион Прибалтики и Новгородской земли'],
  },

  // ===== СТР. 9: Куликовская битва =====
  {
    id: 'map_009',
    pageNumber: 9,
    title: 'Куликовская битва (8 сентября 1380 г.)',
    description: 'Схема Куликовской битвы. Расположение войск Дмитрия Донского и Мамая.',
    era: 'moscow_rise',
    period: 'XIV-XVI вв.',
    imagePath: '/maps/map_009.png',
    relatedCardIds: ['c25', 'c26'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Река Дон', coords: [30, 30, 50, 70] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Лагерь темника Мамая (Золотая Орда)', coords: [45, 5, 60, 20] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Укажите название сражения', options: ['Стояние на Угре', 'Куликовская битва', 'Битва на реке Воже', 'Грюнвальдская битва'], correctAnswer: 'Куликовская битва (8 сентября 1380 г.)', explanation: 'Куликовская битва — крупнейшее сражение между русскими войсками Дмитрия Донского и ордынским войском Мамая.' },
      { type: 'map-digit-meaning', prompt: 'Что обозначено цифрой 1?', correctZoneId: 'z_1', options: ['Река Угра', 'Река Дон', 'Река Непрядва', 'Река Волга'], correctAnswer: 'Река Дон', explanation: 'Дмитрий получил прозвище Донской за победу на Куликовом поле.' },
    ],
    recognitionHints: ['Дон и Непрядва — две реки', 'Поединок Пересвета и Челубея'],
  },

  // ===== СТР. 10: Московское княжество при Дмитрии Донском =====
  {
    id: 'map_010',
    pageNumber: 10,
    title: 'Московское княжество при Дмитрии Донском',
    description: 'Расширение Московского княжества во второй половине XIV века.',
    era: 'moscow_rise',
    period: 'XIV-XVI вв.',
    imagePath: '/maps/map_010.png',
    relatedCardIds: ['c25', 'c26', 'c27'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Москва как центр объединения русских земель', 'Границы княжества'],
  },

  // ===== СТР. 11: Битва на реке Воже =====
  {
    id: 'map_011',
    pageNumber: 11,
    title: 'Битва на реке Воже (1378 г.)',
    description: 'Первая крупная победа русских войск над Ордой. Предшественница Куликовской битвы.',
    era: 'moscow_rise',
    period: 'XIV-XVI вв.',
    imagePath: '/maps/map_011.png',
    relatedCardIds: ['c25'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Битва на реке Воже — первая победа над ордынцами', '1378 год'],
  },

  // ===== СТР. 12: Правление Ивана III =====
  {
    id: 'map_012',
    pageNumber: 12,
    title: 'Правление Ивана III (1462-1505 гг.)',
    description: 'Присоединение Новгорода и Твери. Стояние на Угре. Борьба с Литвой и Ордой.',
    era: 'ivan_III',
    period: 'XIV-XVI вв.',
    imagePath: '/maps/map_012.png',
    relatedCardIds: ['c30', 'c31', 'c32', 'c33'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Москва', coords: [45, 35, 55, 45] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Битва на реке Шелони (1471)', coords: [30, 20, 42, 32] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Река Угра — Стояние на Угре (1480)', coords: [48, 50, 60, 62] },
      { id: 'z_5', type: 'number', label: '5', meaning: 'Тверь (присоединена в 1485)', coords: [40, 30, 50, 38] },
      { id: 'z_a', type: 'letter', label: 'А', meaning: 'Поход Ивана III против хана Ахмата', coords: [45, 50, 55, 60] },
      { id: 'z_b', type: 'letter', label: 'Б', meaning: 'Действия хана Ахмата', coords: [50, 55, 65, 68] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Укажите название события, изображённого на карте', options: ['Правление Ивана III', 'Правление Василия III', 'Ливонская война', 'Опричнина'], correctAnswer: 'Правление Ивана III (1462-1505 гг.)', explanation: 'На карте показаны присоединение Новгорода и Твери, Стояние на Угре.' },
      { type: 'map-digit-meaning', prompt: 'Какая река обозначена цифрой 3?', correctZoneId: 'z_3', options: ['Волга', 'Угра', 'Дон', 'Ока'], correctAnswer: 'Река Угра — Стояние на Угре (1480 г.)', explanation: 'Стояние на Угре в 1480 г. привело к свержению ордынского ига.' },
    ],
    recognitionHints: ['Ищите Стояние на Угре', 'Новгород и Тверь присоединены к Москве'],
  },

  // ===== СТР. 13: Русское государство при Василии III =====
  {
    id: 'map_013',
    pageNumber: 13,
    title: 'Русское государство при Василии III (1505-1533)',
    description: 'Присоединение Пскова, Смоленска, Рязани. Завершение объединения русских земель.',
    era: 'ivan_III',
    period: 'XIV-XVI вв.',
    imagePath: '/maps/map_013.png',
    relatedCardIds: ['c34'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Присоединение Пскова (1510), Смоленска (1514), Рязани (1521)'],
  },

  // ===== СТР. 14: Поход на Казань (Иван Грозный) =====
  {
    id: 'map_014',
    pageNumber: 14,
    title: 'Поход на Казань (1552 г.)',
    description: 'Поход Ивана IV Грозного на Казанское ханство. Присоединение Казани.',
    era: 'ivan_IV',
    period: 'XIV-XVI вв.',
    imagePath: '/maps/map_014.png',
    relatedCardIds: ['c40', 'c42'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Казань (1552 г.)', coords: [55, 30, 68, 42] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Мари (марийцы)', coords: [50, 25, 60, 35] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Мордва', coords: [40, 40, 52, 52] },
      { id: 'z_4', type: 'number', label: '4', meaning: 'Ногайцы (Ногайская Орда)', coords: [65, 45, 78, 58] },
      { id: 'z_5', type: 'number', label: '5', meaning: 'Чуваши', coords: [45, 30, 55, 40] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Укажите название похода, изображённого на карте', options: ['Поход на Астрахань (1556)', 'Поход на Казань (1552)', 'Поход Ермака в Сибирь', 'Ливонская война'], correctAnswer: 'Поход на Казань (1552 г.)', explanation: 'В 1552 году Иван Грозный взял Казань штурмом.' },
      { type: 'map-digit-meaning', prompt: 'Какой город обозначен цифрой 1?', correctZoneId: 'z_1', options: ['Астрахань', 'Казань', 'Сибирь', 'Крым'], correctAnswer: 'Казань (1552 г.)', explanation: 'Осада Казани длилась около месяца, затем город был взят штурмом.' },
    ],
    recognitionHints: ['Казань в центре карты', 'Народы Поволжья', '1552 год'],
  },

  // ===== СТР. 15: Присоединение Астрахани =====
  {
    id: 'map_015',
    pageNumber: 15,
    title: 'Присоединение Астраханского ханства (1556 г.)',
    description: 'Поход на Астрахань и присоединение Нижнего Поволжья к России.',
    era: 'ivan_IV',
    period: 'XIV-XVI вв.',
    imagePath: '/maps/map_015.png',
    relatedCardIds: ['c42'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Астрахань в устье Волги', '1556 год'],
  },

  // ===== СТР. 16: Освоение Сибири =====
  {
    id: 'map_016',
    pageNumber: 16,
    title: 'Поход Ермака и освоение Сибири',
    description: 'Поход Ермака Тимофеевича в Сибирское ханство (1581-1585).',
    era: 'ivan_IV',
    period: 'XIV-XVI вв.',
    imagePath: '/maps/map_016.png',
    relatedCardIds: ['c45'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Поход Ермака за Урал', 'Сибирское ханство', 'Кучум'],
  },

  // ===== СТР. 17: Карта XVI века =====
  {
    id: 'map_017',
    pageNumber: 17,
    title: 'Россия в конце XVI века',
    description: 'Территория России после царствования Ивана Грозного.',
    era: 'ivan_IV',
    period: 'XIV-XVI вв.',
    imagePath: '/maps/map_017.png',
    relatedCardIds: ['c45', 'c46'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Границы России к концу XVI века'],
  },

  // ===== СТР. 18: Ливонская война =====
  {
    id: 'map_018',
    pageNumber: 18,
    title: 'Ливонская война (1558-1583 гг.)',
    description: 'Война Ивана Грозного за выход к Балтийскому морю. Походы Стефана Батория.',
    era: 'ivan_IV',
    period: 'XIV-XVI вв.',
    imagePath: '/maps/map_018.png',
    relatedCardIds: ['c43', 'c44'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Псков (оборона 1581-1582)', coords: [35, 35, 45, 45] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Рига', coords: [40, 20, 50, 30] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Ям-Запольский (перемирие, 1582)', coords: [30, 40, 40, 50] },
      { id: 'z_4', type: 'number', label: '4', meaning: 'Походы Стефана Батория', coords: [40, 30, 55, 50] },
      { id: 'z_6', type: 'number', label: '6', meaning: 'Плюсское перемирие со Швецией (1583)', coords: [25, 15, 35, 28] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Укажите название войны', options: ['Северная война', 'Ливонская война', 'Семилетняя война', 'Русско-турецкая'], correctAnswer: 'Ливонская война (1558-1583 гг.)', explanation: 'Иван Грозный воевал за выход к Балтийскому морю. Война закончилась поражением России.' },
      { type: 'map-digit-meaning', prompt: 'Какой город оборонялся в 1581-1582 (цифра 1)?', correctZoneId: 'z_1', options: ['Новгород', 'Псков', 'Смоленск', 'Рига'], correctAnswer: 'Псков', explanation: 'Оборона Пскова от войск Стефана Батория длилась 5 месяцев.' },
    ],
    recognitionHints: ['Прибалтика — основная зона боевых действий', 'Псков — ключевой город обороны'],
  },

  // ===== СТР. 19: Россия при Фёдоре Иоанновиче и Борисе Годунове =====
  {
    id: 'map_019',
    pageNumber: 19,
    title: 'Россия на рубеже XVI-XVII вв.',
    description: 'Россия при Фёдоре Иоанновиче и Борисе Годунове. Учреждение патриаршества.',
    era: 'ivan_IV',
    period: 'XIV-XVI вв.',
    imagePath: '/maps/map_019.png',
    relatedCardIds: ['c48', 'c49'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Конец династии Рюриковичей', 'Избрание Бориса Годунова'],
  },

  // ===== СТР. 20: Смутное время =====
  {
    id: 'map_020',
    pageNumber: 20,
    title: 'Смутное время (начало XVII в.)',
    description: 'Поход Лжедмитрия I, польская интервенция, I и II ополчения.',
    era: 'time_of_troubles',
    period: 'XVII-XVIII вв.',
    imagePath: '/maps/map_020.png',
    relatedCardIds: ['c52', 'c53', 'c54', 'c55', 'c56', 'c57', 'c58'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Действия польских войск', coords: [35, 30, 50, 55] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Поход Лжедмитрия I (1604-1605)', coords: [30, 25, 55, 45] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Второе ополчение (Минин и Пожарский)', coords: [40, 35, 65, 55] },
      { id: 'z_4', type: 'number', label: '4', meaning: 'Нижний Новгород (центр II ополчения)', coords: [50, 45, 60, 55] },
      { id: 'z_5', type: 'number', label: '5', meaning: 'Смоленск (оборона 1609-1611)', coords: [25, 25, 35, 38] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Какой период истории обозначен на карте?', options: ['Смутное время', 'Правление Ивана Грозного', 'Восстание Болотникова', 'Освободительная война на Украине'], correctAnswer: 'Смутное время', explanation: 'На карте изображены события Смуты: поход Лжедмитрия I, польская интервенция, I и II ополчения.' },
      { type: 'map-digit-meaning', prompt: 'Какой город обозначен цифрой 4?', correctZoneId: 'z_4', options: ['Москва', 'Нижний Новгород', 'Смоленск', 'Кострома'], correctAnswer: 'Нижний Новгород', explanation: 'Нижний Новгород — центр формирования Второго ополчения.' },
    ],
    recognitionHints: ['Карта похожа на профиль человека (примета)', 'Нижний Новгород — центр Второго ополчения'],
  },

  // ===== СТР. 21: Восстание Степана Разина =====
  {
    id: 'map_021',
    pageNumber: 21,
    title: 'Восстание Степана Разина (1670-1671 гг.)',
    description: 'Крестьянско-казацкое восстание под предводительством Степана Разина.',
    era: 'alexey_mikhailovich',
    period: 'XVII-XVIII вв.',
    imagePath: '/maps/map_021.png',
    relatedCardIds: ['c63', 'c64'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Астрахань', coords: [55, 70, 65, 82] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Симбирск (Разин потерпел поражение)', coords: [45, 38, 55, 48] },
      { id: 'z_4', type: 'number', label: '4', meaning: 'Волга', coords: [48, 30, 58, 80] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Назовите восстание', options: ['Восстание Болотникова', 'Восстание Разина', 'Восстание Пугачёва', 'Медный бунт'], correctAnswer: 'Восстание Степана Разина (1670-1671 гг.)', explanation: 'Восстание охватило Поволжье и Прикаспий.' },
      { type: 'map-digit-meaning', prompt: 'Где Разин потерпел поражение (цифра 3)?', correctZoneId: 'z_3', options: ['Астрахань', 'Симбирск', 'Царицын', 'Самара'], correctAnswer: 'Симбирск (ныне Ульяновск)', explanation: 'Под Симбирском в октябре 1670 г. Разин был ранен и потерпел поражение.' },
    ],
    recognitionHints: ['Основная река — Волга', 'Симбирск — решающее сражение'],
  },

  // ===== СТР. 22: Россия при первых Романовых =====
  {
    id: 'map_022',
    pageNumber: 22,
    title: 'Россия при первых Романовых (XVII век)',
    description: 'Территория России в XVII веке, освоение Сибири.',
    era: 'alexey_mikhailovich',
    period: 'XVII-XVIII вв.',
    imagePath: '/maps/map_022.png',
    relatedCardIds: ['c60', 'c61', 'c62', 'c65'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Границы России в XVII веке', 'Продвижение в Сибирь'],
  },

  // ===== СТР. 23: Освоение Сибири в XVII веке =====
  {
    id: 'map_023',
    pageNumber: 23,
    title: 'Освоение Сибири в XVII веке',
    description: 'Продвижение русских землепроходцев в Сибирь и на Дальний Восток.',
    era: 'alexey_mikhailovich',
    period: 'XVII-XVIII вв.',
    imagePath: '/maps/map_023.png',
    relatedCardIds: ['c65'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Походы в Сибирь', 'Мангазея, Енисейск, Иркутск'],
  },

  // ===== СТР. 24: Украина в XVII веке =====
  {
    id: 'map_024',
    pageNumber: 24,
    title: 'Освободительная война на Украине (1648-1654)',
    description: 'Восстание Богдана Хмельницкого, Переяславская рада.',
    era: 'alexey_mikhailovich',
    period: 'XVII-XVIII вв.',
    imagePath: '/maps/map_024.png',
    relatedCardIds: ['c66', 'c67'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Украина, Крым, Речь Посполитая', 'Переяславская рада 1654 г.'],
  },

  // ===== СТР. 25: Азовские походы Петра I =====
  {
    id: 'map_025',
    pageNumber: 25,
    title: 'Азовские походы Петра I (1695-1696 гг.)',
    description: 'Походы молодого Петра против турецкой крепости Азов. Создание первого флота в Воронеже.',
    era: 'peter_the_great',
    period: 'XVII-XVIII вв.',
    imagePath: '/maps/map_025.png',
    relatedCardIds: ['c68', 'c69'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Азов (взят в 1696)', coords: [55, 70, 65, 82] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Воронеж (построен первый флот)', coords: [40, 45, 50, 55] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Москва', coords: [35, 25, 45, 35] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Какие походы изображены на карте?', options: ['Прутский поход', 'Азовские походы', 'Персидский поход', 'Северная война'], correctAnswer: 'Азовские походы Петра I (1695-1696 гг.)', explanation: 'Первый поход (1695) неудачный, второй (1696) — успешный.' },
      { type: 'map-digit-meaning', prompt: 'Где построен первый русский флот (цифра 2)?', correctZoneId: 'z_2', options: ['Москва', 'Воронеж', 'Азов', 'Санкт-Петербург'], correctAnswer: 'Воронеж', explanation: 'В Воронеже за зиму 1695-1696 гг. построили флот.' },
    ],
    recognitionHints: ['Воронеж — строительство флота', 'Азов в устье Дона'],
  },

  // ===== СТР. 26: Северная война =====
  {
    id: 'map_026',
    pageNumber: 26,
    title: 'Северная война (1700-1721 гг.)',
    description: 'Война России со Швецией за выход к Балтийскому морю. Полтавская битва.',
    era: 'peter_the_great',
    period: 'XVII-XVIII вв.',
    imagePath: '/maps/map_026.png',
    relatedCardIds: ['c70', 'c71', 'c72', 'c73', 'c74'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Нарва (1700 — поражение, 1704 — взятие)', coords: [30, 18, 40, 28] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Санкт-Петербург (основан в 1703)', coords: [25, 12, 35, 22] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Полтава (1709 — Полтавская битва)', coords: [50, 45, 60, 55] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Укажите название войны', options: ['Ливонская война', 'Северная война', 'Семилетняя война', 'Русско-турецкая'], correctAnswer: 'Северная война (1700-1721 гг.)', explanation: 'Основные события: Нарва, основание Петербурга, Полтава, Ништадтский мир.' },
      { type: 'map-digit-meaning', prompt: 'Где произошла Полтавская битва (цифра 3)?', correctZoneId: 'z_3', correctAnswer: 'Полтава (1709 г.)', explanation: '27 июня 1709 г. Пётр I разбил армию Карла XII.' },
    ],
    recognitionHints: ['Санкт-Петербург — ключевой город', 'Полтава в центральной части карты'],
  },

  // ===== СТР. 27-28: Северная война (продолжение) =====
  {
    id: 'map_027',
    pageNumber: 27,
    title: 'Северная война (продолжение)',
    description: 'Боевые действия в Прибалтике, Финляндии и Померании.',
    era: 'peter_the_great',
    period: 'XVII-XVIII вв.',
    imagePath: '/maps/map_027.png',
    relatedCardIds: ['c70', 'c71', 'c72', 'c73', 'c74'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Прибалтика, Финляндия', 'Гангутское сражение (1714)'],
  },
  {
    id: 'map_028',
    pageNumber: 28,
    title: 'Северная война (завершение)',
    description: 'Боевые действия 1719-1721 гг. Ништадтский мир.',
    era: 'peter_the_great',
    period: 'XVII-XVIII вв.',
    imagePath: '/maps/map_028.png',
    relatedCardIds: ['c73', 'c74'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Ништадтский мир 1721 г.', 'Приобретения России в Прибалтике'],
  },

  // ===== СТР. 29-30: Эпоха дворцовых переворотов =====
  {
    id: 'map_029',
    pageNumber: 29,
    title: 'Россия в эпоху дворцовых переворотов',
    description: 'Территория России в 1725-1762 гг. Русско-шведская война 1741-1743.',
    era: 'palace_coups',
    period: 'XVII-XVIII вв.',
    imagePath: '/maps/map_029.png',
    relatedCardIds: ['c78', 'c79'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Эпоха дворцовых переворотов'],
  },
  {
    id: 'map_030',
    pageNumber: 30,
    title: 'Русско-шведская война (1741-1743)',
    description: 'Война России со Швецией при Елизавете Петровне. Абоский мир.',
    era: 'palace_coups',
    period: 'XVII-XVIII вв.',
    imagePath: '/maps/map_030.png',
    relatedCardIds: ['c79'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Финляндия, Прибалтика', 'Абоский мир 1743 г.'],
  },

  // ===== СТР. 31: Восстание Пугачёва =====
  {
    id: 'map_031',
    pageNumber: 31,
    title: 'Восстание Емельяна Пугачёва (1773-1775 гг.)',
    description: 'Крупнейшее крестьянское восстание в России.',
    era: 'catherine',
    period: 'XVII-XVIII вв.',
    imagePath: '/maps/map_031.png',
    relatedCardIds: ['c86'],
    zones: [
      { id: 'z_a', type: 'letter', label: 'А', meaning: 'Река Яик (переименована в Урал)', coords: [45, 40, 55, 70] },
      { id: 'z_1', type: 'number', label: '1', meaning: 'Царицын (ныне Волгоград)', coords: [48, 55, 55, 63] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Место поимки Пугачёва', coords: [45, 50, 52, 58] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Назовите восстание', options: ['Восстание Разина', 'Восстание Пугачёва', 'Восстание Болотникова', 'Восстание Булавина'], correctAnswer: 'Восстание Емельяна Пугачёва (1773-1775 гг.)', explanation: 'Крупнейшее восстание в истории России. Пугачёв выдавал себя за Петра III.' },
      { type: 'map-digit-meaning', prompt: 'Где был схвачен Пугачёв (цифра 2)?', correctZoneId: 'z_2', correctAnswer: 'В районе Царицына', explanation: 'После поражения Пугачёв был выдан казаками и схвачен.' },
    ],
    recognitionHints: ['Карта «похожа на облачко» (примета)', 'Волга и Яик (Урал)'],
  },

  // ===== СТР. 32-33: Русско-турецкие войны Екатерины II =====
  {
    id: 'map_032',
    pageNumber: 32,
    title: 'Русско-турецкая война (1787-1791)',
    description: 'Вторая война Екатерины II с Турцией. Взятие Очакова и Измаила.',
    era: 'catherine',
    period: 'XVII-XVIII вв.',
    imagePath: '/maps/map_032.png',
    relatedCardIds: ['c87', 'c88'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Очаков, Измаил — крепости', 'Суворов, Потёмкин'],
  },
  {
    id: 'map_033',
    pageNumber: 33,
    title: 'Разделы Речи Посполитой',
    description: 'Три раздела Польши (1772, 1793, 1795) при Екатерине II.',
    era: 'catherine',
    period: 'XVII-XVIII вв.',
    imagePath: '/maps/map_033.png',
    relatedCardIds: ['c89'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Разделы Польши 1772, 1793, 1795', 'Территории, отошедшие России'],
  },

  // ===== СТР. 34: Русско-турецкая 1768-1774 =====
  {
    id: 'map_034',
    pageNumber: 34,
    title: 'Русско-турецкая война (1768-1774 гг.)',
    description: 'Война Екатерины II с Турцией. Чесменское сражение, Кючук-Кайнарджийский мир.',
    era: 'catherine',
    period: 'XVII-XVIII вв.',
    imagePath: '/maps/map_034.png',
    relatedCardIds: ['c84', 'c85', 'c87'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Кючук-Кайнарджи (мирный договор)', coords: [55, 55, 65, 65] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Константинополь', coords: [55, 78, 65, 88] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Азов', coords: [48, 55, 55, 62] },
      { id: 'z_4', type: 'number', label: '4', meaning: 'Крымское ханство', coords: [52, 65, 62, 78] },
      { id: 'z_5', type: 'number', label: '5', meaning: 'Чесменское сражение (1770)', coords: [50, 82, 60, 92] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Назовите войну', options: ['Русско-турецкая 1768-1774', 'Русско-турецкая 1787-1791', 'Северная война', 'Крымская война'], correctAnswer: 'Русско-турецкая война (1768-1774 гг.)', explanation: '«Треугольная» карта. Россия получила выход к Чёрному морю.' },
      { type: 'map-digit-meaning', prompt: 'Какое сражение обозначено цифрой 5?', correctZoneId: 'z_5', options: ['Кагул', 'Чесменское сражение', 'Ларга', 'Синоп'], correctAnswer: 'Чесменское сражение (1770)', explanation: 'Русский флот (Орлов, Спиридов) уничтожил турецкую эскадру в Эгейском море.' },
    ],
    recognitionHints: ['«Треугольник между рек» — Крым ещё не наш', 'Чесменский бой в Эгейском море'],
  },

  // ===== СТР. 35-36: Итальянский и Швейцарский походы Суворова =====
  {
    id: 'map_035',
    pageNumber: 35,
    title: 'Итальянский поход Суворова (1799)',
    description: 'Действия русских войск в Северной Италии против французов.',
    era: 'catherine',
    period: 'XVII-XVIII вв.',
    imagePath: '/maps/map_035.png',
    relatedCardIds: ['c90'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Северная Италия', 'Суворов — командующий'],
  },
  {
    id: 'map_036',
    pageNumber: 36,
    title: 'Швейцарский поход Суворова (1799)',
    description: 'Переход Суворова через Альпы. Переход через Чёртов мост.',
    era: 'catherine',
    period: 'XVII-XVIII вв.',
    imagePath: '/maps/map_036.png',
    relatedCardIds: ['c90'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Переход через Альпы', 'Чёртов мост', 'Сен-Готард'],
  },

  // ===== СТР. 37: Отечественная война 1812 =====
  {
    id: 'map_037',
    pageNumber: 37,
    title: 'Отечественная война 1812 года',
    description: 'Нашествие Наполеона на Россию. Действия 1-й, 2-й и 3-й армий.',
    era: 'alexander1',
    period: 'XIX в.',
    imagePath: '/maps/map_037.png',
    relatedCardIds: ['c99', 'c100'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Смоленск (объединение армий)', coords: [30, 35, 40, 45] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Герцогство Варшавское', coords: [5, 30, 20, 55] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Бородино (26 августа 1812)', coords: [45, 30, 55, 40] },
      { id: 'z_4', type: 'number', label: '4', meaning: 'Тарутино (Тарутинский маневр)', coords: [45, 40, 55, 50] },
      { id: 'z_i', type: 'letter', label: 'I', meaning: '1-я армия (Барклай-де-Толли)', coords: [40, 25, 50, 35] },
      { id: 'z_ii', type: 'letter', label: 'II', meaning: '2-я армия (Багратион)', coords: [35, 30, 45, 40] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Назовите войну', options: ['Отечественная война 1812', 'Крымская война', 'Русско-турецкая', 'Первая мировая'], correctAnswer: 'Отечественная война 1812 г.', explanation: 'Основные события: отступление, объединение под Смоленском, Бородино, Тарутинский маневр.' },
      { type: 'map-digit-meaning', prompt: 'Какое сражение у цифры 3?', correctZoneId: 'z_3', correctAnswer: 'Бородинское сражение (26 августа 1812 г.)', explanation: 'Крупнейшее сражение войны.' },
    ],
    recognitionHints: ['Две стрелки: наступление Наполеона и отступление русских', 'Бородино — ключевая точка'],
  },

  // ===== СТР. 38-40: Заграничные походы =====
  {
    id: 'map_038',
    pageNumber: 38,
    title: 'Заграничные походы русской армии (1813-1814)',
    description: 'Битва народов под Лейпцигом, взятие Парижа.',
    era: 'alexander1',
    period: 'XIX в.',
    imagePath: '/maps/map_038.png',
    relatedCardIds: ['c101', 'c102'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Европа, Германия, Франция', 'Лейпциг, Париж'],
  },
  {
    id: 'map_039',
    pageNumber: 39,
    title: 'Европа после Венского конгресса (1815)',
    description: 'Новое территориальное устройство Европы после наполеоновских войн.',
    era: 'alexander1',
    period: 'XIX в.',
    imagePath: '/maps/map_039.png',
    relatedCardIds: ['c102'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Венский конгресс 1815', 'Священный союз'],
  },
  {
    id: 'map_040',
    pageNumber: 40,
    title: 'Кавказская война (1817-1864)',
    description: 'Присоединение Кавказа к России. Действия Ермолова и Шамиля.',
    era: 'alexander1',
    period: 'XIX в.',
    imagePath: '/maps/map_040.png',
    relatedCardIds: ['c104', 'c111'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Кавказский регион', 'Шамиль — имам Чечни и Дагестана'],
  },

  // ===== СТР. 41: Восстание декабристов =====
  {
    id: 'map_041',
    pageNumber: 41,
    title: 'Восстание декабристов на Сенатской площади (1825 г.)',
    description: 'Схема расположения войск на Сенатской площади в Санкт-Петербурге.',
    era: 'nicholas1',
    period: 'XIX в.',
    imagePath: '/maps/map_041.png',
    relatedCardIds: ['c104'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Сенатская площадь', coords: [30, 35, 60, 55] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Нева', coords: [20, 10, 60, 25] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Какое событие изображено?', options: ['Восстание декабристов', 'Февральская революция 1917', 'Кровавое воскресенье', 'Восстание Семёновского полка'], correctAnswer: 'Восстание декабристов (14 декабря 1825)', explanation: 'Сенатская площадь с Медным всадником. Восставшие построились в каре.' },
    ],
    recognitionHints: ['Медный всадник (Фальконе)', 'Сенатская площадь и Нева'],
  },

  // ===== СТР. 42: Россия при Николае I =====
  {
    id: 'map_042',
    pageNumber: 42,
    title: 'Россия при Николае I (1825-1855)',
    description: 'Территория России в первой половине XIX века.',
    era: 'nicholas1',
    period: 'XIX в.',
    imagePath: '/maps/map_042.png',
    relatedCardIds: [],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Границы Российской империи при Николае I'],
  },

  // ===== СТР. 43-44: Крымская война =====
  {
    id: 'map_043',
    pageNumber: 43,
    title: 'Крымская (Восточная) война (1853-1856 гг.)',
    description: 'Война России против коалиции: Турция, Англия, Франция, Сардиния.',
    era: 'nicholas1',
    period: 'XIX в.',
    imagePath: '/maps/map_043.png',
    relatedCardIds: ['c112'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Севастополь (оборона 1854-1855)', coords: [32, 40, 42, 50] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Синоп (Синопское сражение, 1853)', coords: [40, 52, 50, 62] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Константинополь', coords: [48, 68, 58, 78] },
      { id: 'z_4', type: 'number', label: '4', meaning: 'Карс (взят русскими)', coords: [52, 45, 62, 55] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Назовите войну', options: ['Крымская война (1853-1856)', 'Русско-турецкая 1877-1878', 'Русско-японская', 'Кавказская война'], correctAnswer: 'Крымская (Восточная) война (1853-1856 гг.)', explanation: 'Синоп, оборона Севастополя, Кавказский фронт.' },
      { type: 'map-digit-meaning', prompt: 'Какое сражение обозначено цифрой 2?', correctZoneId: 'z_2', options: ['Синопское сражение', 'Оборона Севастополя', 'Сражение на Альме', 'Балаклавское сражение'], correctAnswer: 'Синопское сражение (1853) — адмирал Нахимов', explanation: 'Последнее крупное сражение парусного флота.' },
    ],
    recognitionHints: ['Крым — центр боевых действий', 'Севастополь — 349 дней обороны'],
  },
  {
    id: 'map_044',
    pageNumber: 44,
    title: 'Оборона Севастополя (1854-1855)',
    description: 'Детальная схема обороны Севастополя. Малахов курган.',
    era: 'nicholas1',
    period: 'XIX в.',
    imagePath: '/maps/map_044.png',
    relatedCardIds: ['c112'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Малахов курган', '349 дней обороны', 'Корнилов, Нахимов, Истомин'],
  },

  // ===== СТР. 45: Русско-турецкая 1877-1878 =====
  {
    id: 'map_045',
    pageNumber: 45,
    title: 'Русско-турецкая война (1877-1878 гг.)',
    description: 'Война за освобождение балканских славян от османского ига.',
    era: 'reforms',
    period: 'XIX в.',
    imagePath: '/maps/map_045.png',
    relatedCardIds: ['c119', 'c120'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Константинополь', coords: [55, 78, 65, 88] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Плевна (осада — Скобелев)', coords: [48, 55, 58, 65] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Дунай (переправа русских войск)', coords: [40, 40, 60, 55] },
      { id: 'z_i', type: 'letter', label: 'I', meaning: 'Сербия', coords: [30, 45, 40, 55] },
      { id: 'z_ii', type: 'letter', label: 'II', meaning: 'Румыния', coords: [30, 35, 45, 48] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Назовите войну', options: ['Крымская война', 'Русско-турецкая 1877-1878', 'Русско-японская', 'Первая мировая'], correctAnswer: 'Русско-турецкая война (1877-1878 гг.)', explanation: 'Переправа через Дунай, осада Плевны, Сан-Стефанский мир.' },
      { type: 'map-digit-meaning', prompt: 'Где была осада (цифра 2)?', correctZoneId: 'z_2', options: ['Шипка', 'Плевна', 'Сан-Стефано', 'Адрианополь'], correctAnswer: 'Плевна (осада под руководством Скобелева)', explanation: 'Осада Плевны длилась с июля по декабрь 1877 г.' },
    ],
    recognitionHints: ['Балканский полуостров', 'Переправа через Дунай', 'Плевна и Шипка'],
  },

  // ===== СТР. 46: Россия при Александре II =====
  {
    id: 'map_046',
    pageNumber: 46,
    title: 'Россия при Александре II (1855-1881)',
    description: 'Территория России после присоединения Кавказа, Средней Азии и Дальнего Востока.',
    era: 'reforms',
    period: 'XIX в.',
    imagePath: '/maps/map_046.png',
    relatedCardIds: ['c113', 'c114', 'c115'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Присоединение Средней Азии', 'Присоединение Дальнего Востока', 'Продажа Аляски'],
  },

  // ===== СТР. 47: Россия при Александре III =====
  {
    id: 'map_047',
    pageNumber: 47,
    title: 'Россия при Александре III (1881-1894)',
    description: 'Российская империя в конце XIX века.',
    era: 'reforms',
    period: 'XIX в.',
    imagePath: '/maps/map_047.png',
    relatedCardIds: ['c121', 'c122', 'c123'],
    zones: [],
    typicalQuestions: [],
    recognitionHints: ['Границы Российской империи к концу XIX века'],
  },

  // ===== КАРТЫ ИЗ СТАРОГО МАППИНГА (страницы из PDF за пределами 47) =====
  // Следующие карты ссылались на страницы 49+ PDF — оставляем как есть, 
  // т.к. они были созданы по другому источнику, но используем ближайшие PNG

  // ===== СТР. 49: Русско-японская война =====
  {
    id: 'map_049',
    pageNumber: 49,
    title: 'Русско-японская война (1904-1905 гг.)',
    description: 'Война России и Японии за господство на Дальнем Востоке.',
    era: 'counterreforms',
    period: 'XX в.',
    imagePath: '/maps/map_049.png',
    relatedCardIds: ['c128'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Порт-Артур (оборона)', coords: [55, 55, 68, 68] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Цусимское сражение', coords: [60, 70, 75, 82] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Владивосток', coords: [65, 30, 78, 42] },
      { id: 'z_4', type: 'number', label: '4', meaning: 'Место гибели "Варяга" (Чемульпо)', coords: [45, 55, 55, 65] },
      { id: 'z_6', type: 'number', label: '6', meaning: 'Мукденское сражение', coords: [45, 48, 58, 58] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Какая война изображена на карте?', options: ['Русско-японская (1904-1905)', 'Первая мировая', 'Советско-японская 1945', 'Отечественная война 1812'], correctAnswer: 'Русско-японская война (1904-1905 гг.)', explanation: 'Оборона Порт-Артура, Мукден, Цусима.' },
      { type: 'map-digit-meaning', prompt: 'Где произошло Цусимское сражение (цифра 2)?', correctZoneId: 'z_2', options: ['Порт-Артур', 'Мукден', 'Цусимский пролив', 'Чемульпо'], correctAnswer: 'Цусимское сражение', explanation: '2-я Тихоокеанская эскадра Рожественского была разгромлена.' },
    ],
    recognitionHints: ['Дальний Восток', 'Порт-Артур — крепость', 'Цусима — морской бой'],
  },

  // ===== СТР. 51: Первая мировая =====
  {
    id: 'map_051',
    pageNumber: 51,
    title: 'Первая мировая война (1914-1918). Восточный фронт',
    description: 'Восточно-Прусская операция, Брусиловский прорыв, Великое отступление 1915 г.',
    era: 'revolution',
    period: 'XX в.',
    imagePath: '/maps/map_051.png',
    relatedCardIds: ['c135', 'c136'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Варшава', coords: [30, 35, 40, 45] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Петроград', coords: [25, 8, 35, 18] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Севастополь', coords: [40, 65, 50, 75] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Какая война изображена на карте?', options: ['Русско-японская', 'Первая мировая (1914-1918)', 'Гражданская война', 'Великая Отечественная война'], correctAnswer: 'Первая мировая война (1914-1918)', explanation: 'Восточный фронт от Балтийского до Чёрного моря.' },
    ],
    recognitionHints: ['Линия фронта от Балтики до Чёрного моря', 'Варшава — выступ на западе'],
  },

  // ===== СТР. 53: Гражданская война =====
  {
    id: 'map_053',
    pageNumber: 53,
    title: 'Гражданская война (1919 г.)',
    description: 'Основные фронты: наступление Колчака и Деникина.',
    era: 'revolution',
    period: 'XX в.',
    imagePath: '/maps/map_053.png',
    relatedCardIds: ['c141'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Действия Колчака (с востока)', coords: [55, 20, 70, 45] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Весна 1919 — Колчак наступает', coords: [50, 25, 65, 40] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Осень 1919 — Деникин наступает с юга', coords: [40, 50, 55, 65] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Какой период изображён?', options: ['Первая мировая', 'Гражданская война (1919)', 'Великая Отечественная', 'Советско-польская'], correctAnswer: 'Гражданская война (1919 г.)', explanation: 'Колчак весной с востока, Деникин осенью с юга.' },
      { type: 'map-digit-meaning', prompt: 'Кто наступал с востока весной 1919 (цифра 2)?', correctZoneId: 'z_2', options: ['Деникин', 'Колчак', 'Юденич', 'Врангель'], correctAnswer: 'А.В. Колчак', explanation: 'Весной 1919 г. армия Колчака наступала с востока.' },
    ],
    recognitionHints: ['Москва — центр', 'Колчак с востока, Деникин с юга'],
  },

  // ===== СТР. 60: ВОВ — начальный период =====
  {
    id: 'map_060',
    pageNumber: 60,
    title: 'Начальный период Великой Отечественной войны (1941 г.)',
    description: 'План «Барбаросса». Первый месяц войны.',
    era: 'wwii',
    period: 'XX в.',
    imagePath: '/maps/map_060.png',
    relatedCardIds: ['c157', 'c158', 'c159'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Брест (крепость оборонялась около месяца)', coords: [28, 35, 38, 45] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Ленинград (блокада с осени 1941)', coords: [25, 10, 35, 22] },
      { id: 'z_4', type: 'number', label: '4', meaning: 'Севастополь (250 дней обороны)', coords: [40, 70, 50, 82] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Какой период войны изображён?', options: ['Коренной перелом', 'Начальный период ВОВ (1941)', 'Заключительный этап', 'Война с Японией'], correctAnswer: 'Начальный период Великой Отечественной войны (1941 г.)', explanation: 'План «Барбаросса» — нападение Германии на СССР.' },
      { type: 'map-digit-meaning', prompt: 'Какая крепость оборонялась около месяца (цифра 1)?', correctZoneId: 'z_1', correctAnswer: 'Брестская крепость', explanation: 'Брестская крепость приняла первый удар 22 июня 1941 г.' },
    ],
    recognitionHints: ['Три стрелки: на Ленинград, Москву, Киев', 'Брест — первый удар'],
  },

  // ===== СТР. 63: Коренной перелом =====
  {
    id: 'map_063',
    pageNumber: 63,
    title: 'Коренной перелом (ноябрь 1942 — декабрь 1943)',
    description: 'Сталинградская битва, Курская битва, битва за Днепр.',
    era: 'wwii',
    period: 'XX в.',
    imagePath: '/maps/map_063.png',
    relatedCardIds: ['c160', 'c162', 'c163', 'c164'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Ленинград (прорыв блокады — «Искра», январь 1943)', coords: [25, 8, 35, 20] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Белгород (освобождён в августе 1943)', coords: [40, 35, 48, 45] },
      { id: 'z_3', type: 'number', label: '3', meaning: 'Киев (освобождён в ноябре 1943)', coords: [38, 40, 48, 50] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Какой период войны изображён?', options: ['Начальный период', 'Коренной перелом (1942-1943)', 'Заключительный этап', 'Война с Японией'], correctAnswer: 'Коренной перелом (ноябрь 1942 — декабрь 1943)', explanation: 'Линии фронта: ноябрь 1942, март 1943, декабрь 1943.' },
      { type: 'map-digit-meaning', prompt: 'Какой город освобождён в ноябре 1943 (цифра 3)?', correctZoneId: 'z_3', correctAnswer: 'Киев (освобождён в ноябре 1943)', explanation: 'Киев освобождён 6-7 ноября 1943.' },
    ],
    recognitionHints: ['Три линии фронта', 'Сталинград, Курская дуга, Днепр'],
  },

  // ===== СТР. 65: Курская битва =====
  {
    id: 'map_065',
    pageNumber: 65,
    title: 'Курская битва (лето 1943 г.)',
    description: 'Крупнейшее танковое сражение. Операции «Кутузов» и «Румянцев».',
    era: 'wwii',
    period: 'XX в.',
    imagePath: '/maps/map_065.png',
    relatedCardIds: ['c162', 'c163'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Орёл (освобождён — «Кутузов»)', coords: [35, 25, 45, 35] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Курск', coords: [40, 35, 50, 45] },
      { id: 'z_4', type: 'number', label: '4', meaning: 'Белгород (освобождён — «Румянцев»)', coords: [42, 42, 50, 50] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Укажите название битвы', options: ['Сталинградская', 'Курская битва (лето 1943)', 'Битва за Москву', 'Битва за Днепр'], correctAnswer: 'Курская битва (лето 1943 г.)', explanation: '5 июля — начало операции «Цитадель». 12 июля — Прохоровка.' },
      { type: 'map-digit-meaning', prompt: 'Какой город освобождён операцией «Кутузов» (цифра 1)?', correctZoneId: 'z_1', correctAnswer: 'Орёл (август 1943)', explanation: 'Первый салют в честь освобождения Орла и Белгорода.' },
    ],
    recognitionHints: ['Курская дуга — выступ', 'Орёл и Белгород — города салюта'],
  },

  // ===== СТР. 66: Сталинградская битва =====
  {
    id: 'map_066',
    pageNumber: 66,
    title: 'Сталинградская битва. Операция «Уран»',
    description: 'Окружение 6-й армии Паулюса под Сталинградом в ноябре 1942.',
    era: 'wwii',
    period: 'XX в.',
    imagePath: '/maps/map_066.png',
    relatedCardIds: ['c160', 'c161'],
    zones: [
      { id: 'z_1', type: 'number', label: '1', meaning: 'Сталинград (ныне Волгоград)', coords: [45, 50, 58, 62] },
      { id: 'z_2', type: 'number', label: '2', meaning: 'Калач (соединение фронтов)', coords: [48, 45, 58, 55] },
    ],
    typicalQuestions: [
      { type: 'map-name', prompt: 'Укажите сражение', options: ['Курская битва', 'Сталинградская битва (контрнаступление)', 'Битва за Кавказ', 'Смоленское сражение'], correctAnswer: 'Сталинградская битва. Операция «Уран»', explanation: '19 ноября 1942 — начало контрнаступления. 23 ноября — окружение.' },
      { type: 'map-digit-meaning', prompt: 'Где соединились фронты (цифра 2)?', correctZoneId: 'z_2', correctAnswer: 'Калач', explanation: '23 ноября 1942 г. в районе Калача соединились Юго-Западный и Сталинградский фронты.' },
    ],
    recognitionHints: ['Сталинград на Волге', 'Калач — место окружения'],
  },
];

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

/** Получить карты по эпохе */
export function getMapsByEra(era: string): MapData[] {
  return mapData.filter(m => m.era === era);
}

/** Получить карты по категории */
export function getMapsByCategory(categoryId: string): MapData[] {
  const category = mapCategories.find(c => c.id === categoryId);
  if (!category) return [];
  return category.mapIds.map(id => mapData.find(m => m.id === id)).filter(Boolean) as MapData[];
}

/** Получить карту по ID */
export function getMapById(id: string): MapData | undefined {
  return mapData.find(m => m.id === id);
}

/** Получить случайную карту из указанных эпох */
export function getRandomMap(eraIds: string[]): MapData | undefined {
  const available = mapData.filter(m => eraIds.includes(m.era));
  if (available.length === 0) return undefined;
  return available[Math.floor(Math.random() * available.length)];
}