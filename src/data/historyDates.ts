import { HistoryCard, Era, Lesson } from '../types';

// ==================== ИСТОРИЧЕСКИЕ КАРТОЧКИ ====================

export const historyCards: HistoryCard[] = [
  // ===== ЭПОХА 1: ДРЕВНЯЯ РУСЬ (IX-X вв.) =====
  { id: 'c1', year: '860', event: 'Поход русов на Константинополь', period: 'IX век', era: 'ancient', difficulty: 'medium', tags: ['внешняя политика', 'Византия'] },
  { id: 'c2', year: '862', event: 'Призвание варягов', period: 'IX век', era: 'ancient', ruler: 'Рюрик', difficulty: 'easy', tags: ['правители'] },
  { id: 'c3', year: '882', event: 'Объединение Киева и Новгорода под властью Олега', period: 'IX век', era: 'ancient', ruler: 'Олег', difficulty: 'easy', tags: ['правители', 'объединение'] },
  { id: 'c4', year: '907', event: 'Поход Олега на Константинополь', period: 'X век', era: 'ancient', ruler: 'Олег', difficulty: 'medium', tags: ['внешняя политика', 'Византия'] },
  { id: 'c5', year: '945', event: 'Восстание древлян', period: 'X век', era: 'ancient', ruler: 'Игорь', difficulty: 'medium', tags: ['восстания'] },
  { id: 'c6', year: '957', event: 'Крещение княгини Ольги', period: 'X век', era: 'ancient', ruler: 'Ольга', difficulty: 'easy', tags: ['религия'] },
  { id: 'c7', year: '980', event: 'Языческая реформа князя Владимира', period: 'X век', era: 'ancient', ruler: 'Владимир', difficulty: 'medium', tags: ['религия', 'реформы'] },
  { id: 'c8', year: '988', event: 'Крещение Руси', period: 'X век', era: 'ancient', ruler: 'Владимир', difficulty: 'easy', tags: ['религия', 'ключевая дата'] },
  { id: 'c9', year: '996', event: 'Строительство Десятинной церкви в Киеве', period: 'X век', era: 'ancient', ruler: 'Владимир', difficulty: 'hard', tags: ['культура', 'религия'] },
  { id: 'c10', year: '1016', event: 'Составление Русской Правды Ярославом Мудрым', period: 'XI век', era: 'ancient', ruler: 'Ярослав Мудрый', difficulty: 'medium', tags: ['законы'] },
  { id: 'c11', year: '1037', event: 'Строительство храма Святой Софии в Киеве', period: 'XI век', era: 'ancient', ruler: 'Ярослав Мудрый', difficulty: 'medium', tags: ['культура', 'архитектура'] },

  // ===== ЭПОХА 2: РАЗДРОБЛЕННОСТЬ (XI-XII вв.) =====
  { id: 'c12', year: '1054', event: 'Последнее столкновение с печенегами. Осада Киева', period: 'XI век', era: 'ancient', difficulty: 'medium', tags: ['войны'] },
  { id: 'c13', year: '1097', event: 'Любечский съезд князей', period: 'XII век', era: 'ancient', difficulty: 'medium', tags: ['политика'] },
  { id: 'c14', year: '1113', event: 'Восстание в Киеве против ростовщиков', period: 'XII век', era: 'ancient', difficulty: 'hard', tags: ['восстания'] },
  { id: 'c15', year: '1132', event: 'Смерть Мстислава Великого. Начало раздробленности', period: 'XII век', era: 'fragmentation', difficulty: 'easy', tags: ['ключевая дата', 'политика'] },
  { id: 'c16', year: '1147', event: 'Первое летописное упоминание Москвы', period: 'XII век', era: 'fragmentation', difficulty: 'easy', tags: ['ключевая дата', 'Москва'] },
  { id: 'c17', year: '1165', event: 'Строительство храма Покрова на Нерли', period: 'XII век', era: 'fragmentation', ruler: 'Андрей Боголюбский', difficulty: 'medium', tags: ['культура', 'архитектура'] },
  { id: 'c18', year: '1185', event: 'Поход князя Игоря на половцев. "Слово о полку Игореве"', period: 'XII век', era: 'fragmentation', difficulty: 'medium', tags: ['войны', 'культура'] },

  // ===== ЭПОХА 3: МОНГОЛЬСКОЕ НАШЕСТВИЕ (XIII в.) =====
  { id: 'c19', year: '1223', event: 'Битва на реке Калке', period: 'XIII век', era: 'invasion', difficulty: 'easy', tags: ['войны', 'монголы'] },
  { id: 'c20', year: '1237-1238', event: 'Походы Батыя на Северо-Восточную Русь', period: 'XIII век', era: 'invasion', difficulty: 'easy', tags: ['войны', 'монголы'] },
  { id: 'c21', year: '1238', event: 'Битва на реке Сити', period: 'XIII век', era: 'invasion', difficulty: 'hard', tags: ['войны', 'монголы'] },
  { id: 'c22', year: '1240', event: 'Невская битва', period: 'XIII век', era: 'invasion', ruler: 'Александр Невский', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c23', year: '1242', event: 'Ледовое побоище', period: 'XIII век', era: 'invasion', ruler: 'Александр Невский', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c24', year: '1243', event: 'Установление ордынского ига', period: 'XIII век', era: 'invasion', difficulty: 'easy', tags: ['ключевая дата', 'монголы'] },
  { id: 'c25', year: '1263', event: 'Выделение Московского княжества', period: 'XIII век', era: 'invasion', difficulty: 'medium', tags: ['Москва', 'политика'] },

  // ===== ЭПОХА 4: ВОЗВЫШЕНИЕ МОСКВЫ (XIV в.) =====
  { id: 'c26', year: '1325', event: 'Перенос резиденции митрополита в Москву', period: 'XIV век', era: 'moscow', difficulty: 'medium', tags: ['религия', 'Москва'] },
  { id: 'c27', year: '1367', event: 'Строительство белокаменного Кремля в Москве', period: 'XIV век', era: 'moscow', difficulty: 'medium', tags: ['Москва', 'архитектура'] },
  { id: 'c28', year: '1378', event: 'Битва на реке Воже', period: 'XIV век', era: 'moscow', difficulty: 'hard', tags: ['войны', 'Орда'] },
  { id: 'c29', year: '1380', event: 'Куликовская битва', period: 'XIV век', era: 'moscow', ruler: 'Дмитрий Донской', difficulty: 'easy', tags: ['войны', 'ключевая дата', 'Орда'] },
  { id: 'c30', year: '1382', event: 'Разорение Москвы Тохтамышем', period: 'XIV век', era: 'moscow', difficulty: 'medium', tags: ['войны', 'Орда'] },
  { id: 'c31', year: '1389', event: 'Передача ярлыка по наследству', period: 'XIV век', era: 'moscow', difficulty: 'medium', tags: ['политика', 'Орда'] },
  { id: 'c32', year: '1395', event: 'Несостоявшееся нашествие Тамерлана на Русь', period: 'XIV век', era: 'moscow', difficulty: 'hard', tags: ['войны'] },

  // ===== ЭПОХА 5: МОСКОВСКОЕ ЦАРСТВО (XV в.) =====
  { id: 'c33', year: '1408', event: 'Нашествие Едигея на Русь', period: 'XV век', era: 'tsardom', difficulty: 'hard', tags: ['войны', 'Орда'] },
  { id: 'c34', year: '1410', event: 'Грюнвальдская битва', period: 'XV век', era: 'tsardom', difficulty: 'medium', tags: ['войны'] },
  { id: 'c35', year: '1463', event: 'Присоединение Ярославля к Москве', period: 'XV век', era: 'tsardom', difficulty: 'hard', tags: ['объединение', 'Москва'] },
  { id: 'c36', year: '1471', event: 'Битва на реке Шелони', period: 'XV век', era: 'tsardom', difficulty: 'medium', tags: ['войны', 'объединение'] },
  { id: 'c37', year: '1478', event: 'Присоединение Новгорода к Москве', period: 'XV век', era: 'tsardom', ruler: 'Иван III', difficulty: 'easy', tags: ['объединение', 'Москва'] },
  { id: 'c38', year: '1480', event: 'Стояние на реке Угре. Конец ордынского ига', period: 'XV век', era: 'tsardom', ruler: 'Иван III', difficulty: 'easy', tags: ['ключевая дата', 'войны'] },
  { id: 'c39', year: '1485', event: 'Принятие Иваном III титула «Государь всея Руси»', period: 'XV век', era: 'tsardom', ruler: 'Иван III', difficulty: 'medium', tags: ['политика'] },
  { id: 'c40', year: '1497', event: 'Издание Судебника Ивана III', period: 'XV век', era: 'tsardom', ruler: 'Иван III', difficulty: 'medium', tags: ['законы', 'ключевая дата'] },

  // ===== ЭПОХА 6: ИВАН ГРОЗНЫЙ (XVI в.) =====
  { id: 'c41', year: '1510', event: 'Присоединение Пскова к Москве', period: 'XVI век', era: 'grozny', difficulty: 'medium', tags: ['объединение'] },
  { id: 'c42', year: '1547', event: 'Венчание Ивана IV на царство', period: 'XVI век', era: 'grozny', ruler: 'Иван Грозный', difficulty: 'easy', tags: ['правители', 'ключевая дата'] },
  { id: 'c43', year: '1549', event: 'Созыв первого Земского собора', period: 'XVI век', era: 'grozny', difficulty: 'medium', tags: ['политика'] },
  { id: 'c44', year: '1550', event: 'Издание Судебника Ивана IV', period: 'XVI век', era: 'grozny', difficulty: 'medium', tags: ['законы'] },
  { id: 'c45', year: '1552', event: 'Присоединение Казани', period: 'XVI век', era: 'grozny', difficulty: 'easy', tags: ['объединение', 'войны'] },
  { id: 'c46', year: '1556', event: 'Присоединение Астрахани', period: 'XVI век', era: 'grozny', difficulty: 'medium', tags: ['объединение'] },
  { id: 'c47', year: '1558–1583', event: 'Ливонская война', period: 'XVI век', era: 'grozny', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c48', year: '1564', event: 'Начало книгопечатания в России. Иван Фёдоров', period: 'XVI век', era: 'grozny', difficulty: 'medium', tags: ['культура', 'ключевая дата'] },
  { id: 'c49', year: '1565-1572', event: 'Опричнина', period: 'XVI век', era: 'grozny', ruler: 'Иван Грозный', difficulty: 'easy', tags: ['политика', 'ключевая дата'] },
  { id: 'c50', year: '1581', event: 'Введение заповедных лет', period: 'XVI век', era: 'grozny', difficulty: 'medium', tags: ['законы', 'крепостное право'] },
  { id: 'c51', year: '1589', event: 'Учреждение патриаршества в России', period: 'XVI век', era: 'grozny', difficulty: 'medium', tags: ['религия'] },

  // ===== ЭПОХА 7: СМУТНОЕ ВРЕМЯ (1598-1618) =====
  { id: 'c52', year: '1604', event: 'Поход Лжедмитрия I на Москву', period: 'XVII век', era: 'time_of_troubles', difficulty: 'medium', tags: ['Смута'] },
  { id: 'c53', year: '1606-1607', event: 'Восстание под предводительством Болотникова', period: 'XVII век', era: 'time_of_troubles', difficulty: 'medium', tags: ['восстания', 'Смута'] },
  { id: 'c54', year: '1611', event: 'Формирование Первого ополчения в Рязани', period: 'XVII век', era: 'time_of_troubles', difficulty: 'medium', tags: ['Смута'] },
  { id: 'c55', year: '1612', event: 'Формирование Второго ополчения Минина и Пожарского', period: 'XVII век', era: 'time_of_troubles', difficulty: 'easy', tags: ['Смута', 'ключевая дата'] },
  { id: 'c56', year: '1613', event: 'Избрание Земским собором Михаила Романова на царство', period: 'XVII век', era: 'time_of_troubles', difficulty: 'easy', tags: ['правители', 'ключевая дата', 'Смута'] },
  { id: 'c57', year: '1617', event: 'Столбовский мир со Швецией', period: 'XVII век', era: 'time_of_troubles', difficulty: 'hard', tags: ['внешняя политика', 'Смута'] },
  { id: 'c58', year: '1618', event: 'Деулинское перемирие с Польшей', period: 'XVII век', era: 'time_of_troubles', difficulty: 'hard', tags: ['внешняя политика', 'Смута'] },

  // ===== ЭПОХА 8: ПЕРВЫЕ РОМАНОВЫ (1613-1698) =====
  { id: 'c59', year: '1648', event: 'Соляной бунт', period: 'XVII век', era: 'early-romanovs', difficulty: 'medium', tags: ['восстания'] },
  { id: 'c60', year: '1648', event: 'Начало освободительной войны Б. Хмельницкого на Украине', period: 'XVII век', era: 'early-romanovs', difficulty: 'medium', tags: ['восстания'] },
  { id: 'c61', year: '1649', event: 'Принятие Соборного уложения', period: 'XVII век', era: 'early-romanovs', difficulty: 'easy', tags: ['законы', 'ключевая дата', 'крепостное право'] },
  { id: 'c62', year: '1654', event: 'Переяславская рада. Вхождение Украины в состав России', period: 'XVII век', era: 'early-romanovs', difficulty: 'easy', tags: ['ключевая дата'] },
  { id: 'c63', year: '1662', event: 'Медный бунт', period: 'XVII век', era: 'early-romanovs', difficulty: 'medium', tags: ['восстания'] },
  { id: 'c64', year: '1670-1671', event: 'Крестьянская война под предводительством С. Разина', period: 'XVII век', era: 'early-romanovs', difficulty: 'easy', tags: ['восстания'] },
  { id: 'c65', year: '1682', event: 'Стрелецкий бунт 1682 г.', period: 'XVII век', era: 'early-romanovs', difficulty: 'medium', tags: ['восстания'] },
  { id: 'c66', year: '1687', event: 'Основание Славяно-греко-латинской академии', period: 'XVII век', era: 'early-romanovs', difficulty: 'hard', tags: ['культура', 'образование'] },
  { id: 'c67', year: '1698', event: 'Стрелецкий бунт 1698 г.', period: 'XVII век', era: 'early-romanovs', ruler: 'Пётр I', difficulty: 'medium', tags: ['восстания'] },

  // ===== ЭПОХА 9: ПЕТРОВСКАЯ ЭПОХА (XVIII в.) =====
  { id: 'c68', year: '1700–1721', event: 'Северная война', period: 'XVIII век', era: 'peter', ruler: 'Пётр I', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c69', year: '1703', event: 'Основание Санкт-Петербурга', period: 'XVIII век', era: 'peter', ruler: 'Пётр I', difficulty: 'easy', tags: ['ключевая дата', 'города'] },
  { id: 'c70', year: '1708', event: 'Сражение при Лесной', period: 'XVIII век', era: 'peter', ruler: 'Пётр I', difficulty: 'hard', tags: ['войны'] },
  { id: 'c71', year: '1709', event: 'Полтавская битва', period: 'XVIII век', era: 'peter', ruler: 'Пётр I', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c72', year: '1711', event: 'Учреждение Правительствующего сената', period: 'XVIII век', era: 'peter', ruler: 'Пётр I', difficulty: 'medium', tags: ['реформы', 'политика'] },
  { id: 'c73', year: '1714', event: 'Гангутское сражение', period: 'XVIII век', era: 'peter', ruler: 'Пётр I', difficulty: 'medium', tags: ['войны'] },
  { id: 'c74', year: '1718', event: 'Учреждение коллегий', period: 'XVIII век', era: 'peter', ruler: 'Пётр I', difficulty: 'medium', tags: ['реформы'] },
  { id: 'c75', year: '1721', event: 'Ништадтский мир. Провозглашение России империей', period: 'XVIII век', era: 'peter', ruler: 'Пётр I', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c76', year: '1722', event: 'Введение Табели о рангах', period: 'XVIII век', era: 'peter', ruler: 'Пётр I', difficulty: 'easy', tags: ['реформы', 'ключевая дата'] },
  { id: 'c77', year: '1725', event: 'Открытие Академии наук в Санкт-Петербурге', period: 'XVIII век', era: 'peter', ruler: 'Пётр I', difficulty: 'medium', tags: ['культура', 'наука'] },

  // ===== ЭПОХА 10: ДВОРЦОВЫЕ ПЕРЕВОРОТЫ (сер. XVIII в.) =====
  { id: 'c78', year: '1741-1743', event: 'Русско-шведская война', period: 'XVIII век', era: 'palace_coup', difficulty: 'hard', tags: ['войны'] },
  { id: 'c79', year: '1755', event: 'Основание Московского университета (МГУ)', period: 'XVIII век', era: 'palace_coup', difficulty: 'easy', tags: ['культура', 'образование', 'ключевая дата'] },
  { id: 'c80', year: '1756–1763', event: 'Семилетняя война', period: 'XVIII век', era: 'palace_coup', difficulty: 'medium', tags: ['войны'] },
  { id: 'c81', year: '1762', event: 'Манифест о вольности дворянства', period: 'XVIII век', era: 'palace_coup', ruler: 'Пётр III', difficulty: 'medium', tags: ['реформы', 'дворянство', 'ключевая дата'] },
  { id: 'c82', year: '1764', event: 'Секуляризация церковных земель', period: 'XVIII век', era: 'palace_coup', ruler: 'Екатерина II', difficulty: 'hard', tags: ['религия', 'реформы'] },

  // ===== ЭПОХА 11: ЕКАТЕРИНА ВЕЛИКАЯ (вторая пол. XVIII в.) =====
  { id: 'c83', year: '1767-1768', event: 'Созыв Уложенной комиссии', period: 'XVIII век', era: 'catherine', ruler: 'Екатерина II', difficulty: 'medium', tags: ['реформы'] },
  { id: 'c84', year: '1768–1774', event: 'Русско-турецкая война (Кючук-Кайнарджийский мир)', period: 'XVIII век', era: 'catherine', ruler: 'Екатерина II', difficulty: 'medium', tags: ['войны', 'Турция'] },
  { id: 'c85', year: '1770', event: 'Чесменское сражение', period: 'XVIII век', era: 'catherine', difficulty: 'medium', tags: ['войны'] },
  { id: 'c86', year: '1773-1775', event: 'Восстание под предводительством Е. Пугачёва', period: 'XVIII век', era: 'catherine', difficulty: 'easy', tags: ['восстания', 'ключевая дата'] },
  { id: 'c87', year: '1774', event: 'Кючук-Кайнарджийский мир', period: 'XVIII век', era: 'catherine', difficulty: 'hard', tags: ['войны', 'Турция'] },
  { id: 'c88', year: '1775', event: 'Проведение губернской реформы', period: 'XVIII век', era: 'catherine', ruler: 'Екатерина II', difficulty: 'medium', tags: ['реформы'] },
  { id: 'c89', year: '1783', event: 'Присоединение Крыма к России', period: 'XVIII век', era: 'catherine', ruler: 'Екатерина II', difficulty: 'easy', tags: ['объединение', 'Крым', 'ключевая дата'] },
  { id: 'c90', year: '1785', event: 'Издание Жалованных грамот дворянству и городам', period: 'XVIII век', era: 'catherine', ruler: 'Екатерина II', difficulty: 'medium', tags: ['реформы', 'дворянство'] },
  { id: 'c91', year: '1790', event: 'Взятие Измаила', period: 'XVIII век', era: 'catherine', ruler: 'Суворов', difficulty: 'medium', tags: ['войны', 'Турция'] },
  { id: 'c92', year: '1791', event: 'Ясский мирный договор', period: 'XVIII век', era: 'catherine', difficulty: 'hard', tags: ['войны', 'Турция'] },
  { id: 'c93', year: '1799', event: 'Итальянский и Швейцарский походы А.В. Суворова', period: 'XVIII век', era: 'catherine', ruler: 'Суворов', difficulty: 'medium', tags: ['войны'] },

  // ===== ЭПОХА 12: АЛЕКСАНДР I (нач. XIX в.) =====
  { id: 'c94', year: '1802', event: 'Учреждение министерств', period: 'XIX век', era: 'alexander1', ruler: 'Александр I', difficulty: 'medium', tags: ['реформы'] },
  { id: 'c95', year: '1803', event: 'Издание указа о вольных хлебопашцах', period: 'XIX век', era: 'alexander1', ruler: 'Александр I', difficulty: 'medium', tags: ['реформы', 'крепостное право'] },
  { id: 'c96', year: '1807', event: 'Тильзитский мир с Францией', period: 'XIX век', era: 'alexander1', ruler: 'Александр I', difficulty: 'medium', tags: ['внешняя политика', 'Франция'] },
  { id: 'c97', year: '1810', event: 'Учреждение Государственного совета', period: 'XIX век', era: 'alexander1', ruler: 'Александр I', difficulty: 'medium', tags: ['реформы', 'политика'] },
  { id: 'c98', year: '1811', event: 'Основание Царскосельского лицея', period: 'XIX век', era: 'alexander1', difficulty: 'medium', tags: ['культура', 'образование'] },
  { id: 'c99', year: '1812', event: 'Отечественная война 1812 г.', period: 'XIX век', era: 'alexander1', difficulty: 'easy', tags: ['войны', 'ключевая дата', 'Франция'] },
  { id: 'c100', year: '1812', event: 'Бородинское сражение', period: 'XIX век', era: 'alexander1', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c101', year: '1814', event: 'Вступление русских войск в Париж', period: 'XIX век', era: 'alexander1', difficulty: 'medium', tags: ['войны', 'Франция'] },
  { id: 'c102', year: '1816', event: 'Создание Союза спасения — первого тайного общества декабристов', period: 'XIX век', era: 'alexander1', difficulty: 'medium', tags: ['движения'] },
  { id: 'c103', year: '1818', event: 'Создание Союза благоденствия', period: 'XIX век', era: 'alexander1', difficulty: 'medium', tags: ['движения'] },

  // ===== ЭПОХА 13: НИКОЛАЙ I (1825-1855) =====
  { id: 'c104', year: '1825', event: 'Восстание декабристов на Сенатской площади', period: 'XIX век', era: 'nicholas1', difficulty: 'easy', tags: ['движения', 'ключевая дата'] },
  { id: 'c105', year: '1826', event: 'Создание III отделения СЕИВК', period: 'XIX век', era: 'nicholas1', ruler: 'Николай I', difficulty: 'medium', tags: ['политика'] },
  { id: 'c106', year: '1826–1828', event: 'Русско-иранская война (Туркманчайский мир)', period: 'XIX век', era: 'nicholas1', difficulty: 'hard', tags: ['войны', 'Иран'] },
  { id: 'c107', year: '1828–1829', event: 'Русско-турецкая война (Адрианопольский мир)', period: 'XIX век', era: 'nicholas1', difficulty: 'medium', tags: ['войны', 'Турция'] },
  { id: 'c108', year: '1830-1831', event: 'Восстание в Царстве Польском', period: 'XIX век', era: 'nicholas1', difficulty: 'medium', tags: ['восстания', 'Польша'] },
  { id: 'c109', year: '1837', event: 'Открытие первой железной дороги (Петербург — Царское Село)', period: 'XIX век', era: 'nicholas1', difficulty: 'medium', tags: ['транспорт', 'ключевая дата'] },
  { id: 'c110', year: '1842', event: 'Издание указа об обязанных крестьянах', period: 'XIX век', era: 'nicholas1', difficulty: 'hard', tags: ['реформы', 'крепостное право'] },
  { id: 'c111', year: '1851', event: 'Открытие Николаевской (Петербурго-Московской) железной дороги', period: 'XIX век', era: 'nicholas1', difficulty: 'medium', tags: ['транспорт'] },
  { id: 'c112', year: '1853–1856', event: 'Крымская (Восточная) война', period: 'XIX век', era: 'nicholas1', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },

  // ===== ЭПОХА 14: ВЕЛИКИЕ РЕФОРМЫ (Александр II) =====
  { id: 'c113', year: '1858', event: 'Подписание Айгунского договора с Китаем', period: 'XIX век', era: 'reforms', ruler: 'Александр II', difficulty: 'hard', tags: ['внешняя политика', 'Китай'] },
  { id: 'c114', year: '1861', event: 'Отмена крепостного права (Манифест 19 февраля 1861 г.)', period: 'XIX век', era: 'reforms', ruler: 'Александр II', difficulty: 'easy', tags: ['реформы', 'ключевая дата', 'крепостное право'] },
  { id: 'c115', year: '1864', event: 'Проведение земской и судебной реформ', period: 'XIX век', era: 'reforms', ruler: 'Александр II', difficulty: 'easy', tags: ['реформы', 'ключевая дата'] },
  { id: 'c116', year: '1867', event: 'Продажа Аляски США', period: 'XIX век', era: 'reforms', ruler: 'Александр II', difficulty: 'medium', tags: ['внешняя политика', 'ключевая дата'] },
  { id: 'c117', year: '1870', event: 'Проведение городской реформы', period: 'XIX век', era: 'reforms', ruler: 'Александр II', difficulty: 'medium', tags: ['реформы'] },
  { id: 'c118', year: '1874', event: 'Введение всеобщей воинской повинности', period: 'XIX век', era: 'reforms', ruler: 'Александр II', difficulty: 'medium', tags: ['реформы', 'армия'] },
  { id: 'c119', year: '1877–1878', event: 'Русско-турецкая война (Сан-Стефанский мир)', period: 'XIX век', era: 'reforms', difficulty: 'medium', tags: ['войны', 'Турция'] },
  { id: 'c120', year: '1878', event: 'Сан-Стефанский мирный договор', period: 'XIX век', era: 'reforms', difficulty: 'hard', tags: ['войны', 'Турция'] },
  { id: 'c121', year: '1881', event: 'Убийство Александра II народовольцами', period: 'XIX век', era: 'reforms', difficulty: 'easy', tags: ['правители', 'ключевая дата'] },

  // ===== ЭПОХА 15: КОНТРРЕФОРМЫ (Александр III, Николай II) =====
  { id: 'c122', year: '1881', event: 'Манифест о незыблемости самодержавия', period: 'XIX век', era: 'counterreforms', ruler: 'Александр III', difficulty: 'medium', tags: ['политика'] },
  { id: 'c123', year: '1891', event: 'Начало строительства Транссибирской магистрали', period: 'XIX век', era: 'counterreforms', ruler: 'Александр III', difficulty: 'medium', tags: ['транспорт', 'ключевая дата'] },
  { id: 'c124', year: '1897', event: 'Проведение первой всеобщей переписи населения', period: 'XIX век', era: 'counterreforms', ruler: 'Николай II', difficulty: 'medium', tags: ['ключевая дата'] },
  { id: 'c125', year: '1897', event: 'Денежная реформа С.Ю. Витте (введение золотого рубля)', period: 'XIX век', era: 'counterreforms', difficulty: 'hard', tags: ['реформы', 'экономика'] },
  { id: 'c126', year: '1898', event: 'I съезд РСДРП', period: 'XIX век', era: 'counterreforms', difficulty: 'medium', tags: ['движения', 'политика'] },
  { id: 'c127', year: '1903', event: 'II съезд РСДРП. Раскол на большевиков и меньшевиков', period: 'XIX век', era: 'counterreforms', difficulty: 'medium', tags: ['движения', 'политика'] },
  { id: 'c128', year: '1904–1905', event: 'Русско-японская война', period: 'XX век', era: 'counterreforms', difficulty: 'easy', tags: ['войны', 'ключевая дата', 'Япония'] },
  { id: 'c129', year: '1905', event: 'Кровавое воскресенье (9 января 1905 г.)', period: 'XX век', era: 'counterreforms', difficulty: 'easy', tags: ['ключевая дата', 'революция'] },
  { id: 'c130', year: '1905', event: 'Восстание на броненосце «Потёмкин»', period: 'XX век', era: 'counterreforms', difficulty: 'medium', tags: ['революция'] },
  { id: 'c131', year: '1905', event: 'Издание Манифеста 17 октября', period: 'XX век', era: 'counterreforms', ruler: 'Николай II', difficulty: 'easy', tags: ['реформы', 'ключевая дата', 'революция'] },

  // ===== ЭПОХА 16: РЕВОЛЮЦИИ И ГРАЖДАНСКАЯ ВОЙНА =====
  { id: 'c132', year: '1906', event: 'Начало работы I Государственной думы', period: 'XX век', era: 'revolution', difficulty: 'medium', tags: ['политика'] },
  { id: 'c133', year: '1906-1911', event: 'Столыпинская аграрная реформа', period: 'XX век', era: 'revolution', difficulty: 'easy', tags: ['реформы', 'ключевая дата'] },
  { id: 'c134', year: '1912', event: 'Расстрел рабочих на Ленских приисках', period: 'XX век', era: 'revolution', difficulty: 'medium', tags: ['революция'] },
  { id: 'c135', year: '1914–1918', event: 'Участие России в Первой мировой войне', period: 'XX век', era: 'revolution', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c136', year: '1916', event: 'Брусиловский прорыв', period: 'XX век', era: 'revolution', difficulty: 'medium', tags: ['войны'] },
  { id: 'c137', year: '1917', event: 'Февральская революция 1917 г.', period: 'XX век', era: 'revolution', difficulty: 'easy', tags: ['революция', 'ключевая дата'] },
  { id: 'c138', year: '1917', event: 'Отречение Николая II от престола (2 марта)', period: 'XX век', era: 'revolution', difficulty: 'easy', tags: ['революция', 'правители'] },
  { id: 'c139', year: '1917', event: 'Октябрьская революция 1917 г.', period: 'XX век', era: 'revolution', difficulty: 'easy', tags: ['революция', 'ключевая дата'] },
  { id: 'c140', year: '1918', event: 'Заключение Брестского мира (3 марта)', period: 'XX век', era: 'revolution', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c141', year: '1917–1922', event: 'Гражданская война в России', period: 'XX век', era: 'revolution', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c142', year: '1921', event: 'Кронштадтский мятеж', period: 'XX век', era: 'revolution', difficulty: 'medium', tags: ['восстания'] },
  { id: 'c143', year: '1921', event: 'Переход к НЭПу (X съезд РКП(б))', period: 'XX век', era: 'revolution', difficulty: 'easy', tags: ['реформы', 'ключевая дата', 'экономика'] },
  { id: 'c144', year: '1922', event: 'Образование СССР', period: 'XX век', era: 'revolution', difficulty: 'easy', tags: ['политика', 'ключевая дата'] },

  // ===== ЭПОХА 17: СССР 1920-е — 1930-е =====
  { id: 'c145', year: '1924', event: 'Принятие первой Конституции СССР', period: 'XX век', era: 'ussr_early', difficulty: 'medium', tags: ['политика'] },
  { id: 'c146', year: '1928', event: 'Начало первой пятилетки. Курс на индустриализацию', period: 'XX век', era: 'ussr_early', difficulty: 'easy', tags: ['экономика', 'ключевая дата'] },
  { id: 'c147', year: '1928', event: 'Начало массовой коллективизации', period: 'XX век', era: 'ussr_early', difficulty: 'easy', tags: ['экономика', 'ключевая дата'] },
  { id: 'c148', year: '1930', event: 'Создание ГУЛАГа', period: 'XX век', era: 'ussr_early', difficulty: 'medium', tags: ['политика'] },
  { id: 'c149', year: '1932', event: 'Введение паспортной системы в СССР', period: 'XX век', era: 'ussr_early', difficulty: 'medium', tags: ['политика'] },
  { id: 'c150', year: '1933', event: 'Установление дипломатических отношений с США', period: 'XX век', era: 'ussr_early', difficulty: 'medium', tags: ['внешняя политика', 'США'] },
  { id: 'c151', year: '1934', event: 'Убийство С.М. Кирова', period: 'XX век', era: 'ussr_early', difficulty: 'medium', tags: ['политика'] },
  { id: 'c152', year: '1934', event: 'Вступление СССР в Лигу Наций', period: 'XX век', era: 'ussr_early', difficulty: 'medium', tags: ['внешняя политика'] },
  { id: 'c153', year: '1936', event: 'Принятие Конституции СССР (1936)', period: 'XX век', era: 'ussr_early', difficulty: 'easy', tags: ['политика', 'ключевая дата'] },
  { id: 'c154', year: '1937-1938', event: 'Массовые политические репрессии (Большой террор)', period: 'XX век', era: 'ussr_early', difficulty: 'medium', tags: ['политика', 'ключевая дата'] },
  { id: 'c155', year: '1939', event: 'Сражения у реки Халхин-Гол', period: 'XX век', era: 'ussr_early', difficulty: 'medium', tags: ['войны', 'Япония'] },
  { id: 'c156', year: '1939', event: 'Подписание пакта Молотова — Риббентропа (23 августа)', period: 'XX век', era: 'ussr_early', difficulty: 'easy', tags: ['внешняя политика', 'ключевая дата'] },

  // ===== ЭПОХА 18: ВЕЛИКАЯ ОТЕЧЕСТВЕННАЯ ВОЙНА =====
  { id: 'c157', year: '1941', event: 'Начало Великой Отечественной войны (22 июня)', period: 'XX век', era: 'wwii', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c158', year: '1941-1944', event: 'Блокада Ленинграда', period: 'XX век', era: 'wwii', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c159', year: '1941', event: 'Битва за Москву (30 сентября — 20 апреля 1942 г.)', period: 'XX век', era: 'wwii', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c160', year: '1942-1943', event: 'Сталинградская битва', period: 'XX век', era: 'wwii', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c161', year: '1942', event: 'Издание приказа № 227 «Ни шагу назад»', period: 'XX век', era: 'wwii', difficulty: 'medium', tags: ['войны', 'ключевая дата'] },
  { id: 'c162', year: '1943', event: 'Курская битва', period: 'XX век', era: 'wwii', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c163', year: '1943', event: 'Прорыв блокады Ленинграда', period: 'XX век', era: 'wwii', difficulty: 'medium', tags: ['войны'] },
  { id: 'c164', year: '1943', event: 'Тегеранская конференция', period: 'XX век', era: 'wwii', difficulty: 'medium', tags: ['внешняя политика'] },
  { id: 'c165', year: '1944', event: 'Проведение операции «Багратион»', period: 'XX век', era: 'wwii', difficulty: 'medium', tags: ['войны'] },
  { id: 'c166', year: '1945', event: 'Ялтинская (Крымская) конференция', period: 'XX век', era: 'wwii', difficulty: 'medium', tags: ['внешняя политика'] },
  { id: 'c167', year: '1945', event: 'Берлинская операция. Капитуляция Германии (9 мая 1945 г.)', period: 'XX век', era: 'wwii', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c168', year: '1945', event: 'Потсдамская конференция', period: 'XX век', era: 'wwii', difficulty: 'medium', tags: ['внешняя политика'] },
  { id: 'c169', year: '1945', event: 'Вступление СССР в войну с Японией. Разгром Квантунской армии', period: 'XX век', era: 'wwii', difficulty: 'medium', tags: ['войны', 'Япония'] },

  // ===== ЭПОХА 19: ПОСЛЕВОЕННЫЙ СССР (1945-1953) =====
  { id: 'c170', year: '1946', event: 'Фултонская речь У. Черчилля. Начало холодной войны', period: 'XX век', era: 'postwar', difficulty: 'medium', tags: ['внешняя политика', 'холодная война'] },
  { id: 'c171', year: '1947', event: 'Денежная реформа в СССР. Отмена карточной системы', period: 'XX век', era: 'postwar', difficulty: 'medium', tags: ['экономика'] },
  { id: 'c172', year: '1949', event: 'Испытание первой советской атомной бомбы (И.В. Курчатов)', period: 'XX век', era: 'postwar', difficulty: 'easy', tags: ['наука', 'ключевая дата'] },
  { id: 'c173', year: '1949', event: 'Создание Совета экономической взаимопомощи (СЭВ)', period: 'XX век', era: 'postwar', difficulty: 'medium', tags: ['внешняя политика', 'холодная война'] },

  // ===== ЭПОХА 20: ХРУЩЁВСКАЯ ОТТЕПЕЛЬ =====
  { id: 'c174', year: '1953', event: 'Испытание первой советской водородной бомбы', period: 'XX век', era: 'thaw', difficulty: 'medium', tags: ['наука'] },
  { id: 'c175', year: '1954', event: 'Ввод в действие первой в мире АЭС в Обнинске', period: 'XX век', era: 'thaw', difficulty: 'medium', tags: ['наука', 'ключевая дата'] },
  { id: 'c176', year: '1955', event: 'Создание Организации Варшавского договора (ОВД)', period: 'XX век', era: 'thaw', difficulty: 'medium', tags: ['внешняя политика', 'холодная война'] },
  { id: 'c177', year: '1956', event: 'XX съезд КПСС. Разоблачение культа личности Сталина', period: 'XX век', era: 'thaw', difficulty: 'easy', tags: ['политика', 'ключевая дата'] },
  { id: 'c178', year: '1957', event: 'Запуск первого в мире искусственного спутника Земли', period: 'XX век', era: 'thaw', difficulty: 'easy', tags: ['наука', 'ключевая дата'] },
  { id: 'c179', year: '1961', event: 'Первый полёт человека в космос (Ю.А. Гагарин, 12 апреля)', period: 'XX век', era: 'thaw', difficulty: 'easy', tags: ['наука', 'ключевая дата'] },
  { id: 'c180', year: '1962', event: 'Карибский кризис', period: 'XX век', era: 'thaw', difficulty: 'medium', tags: ['внешняя политика', 'США', 'холодная война'] },
  { id: 'c181', year: '1962', event: 'События в Новочеркасске', period: 'XX век', era: 'thaw', difficulty: 'medium', tags: ['восстания'] },
  { id: 'c182', year: '1963', event: 'Первый полёт женщины-космонавта (В.В. Терешкова)', period: 'XX век', era: 'thaw', difficulty: 'medium', tags: ['наука'] },
  { id: 'c183', year: '1964', event: 'Смещение Н.С. Хрущёва с постов', period: 'XX век', era: 'thaw', difficulty: 'medium', tags: ['политика'] },

  // ===== ЭПОХА 21: ЗАСТОЙ (Брежнев) =====
  { id: 'c184', year: '1965-1970', event: 'Экономическая реформа А.Н. Косыгина', period: 'XX век', era: 'stagnation', difficulty: 'medium', tags: ['реформы', 'экономика'] },
  { id: 'c185', year: '1968', event: 'Ввод войск ОВД в Чехословакию (Пражская весна)', period: 'XX век', era: 'stagnation', difficulty: 'medium', tags: ['внешняя политика'] },
  { id: 'c186', year: '1972', event: 'Подписание договора ОСВ-1 между СССР и США', period: 'XX век', era: 'stagnation', difficulty: 'medium', tags: ['внешняя политика', 'США', 'холодная война'] },
  { id: 'c187', year: '1975', event: 'Хельсинкское Совещание по безопасности и сотрудничеству в Европе', period: 'XX век', era: 'stagnation', difficulty: 'medium', tags: ['внешняя политика'] },
  { id: 'c188', year: '1975', event: 'Совместный полёт «Союз — Аполлон»', period: 'XX век', era: 'stagnation', difficulty: 'medium', tags: ['наука'] },
  { id: 'c189', year: '1977', event: 'Принятие Конституции СССР (1977)', period: 'XX век', era: 'stagnation', difficulty: 'medium', tags: ['политика'] },
  { id: 'c190', year: '1979', event: 'Ввод советских войск в Афганистан', period: 'XX век', era: 'stagnation', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c191', year: '1980', event: 'Проведение XXII Олимпийских игр в Москве', period: 'XX век', era: 'stagnation', difficulty: 'medium', tags: ['культура'] },

  // ===== ЭПОХА 22: ПЕРЕСТРОЙКА И РАСПАД =====
  { id: 'c192', year: '1985', event: 'Апрельский пленум ЦК КПСС. Курс на перестройку', period: 'XX век', era: 'perestroika', ruler: 'Горбачёв', difficulty: 'medium', tags: ['политика', 'ключевая дата'] },
  { id: 'c193', year: '1986', event: 'Авария на Чернобыльской АЭС (26 апреля)', period: 'XX век', era: 'perestroika', difficulty: 'easy', tags: ['ключевая дата'] },
  { id: 'c194', year: '1987', event: 'Подписание Договора о РСМД между СССР и США', period: 'XX век', era: 'perestroika', difficulty: 'hard', tags: ['внешняя политика', 'США'] },
  { id: 'c195', year: '1989', event: 'Завершение вывода советских войск из Афганистана', period: 'XX век', era: 'perestroika', difficulty: 'medium', tags: ['войны', 'ключевая дата'] },
  { id: 'c196', year: '1989', event: 'Падение Берлинской стены', period: 'XX век', era: 'perestroika', difficulty: 'medium', tags: ['внешняя политика'] },
  { id: 'c197', year: '1990', event: 'Отмена 6-й статьи Конституции СССР', period: 'XX век', era: 'perestroika', difficulty: 'hard', tags: ['политика'] },
  { id: 'c198', year: '1991', event: 'Проведение референдума о сохранении СССР (17 марта)', period: 'XX век', era: 'perestroika', difficulty: 'medium', tags: ['политика'] },
  { id: 'c199', year: '1991', event: 'Августовский политический кризис (ГКЧП, 19-21 августа)', period: 'XX век', era: 'perestroika', difficulty: 'easy', tags: ['политика', 'ключевая дата'] },
  { id: 'c200', year: '1991', event: 'Подписание Беловежских соглашений (8 декабря)', period: 'XX век', era: 'perestroika', difficulty: 'easy', tags: ['политика', 'ключевая дата'] },
  { id: 'c201', year: '1991', event: 'Распад СССР (25 декабря)', period: 'XX век', era: 'perestroika', difficulty: 'easy', tags: ['политика', 'ключевая дата'] },

  // ===== ЭПОХА 23: НОВАЯ РОССИЯ (1992-наст. время) =====
  { id: 'c202', year: '1992', event: 'Начало радикальных экономических реформ («шоковая терапия»)', period: 'XX век', era: 'modern', difficulty: 'medium', tags: ['экономика', 'ключевая дата'] },
  { id: 'c203', year: '1993', event: 'Принятие Конституции Российской Федерации', period: 'XX век', era: 'modern', difficulty: 'easy', tags: ['политика', 'ключевая дата'] },
  { id: 'c204', year: '1994-1996', event: 'Первая чеченская война', period: 'XX век', era: 'modern', difficulty: 'medium', tags: ['войны'] },
  { id: 'c205', year: '1998', event: 'Дефолт в России (17 августа)', period: 'XX век', era: 'modern', difficulty: 'medium', tags: ['экономика', 'ключевая дата'] },
  { id: 'c206', year: '1999', event: 'Вторая чеченская война (1999—2009)', period: 'XX век', era: 'modern', difficulty: 'medium', tags: ['войны'] },
  { id: 'c207', year: '1999', event: 'Отставка Б.Н. Ельцина (31 декабря)', period: 'XX век', era: 'modern', difficulty: 'easy', tags: ['политика', 'ключевая дата'] },
  { id: 'c208', year: '2000', event: 'Гибель подводной лодки «Курск»', period: 'XXI век', era: 'modern', difficulty: 'medium', tags: ['ключевая дата'] },
  { id: 'c209', year: '2008', event: 'Грузино-югоосетинский конфликт', period: 'XXI век', era: 'modern', difficulty: 'medium', tags: ['войны'] },
  { id: 'c210', year: '2012', event: 'Вступление России во Всемирную торговую организацию', period: 'XXI век', era: 'modern', difficulty: 'medium', tags: ['экономика'] },
  { id: 'c211', year: '2014', event: 'Принятие Крыма в состав Российской Федерации', period: 'XXI век', era: 'modern', difficulty: 'easy', tags: ['ключевая дата'] },
  { id: 'c212', year: '2014', event: 'Проведение XXII Олимпийских зимних игр в Сочи', period: 'XXI век', era: 'modern', difficulty: 'easy', tags: ['культура'] },
  { id: 'c213', year: '2015', event: 'Начало деятельности Евразийского экономического союза (ЕАЭС)', period: 'XXI век', era: 'modern', difficulty: 'medium', tags: ['внешняя политика', 'экономика'] },
  { id: 'c214', year: '2018', event: 'Проведение чемпионата мира по футболу в России', period: 'XXI век', era: 'modern', difficulty: 'easy', tags: ['культура'] },
  { id: 'c215', year: '2020', event: 'Голосование по принятию поправок в Конституцию РФ (1 июля)', period: 'XXI век', era: 'modern', difficulty: 'medium', tags: ['политика', 'ключевая дата'] },

  // ===== ДОПОЛНИТЕЛЬНЫЕ ДАТЫ ДЛЯ ПОЛНОГО ПОКРЫТИЯ ЕГЭ =====

  // Древняя Русь (ancient)
  { id: 'c216', year: '945', event: 'Восстание древлян. Гибель князя Игоря', period: 'X в.', era: 'ancient', difficulty: 'medium', tags: ['восстания'] },
  { id: 'c217', year: '957', event: 'Посольство княгини Ольги в Константинополь. Принятие христианства Ольгой', period: 'X в.', era: 'ancient', difficulty: 'hard', tags: ['внешняя политика', 'религия'] },
  { id: 'c218', year: '972', event: 'Гибель князя Святослава в битве с печенегами', period: 'X в.', era: 'ancient', difficulty: 'medium', tags: ['войны'] },

  // Древняя Русь / Раздробленность (ancient / fragmentation)
  { id: 'c219', year: '1097', event: 'Любечский съезд князей. «Каждо да держит отчину свою»', period: 'XII в.', era: 'ancient', difficulty: 'medium', tags: ['политика', 'ключевая дата'] },
  { id: 'c220', year: '1113', event: 'Киевское восстание. Княжение Владимира Мономаха', period: 'XII в.', era: 'ancient', difficulty: 'medium', tags: ['восстания', 'плитика'] },
  { id: 'c221', year: '1147', event: 'Первое упоминание Москвы в летописи', period: 'XII в.', era: 'fragmentation', difficulty: 'medium', tags: ['ключевая дата'] },

  // Монгольское нашествие (invasion)
  { id: 'c222', year: '1239-1240', event: 'Разорение Южной Руси (Переяславль, Чернигов, Киев) монголами', period: 'XIII в.', era: 'invasion', difficulty: 'medium', tags: ['войны'] },
  { id: 'c223', year: '1242', event: 'Ледовое побище. Разгром немецких рыцарей на Чудском озере', period: 'XIII в.', era: 'invasion', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c224', year: '1262', event: 'Восстания против ордынского ига в Ростове, Суздале, Ярославле', period: 'XIII в.', era: 'invasion', difficulty: 'hard', tags: ['восстания'] },

  // Возвышение Москвы (moscow)
  { id: 'c225', year: '1325', event: 'Переезд митрополита Петра в Москву. Москва — церковный центр', period: 'XIV в.', era: 'moscow', difficulty: 'hard', tags: ['политика', 'религия'] },
  { id: 'c226', year: '1359-1389', event: 'Княжение Дмитрия Донского', period: 'XIV в.', era: 'moscow', difficulty: 'medium', tags: ['политика'] },
  { id: 'c227', year: '1395', event: 'Нашествие Тимура (Тамерлана) на Русь', period: 'XIV в.', era: 'moscow', difficulty: 'hard', tags: ['войны'] },

  // Московское царство (tsardom)
  { id: 'c228', year: '1469-1472', event: 'Путешествие Афанасия Никитина «Хожение за три моря»', period: 'XV в.', era: 'tsardom', difficulty: 'hard', tags: ['культура'] },
  { id: 'c229', year: '1478', event: 'Присоединение Новгорода к Московскому государству', period: 'XV в.', era: 'tsardom', difficulty: 'easy', tags: ['политика', 'ключевая дата'] },
  { id: 'c230', year: '1485', event: 'Присоединение Твери к Московскому государству', period: 'XV в.', era: 'tsardom', difficulty: 'medium', tags: ['политика'] },

  // Иван Грозный (grozny)
  { id: 'c231', year: '1550', event: 'Издание нового Судебника Ивана IV. Создание стрелецкого войска', period: 'XVI в.', era: 'grozny', difficulty: 'medium', tags: ['реформы'] },
  { id: 'c232', year: '1555-1556', event: 'Отмена кормлений. Губная и земская реформы', period: 'XVI в.', era: 'grozny', difficulty: 'hard', tags: ['реформы'] },
  { id: 'c233', year: '1581', event: 'Начало похода Ермака в Сибирь', period: 'XVI в.', era: 'grozny', difficulty: 'medium', tags: ['внешняя политика'] },

  // Смутное время (time_of_troubles)
  { id: 'c234', year: '1598-1605', event: 'Царствование Бориса Годунова', period: 'XVII в.', era: 'time_of_troubles', difficulty: 'medium', tags: ['политика'] },
  { id: 'c235', year: '1613', event: 'Избрание Михаила Романова на царство. Начало династии Романовых', period: 'XVII в.', era: 'time_of_troubles', difficulty: 'easy', tags: ['политика', 'ключевая дата'] },

  // Петровская эпоха (peter)
  { id: 'c236', year: '1696', event: 'Взятие Азова. Начало создания регулярного русского флота', period: 'XVIII в.', era: 'peter', difficulty: 'medium', tags: ['войны', 'ключевая дата'] },
  { id: 'c237', year: '1701', event: 'Открытие школы математических и навигацких наук в Москве', period: 'XVIII в.', era: 'peter', difficulty: 'hard', tags: ['реформы', 'образование'] },
  { id: 'c238', year: '1714', event: 'Указ о единонаследии. Учреждение фискалов', period: 'XVIII в.', era: 'peter', difficulty: 'hard', tags: ['реформы'] },
  { id: 'c239', year: '1722', event: 'Издание Табели о рангах', period: 'XVIII в.', era: 'peter', difficulty: 'medium', tags: ['реформы', 'ключевая дата'] },

  // Дворцовые перевороты (palace_coup)
  { id: 'c240', year: '1725', event: 'Откртие Академии наук в Санкт-Петербурге', period: 'XVIII в.', era: 'palace_coup', difficulty: 'medium', tags: ['наука'] },
  { id: 'c241', year: '1727', event: 'Падение А.Д. Меншиква. Высылка в Берёзов', period: 'XVIII в.', era: 'palace_coup', difficulty: 'hard', tags: ['политика'] },
  { id: 'c242', year: '1730-1740', event: 'Правление Анны Иоанновны. Бироновщина', period: 'XVIII в.', era: 'palace_coup', difficulty: 'medium', tags: ['политика'] },
  { id: 'c243', year: '1736', event: 'Русско-турецкая война (1735-1739). Взятие Перекопа и Бахчисарая', period: 'XVIII в.', era: 'palace_coup', difficulty: 'hard', tags: ['войны'] },
  { id: 'c244', year: '1741-1761', event: 'Правление Елизаветы Петровны', period: 'XVIII в.', era: 'palace_coup', difficulty: 'medium', tags: ['политика'] },
  { id: 'c245', year: '1755', event: 'Основание Московского университета (М.В. Ломоносов)', period: 'XVIII в.', era: 'palace_coup', difficulty: 'easy', tags: ['образование', 'ключевая дата'] },
  { id: 'c246', year: '1757', event: 'Участие России в Семилетней войне (1757-1762)', period: 'XVIII в.', era: 'palace_coup', difficulty: 'medium', tags: ['войны'] },
  { id: 'c247', year: '1762', event: 'Манифест «О вольности дворянской» (Петра III)', period: 'XVIII в.', era: 'palace_coup', difficulty: 'medium', tags: ['реформы'] },

  // Екатерина II (catherine)
  { id: 'c248', year: '1767', event: 'Созыв Уложенной комиссии Екатерины II', period: 'XVIII в.', era: 'catherine', difficulty: 'hard', tags: ['политика'] },
  { id: 'c249', year: '1773-1775', event: 'Восстание под предводительством Е.И. Пугачёва', period: 'XVIII в.', era: 'catherine', difficulty: 'easy', tags: ['воссания', 'ключевая дата'] },
  { id: 'c250', year: '1775', event: 'Губернская реформа Екатерины II', period: 'XVIII в.', era: 'catherine', difficulty: 'medium', tags: ['реформы'] },

  // Александр I (alexander1)
  { id: 'c251', year: '1803', event: 'Указ о «вольных хлебопашцах»', period: 'XIX в.', era: 'alexander1', difficulty: 'medium', tags: ['реформы'] },
  { id: 'c252', year: '1810', event: 'Учреждние Государственного совета (М.М. Сперанский)', period: 'XIX в.', era: 'alexander1', difficulty: 'medium', tags: ['реформы'] },

  // Николай I (nicholas1)
  { id: 'c253', year: '1830-1831', event: 'Восстание в Царстве Польском. Отмена польской Конституции', period: 'XIX в.', era: 'nicholas1', difficulty: 'hard', tags: ['восстания'] },
  { id: 'c254', year: '1837', event: 'Открытие первой в России железной дороги (Царскосельской)', period: 'XIX в.', era: 'nicholas1', difficulty: 'medium', tags: ['экономика'] },

  // Великие реформы (reforms)
  { id: 'c255', year: '1863-1864', event: 'Восстание в Польше. Перевод крестьян на выкуп', period: 'XIX в.', era: 'reforms', difficulty: 'hard', tags: ['восстания'] },
  { id: 'c256', year: '1877-1878', event: 'Русско-турецкая война. Освобождение Болгарии', period: 'XIX в.', era: 'reforms', difficulty: 'medium', tags: ['войны'] },
  { id: 'c257', year: '1881', event: 'Убийство Александра II народовольцами (1 марта)', period: 'XIX в.', era: 'reforms', difficulty: 'easy', tags: ['политика', 'ключевая дата'] },

  // Контрреформы (counterreforms)
  { id: 'c258', year: '1882', event: 'Учреждение Крестьянского поземельного банка', period: 'XIX в.', era: 'counterreforms', difficulty: 'hard', tags: ['экономика'] },
  { id: 'c259', year: '1897', event: 'Введение золотого рубля (реформа С.Ю. Витте)', period: 'XIX в.', era: 'counterreforms', difficulty: 'medium', tags: ['экономика', 'ключевая дата'] },

  // Революции и Гражданская война (revolution)
  { id: 'c260', year: '1905', event: 'Всеросийская Октябрьская политическая стачка', period: 'XX в.', era: 'revolution', difficulty: 'hard', tags: ['революция'] },
  { id: 'c261', year: '1906', event: 'Деятельность I Государственной думы', period: 'XX в.', era: 'revolution', difficulty: 'medium', tags: ['политика'] },
  { id: 'c262', year: '1918', event: 'Принятие Конституции РСФСР', period: 'XX в.', era: 'revolution', difficulty: 'medium', tags: ['политика'] },

  // СССР 1920-1930-е (ussr_early)
  { id: 'c263', year: '1928', event: 'Начало первого пятилетнего плана. Индустриализация', period: 'XX в.', era: 'ussr_early', difficulty: 'medium', tags: ['экономика', 'ключевая дата'] },
  { id: 'c264', year: '1930', event: 'Сплошная коллективизация. Ликвидация кулачества как класса', period: 'XX в.', era: 'ussr_early', difficulty: 'medium', tags: ['экономика', 'ключевая дата'] },

  // Великая Отечественная (wwii)
  { id: 'c265', year: '1941-1944', event: 'Блокада Ленинграда (8 сентября 1941 — 27 января 1944)', period: 'XX в.', era: 'wwii', difficulty: 'easy', tags: ['войны', 'ключевая дата'] },
  { id: 'c266', year: '1942', event: 'Приказ №227 «Ни шагу назад» (28 июля)', period: 'XX в.', era: 'wwii', difficulty: 'medium', tags: ['войны'] },

  // Послевоенный СССР (postwar)
  { id: 'c267', year: '1946', event: 'Постановление «О журналах «Звезда» и «Ленинград». Борьба с космополитизмом', period: 'XX в.', era: 'postwar', difficulty: 'hard', tags: ['культура', 'политика'] },
  { id: 'c268', year: '1947', event: 'Отмена карточной системы. Денежная реформа', period: 'XX в.', era: 'postwar', difficulty: 'medium', tags: ['экономика'] },
  { id: 'c269', year: '1952', event: 'XIX ъезд ВКП(б). Переименование ВКП(б) в КПСС', period: 'XX в.', era: 'postwar', difficulty: 'hard', tags: ['политика'] },

  // Оттепель (thaw)
  { id: 'c270', year: '1953', event: 'Назначение Г.М. Маленкова Председателем Совета Министров СССР', period: 'XX в.', era: 'thaw', difficulty: 'hard', tags: ['политика'] },
  { id: 'c271', year: '1964', event: 'Смещение Н.С. Хрущёва. Приход к власти Л.И. Брежнева', period: 'XX в.', era: 'thaw', difficulty: 'easy', tags: ['политика', 'ключевая дата'] },

  // Застой (stagnation)
  { id: 'c272', year: '1969', event: 'Пограничный конфликт на острове Даманский с Китаем', period: 'XX в.', era: 'stagnation', difficulty: 'hard', tags: ['войны'] },
  { id: 'c273', year: '1982', event: 'Принятие Продовольственной программы СССР', period: 'XX в.', era: 'stagnation', difficulty: 'hard', tags: ['экономика'] },

  // Перестройка (perestroika)
  { id: 'c274', year: '1986', event: 'Принятие закона «Об индивидуальной трудовой деятельности»', period: 'XX в.', era: 'perestroika', difficulty: 'hard', tags: ['экономика'] },

  // Новая Россия (modern)
  { id: 'c275', year: '1995', event: 'Принятие Федерального Закона «О выборах Президента РФ»', period: 'XX в.', era: 'modern', difficulty: 'hard', tags: ['политика'] },
  { id: 'c276', year: '2005', event: 'Монетизация льгот (Закон №122-ФЗ)', period: 'XXI в.', era: 'modern', difficulty: 'hard', tags: ['экономика'] },

  // ===== ДРЕВНЯЯ РУСЬ (ancient) =====
  { id: 'c277', year: 'IV–VII вв.', event: 'Великое переселение народов', period: 'IV–VII вв.', era: 'ancient', difficulty: 'easy', tags: ['ключевая дата'] },
  { id: 'c278', year: '862–879', event: 'Княжение Рюрика в Новгороде', period: 'IX в.', era: 'ancient', difficulty: 'medium', ruler: 'Рюрик', tags: ['правители'] },
  { id: 'c279', year: '879–912', event: 'Княжение Олега Вещего в Новгороде и Киеве', period: 'IX–X вв.', era: 'ancient', difficulty: 'medium', ruler: 'Олег', tags: ['правители'] },
  { id: 'c280', year: '911', event: 'Поход Олега на Царьград. Первый письменный договор Руси с Византией', period: 'X в.', era: 'ancient', difficulty: 'medium', ruler: 'Олег', tags: ['внешняя политика', 'Византия'] },
  { id: 'c281', year: '912–945', event: 'Княжение Игоря Рюриковича в Киеве', period: 'X в.', era: 'ancient', difficulty: 'medium', ruler: 'Игорь', tags: ['правители'] },
  { id: 'c282', year: '915', event: 'Заключение мира князя Игоря с печенегами', period: 'X в.', era: 'ancient', difficulty: 'hard', ruler: 'Игорь', tags: ['внешняя политика'] },
  { id: 'c283', year: '941', event: 'Первый поход князя Игоря на Византию', period: 'X в.', era: 'ancient', difficulty: 'hard', ruler: 'Игорь', tags: ['внешняя политика', 'Византия'] },
  { id: 'c284', year: '944', event: 'Второй поход князя Игоря на Византию. Заключение договора', period: 'X в.', era: 'ancient', difficulty: 'hard', ruler: 'Игорь', tags: ['внешняя политика', 'Византия'] },
  { id: 'c285', year: '945–962', event: 'Княжение Ольги (регентство при Святославе)', period: 'X в.', era: 'ancient', difficulty: 'medium', ruler: 'Ольга', tags: ['правители'] },
  { id: 'c286', year: '945–947', event: 'Налоговая реформа княгини Ольги (уроки и погосты)', period: 'X в.', era: 'ancient', difficulty: 'medium', ruler: 'Ольга', tags: ['реформы'] },
  { id: 'c287', year: '964–972', event: 'Княжение Святослава Игоревича', period: 'X в.', era: 'ancient', difficulty: 'medium', ruler: 'Святослав', tags: ['правители'] },
  { id: 'c288', year: '964–966', event: 'Походы Святослава: разгром Хазарского каганата, покорение вятичей, Волжской Булгарии', period: 'X в.', era: 'ancient', difficulty: 'hard', ruler: 'Святослав', tags: ['внешняя политика', 'войны'] },
  { id: 'c289', year: '968', event: 'Оборона Киева от печенегов (пока Святослав был в походе)', period: 'X в.', era: 'ancient', difficulty: 'hard', ruler: 'Святослав', tags: ['войны'] },
  { id: 'c290', year: '968–969', event: 'Походы Святослава на Дунайскую Болгарию', period: 'X в.', era: 'ancient', difficulty: 'hard', ruler: 'Святослав', tags: ['внешняя политика', 'войны'] },
  { id: 'c291', year: '970–971', event: 'Русско-византийская война Святослава', period: 'X в.', era: 'ancient', difficulty: 'hard', ruler: 'Святослав', tags: ['внешняя политика', 'войны'] },
  { id: 'c292', year: '971', event: 'Заключение мирного договора между Святославом и Византией у Доростола', period: 'X в.', era: 'ancient', difficulty: 'hard', ruler: 'Святослав', tags: ['внешняя политика'] },
  { id: 'c293', year: '978/980–1015', event: 'Княжение Владимира Святославича (Владимира Великого)', period: 'X–XI вв.', era: 'ancient', difficulty: 'medium', ruler: 'Владимир', tags: ['правители'] },
  { id: 'c294', year: '981', event: 'Поход Владимира на Польшу. Присоединение Червеня и Перемышля', period: 'X в.', era: 'ancient', difficulty: 'hard', ruler: 'Владимир', tags: ['внешняя политика'] },
  { id: 'c295', year: '1016–1018', event: 'Первое княжение Ярослава Мудрого в Киеве', period: 'XI в.', era: 'ancient', difficulty: 'hard', ruler: 'Ярослав Мудрый', tags: ['правители'] },
  { id: 'c296', year: '1019–1054', event: 'Княжение Ярослава Мудрого в Киеве', period: 'XI в.', era: 'ancient', difficulty: 'easy', ruler: 'Ярослав Мудрый', tags: ['правители'] },
  { id: 'c297', year: '1036', event: 'Разгром печенегов под Киевом Ярославом Мудрым', period: 'XI в.', era: 'ancient', difficulty: 'medium', ruler: 'Ярослав Мудрый', tags: ['войны'] },
  { id: 'c298', year: '1043', event: 'Последний поход Руси на Царьград (неудачный)', period: 'XI в.', era: 'ancient', difficulty: 'hard', ruler: 'Ярослав Мудрый', tags: ['внешняя политика', 'Византия'] },
  { id: 'c299', year: '1051', event: 'Назначение Илариона митрополитом Киевским (первый русский митрополит)', period: 'XI в.', era: 'ancient', difficulty: 'hard', ruler: 'Ярослав Мудрый', tags: ['религия'] },
  { id: 'c300', year: '1068', event: 'Битва на реке Альте с половцами. Восстание в Киеве', period: 'XI в.', era: 'ancient', difficulty: 'hard', tags: ['войны', 'восстания'] },
  { id: 'c301', year: '1103', event: 'Долобский съезд князей. Поход на половцев', period: 'XII в.', era: 'ancient', difficulty: 'hard', tags: ['политика'] },
  { id: 'c302', year: '1109', event: 'Поход русских князей на половцев', period: 'XII в.', era: 'ancient', difficulty: 'hard', tags: ['войны'] },
  { id: 'c303', year: '1111', event: 'Поход русских князей на Шарукань (половецкую степь)', period: 'XII в.', era: 'ancient', difficulty: 'hard', tags: ['войны'] },
  { id: 'c304', year: '1116', event: 'Поход Владимира Мономаха на половцев', period: 'XII в.', era: 'ancient', difficulty: 'hard', tags: ['войны'] },
  { id: 'c305', year: '1113–1125', event: 'Княжение Владимира Мономаха в Киеве', period: 'XII в.', era: 'ancient', difficulty: 'medium', ruler: 'Владимир Мономах', tags: ['правители'] },
  { id: 'c306', year: '1125–1132', event: 'Княжение Мстислава Великого в Киеве', period: 'XII в.', era: 'ancient', difficulty: 'medium', ruler: 'Мстислав Великий', tags: ['правители'] },
  { id: 'c307', year: '1136', event: 'Изгнание князя Всеволода Мстиславича из Новгорода. Начало Новгородской республики', period: 'XII в.', era: 'fragmentation', difficulty: 'hard', tags: ['политика'] },
  { id: 'c308', year: '1125–1157', event: 'Княжение Юрия Долгорукого (Ростово-Суздальское княжество)', period: 'XII в.', era: 'fragmentation', difficulty: 'hard', ruler: 'Юрий Долгорукий', tags: ['правители'] },
  { id: 'c309', year: '1153–1187', event: 'Княжение Ярослава Осмомысла в Галиче', period: 'XII в.', era: 'fragmentation', difficulty: 'hard', ruler: 'Ярослав Осмомысл', tags: ['правители'] },
  { id: 'c310', year: '1157–1174', event: 'Великое княжение Андрея Боголюбского (Владимирское княжество)', period: 'XII в.', era: 'fragmentation', difficulty: 'hard', ruler: 'Андрей Боголюбский', tags: ['правители'] },
  { id: 'c311', year: '1157', event: 'Перенос столицы Северо-Восточной Руси из Суздаля во Владимир', period: 'XII в.', era: 'fragmentation', difficulty: 'hard', ruler: 'Андрей Боголюбский', tags: ['политика'] },
  { id: 'c312', year: '1169', event: 'Взятие и разграбление Киева войсками Андрея Боголюбского', period: 'XII в.', era: 'fragmentation', difficulty: 'hard', ruler: 'Андрей Боголюбский', tags: ['войны'] },
  { id: 'c313', year: '1174', event: 'Убийство Андрея Боголюбского в результате заговора бояр', period: 'XII в.', era: 'fragmentation', difficulty: 'hard', ruler: 'Андрей Боголюбский', tags: ['политика'] },
  { id: 'c314', year: '1176–1212', event: 'Великое княжение Всеволода Юрьевича Большое Гнездо', period: 'XII–XIII вв.', era: 'fragmentation', difficulty: 'hard', ruler: 'Всеволод Большое Гнездо', tags: ['правители'] },
  { id: 'c315', year: '1199', event: 'Объединение Галицкой и Волынской земель под властью Романа Мстиславича', period: 'XII в.', era: 'fragmentation', difficulty: 'hard', tags: ['политика'] },
  { id: 'c316', year: '1199–1205', event: 'Правление Романа Мстиславича в Галицко-Волынской земле', period: 'XII–XIII вв.', era: 'fragmentation', difficulty: 'hard', ruler: 'Роман Мстиславич', tags: ['правители'] },
  { id: 'c317', year: '1205–1264', event: 'Княжение Даниила Романовича Галицкого', period: 'XIII в.', era: 'fragmentation', difficulty: 'hard', ruler: 'Даниил Галицкий', tags: ['правители'] },
  { id: 'c318', year: '1216', event: 'Липицкая битва (крупнейшая междоусобная битва)', period: 'XIII в.', era: 'fragmentation', difficulty: 'hard', tags: ['войны'] },

  // ===== МОНГОЛЬСКОЕ НАШЕСТВИЕ (invasion) =====
  { id: 'c319', year: '1237, декабрь', event: 'Взятие Рязани войсками Батыя', period: 'XIII в.', era: 'invasion', difficulty: 'medium', tags: ['войны', 'монголы'] },
  { id: 'c320', year: '1238, январь–февраль', event: 'Разгром монголами Коломны, Москвы, Суздаля, Владимира', period: 'XIII в.', era: 'invasion', difficulty: 'hard', tags: ['войны', 'монголы'] },
  { id: 'c321', year: '1239–1240', event: 'Нашествие монголов на Юго-Западную Русь (Переяславль, Чернигов)', period: 'XIII в.', era: 'invasion', difficulty: 'hard', tags: ['войны', 'монголы'] },
  { id: 'c322', year: '1240, декабрь', event: 'Взятие и разгром Киева войсками Батыя', period: 'XIII в.', era: 'invasion', difficulty: 'medium', tags: ['войны', 'монголы'] },
  { id: 'c323', year: '1241', event: 'Поход монголов на Польшу, Венгрию, Чехию', period: 'XIII в.', era: 'invasion', difficulty: 'hard', tags: ['войны', 'монголы'] },
  { id: 'c324', year: '1242, весна', event: 'Выход монголов к Адриатическому морю. Поворот на восток', period: 'XIII в.', era: 'invasion', difficulty: 'hard', tags: ['войны', 'монголы'] },
  { id: 'c325', year: '1242–1243', event: 'Образование государства Золотая Орда', period: 'XIII в.', era: 'invasion', difficulty: 'medium', tags: ['политика', 'монголы'] },

  // ===== ВОЗВЫШЕНИЕ МОСКВЫ (moscow) =====
  { id: 'c326', year: '1276–1303', event: 'Княжение Даниила Александровича в Москве (основание династии московских князей)', period: 'XIII в.', era: 'moscow', difficulty: 'hard', ruler: 'Даниил Московский', tags: ['правители'] },
  { id: 'c327', year: '1301', event: 'Присоединение Коломны к Московскому княжеству', period: 'XIV в.', era: 'moscow', difficulty: 'hard', ruler: 'Даниил Московский', tags: ['объединение'] },
  { id: 'c328', year: '1302', event: 'Присоединение Переяславского княжества к Москве', period: 'XIV в.', era: 'moscow', difficulty: 'hard', ruler: 'Иван I', tags: ['объединение'] },
  { id: 'c329', year: '1303–1325', event: 'Княжение Юрия Даниловича Московского', period: 'XIV в.', era: 'moscow', difficulty: 'hard', ruler: 'Юрий Данилович', tags: ['правители'] },
  { id: 'c330', year: '1325–1340', event: 'Княжение Ивана Калиты в Москве', period: 'XIV в.', era: 'moscow', difficulty: 'medium', ruler: 'Иван Калита', tags: ['правители'] },
  { id: 'c331', year: '1327', event: 'Антиордынское восстание в Твери против Чолхана (Щелкана)', period: 'XIV в.', era: 'moscow', difficulty: 'hard', tags: ['восстания'] },
  { id: 'c332', year: '1340–1353', event: 'Княжение Симеона Ивановича Гордого', period: 'XIV в.', era: 'moscow', difficulty: 'hard', ruler: 'Симеон Гордый', tags: ['правители'] },
  { id: 'c333', year: '1353–1359', event: 'Княжение Ивана II Ивановича Красного', period: 'XIV в.', era: 'moscow', difficulty: 'hard', ruler: 'Иван II Красный', tags: ['правители'] },
  { id: 'c334', year: '1359–1389', event: 'Княжение Дмитрия Ивановича Донского', period: 'XIV в.', era: 'moscow', difficulty: 'medium', ruler: 'Дмитрий Донской', tags: ['правители'] },
  { id: 'c335', year: '1368', event: 'Первый поход литовского князя Ольгерда на Москву («Литовщина»)', period: 'XIV в.', era: 'moscow', difficulty: 'hard', tags: ['войны'] },
  { id: 'c336', year: '1370', event: 'Второй поход Ольгерда на Москву', period: 'XIV в.', era: 'moscow', difficulty: 'hard', tags: ['войны'] },
  { id: 'c337', year: '1372', event: 'Третий поход Ольгерда на Москву. Любутское перемирие', period: 'XIV в.', era: 'moscow', difficulty: 'hard', tags: ['войны'] },
  { id: 'c338', year: '1377', event: 'Битва на реке Пьяне (поражение русских от ордынцев)', period: 'XIV в.', era: 'moscow', difficulty: 'hard', tags: ['войны'] },
  { id: 'c339', year: '1389–1425', event: 'Княжение Василия I Дмитриевича', period: 'XIV–XV вв.', era: 'moscow', difficulty: 'hard', ruler: 'Василий I', tags: ['правители'] },
  { id: 'c340', year: '1408', event: 'Нашествие ордынского темника Едигея на Русь', period: 'XV в.', era: 'moscow', difficulty: 'hard', tags: ['войны', 'Орда'] },

  // ===== МОСКОВСКОЕ ЦАРСТВО (tsardom) =====
  { id: 'c341', year: '1425–1453', event: 'Междоусобная война в Московском княжестве (Василий II vs Юрий и Шемяка)', period: 'XV в.', era: 'tsardom', difficulty: 'hard', tags: ['войны', 'политика'] },
  { id: 'c342', year: '1425–1462', event: 'Княжение Василия II Тёмного', period: 'XV в.', era: 'tsardom', difficulty: 'hard', ruler: 'Василий II', tags: ['правители'] },
  { id: 'c343', year: '1448', event: 'Провозглашение автокефалии Русской православной церкви', period: 'XV в.', era: 'tsardom', difficulty: 'hard', tags: ['религия'] },
  { id: 'c344', year: '1462–1505', event: 'Княжение (правление) Ивана III Великого', period: 'XV в.', era: 'tsardom', difficulty: 'medium', ruler: 'Иван III', tags: ['правители'] },
  { id: 'c345', year: '1503', event: 'Перемирие с Литвой. Присоединение Чернигова, Брянска и Гомеля', period: 'XVI в.', era: 'tsardom', difficulty: 'hard', ruler: 'Иван III', tags: ['внешняя политика'] },
  { id: 'c346', year: '1505–1533', event: 'Княжение Василия III Ивановича', period: 'XVI в.', era: 'tsardom', difficulty: 'medium', ruler: 'Василий III', tags: ['правители'] },
  { id: 'c347', year: '1514', event: 'Присоединение Смоленска к Московскому государству', period: 'XVI в.', era: 'tsardom', difficulty: 'medium', ruler: 'Василий III', tags: ['объединение'] },
  { id: 'c348', year: '1521', event: 'Присоединение Рязани к Московскому государству', period: 'XVI в.', era: 'tsardom', difficulty: 'hard', ruler: 'Василий III', tags: ['объединение'] },

  // ===== ИВАН ГРОЗНЫЙ (grozny) =====
  { id: 'c349', year: '1533–1584', event: 'Правление (великое княжение и царствование) Ивана IV Васильевича', period: 'XVI в.', era: 'grozny', difficulty: 'medium', ruler: 'Иван IV', tags: ['правители'] },
  { id: 'c350', year: '1533–1538', event: 'Регентство Елены Глинской при малолетнем Иване IV', period: 'XVI в.', era: 'grozny', difficulty: 'hard', tags: ['политика'] },
  { id: 'c351', year: '1535', event: 'Денежная реформа Елены Глинской (введение единой монеты — копейки)', period: 'XVI в.', era: 'grozny', difficulty: 'hard', tags: ['реформы'] },
  { id: 'c352', year: '1538–1547', event: 'Период боярского правления (борьба Шуйских и Бельских)', period: 'XVI в.', era: 'grozny', difficulty: 'hard', tags: ['политика'] },
  { id: 'c353', year: '1551', event: 'Стоглавый собор Русской православной церкви', period: 'XVI в.', era: 'grozny', difficulty: 'medium', tags: ['религия', 'реформы'] },
  { id: 'c354', year: '1569', event: 'Убийство митрополита Филиппа и князя Владимира Старицкого по приказу Ивана Грозного', period: 'XVI в.', era: 'grozny', difficulty: 'hard', tags: ['политика'] },
  { id: 'c355', year: '1570', event: 'Разгром Новгорода опричниками Ивана Грозного', period: 'XVI в.', era: 'grozny', difficulty: 'hard', tags: ['политика'] },
  { id: 'c356', year: '1571', event: 'Набег крымского хана Девлет-Гирея. Сожжение Москвы', period: 'XVI в.', era: 'grozny', difficulty: 'hard', tags: ['войны'] },
  { id: 'c357', year: '1572', event: 'Битва при Молодях (разгром Девлет-Гирея русскими войсками)', period: 'XVI в.', era: 'grozny', difficulty: 'hard', tags: ['войны'] },
  { id: 'c358', year: '1581–1582', event: 'Осада Пскова войсками Стефана Батория', period: 'XVI в.', era: 'grozny', difficulty: 'hard', tags: ['войны'] },
  { id: 'c359', year: '1582', event: 'Плюсское перемирие с Речью Посполитой (завершение Ливонской войны)', period: 'XVI в.', era: 'grozny', difficulty: 'hard', tags: ['внешняя политика'] },
  { id: 'c360', year: '1591', event: 'Гибель царевича Дмитрия в Угличе (Угличское дело)', period: 'XVI в.', era: 'grozny', difficulty: 'hard', tags: ['политика'] },
  { id: 'c361', year: '1597', event: 'Указ об «урочных летах» (5-летний сыск беглых крестьян)', period: 'XVI в.', era: 'grozny', difficulty: 'hard', tags: ['законы', 'крепостное право'] },

  // ===== СМУТНОЕ ВРЕМЯ (time_of_troubles) =====
  { id: 'c362', year: '1601–1603', event: 'Неурожайные годы. Великий голод в России', period: 'XVII в.', era: 'time_of_troubles', difficulty: 'hard', tags: ['политика'] },
  { id: 'c363', year: '1603', event: 'Восстание Хлопка Косолапа (голодные бунты)', period: 'XVII в.', era: 'time_of_troubles', difficulty: 'hard', tags: ['восстания'] },
  { id: 'c364', year: '1605–1606', event: 'Царствование Лжедмитрия I', period: 'XVII в.', era: 'time_of_troubles', difficulty: 'medium', tags: ['правители'] },
  { id: 'c365', year: '1606–1610', event: 'Царствование Василия Шуйского', period: 'XVII в.', era: 'time_of_troubles', difficulty: 'medium', ruler: 'Василий Шуйский', tags: ['правители'] },
  { id: 'c366', year: '1607', event: 'Уложение Василия Шуйского о крестьянах (15-летний сыск)', period: 'XVII в.', era: 'time_of_troubles', difficulty: 'hard', tags: ['законы', 'крепостное право'] },
  { id: 'c367', year: '1607–1609', event: 'Движение Лжедмитрия II (Тушинский вор)', period: 'XVII в.', era: 'time_of_troubles', difficulty: 'hard', tags: ['Смута'] },
  { id: 'c368', year: '1608–1610', event: 'Оборона Троице-Сергиева монастыря от войск Лжедмитрия II', period: 'XVII в.', era: 'time_of_troubles', difficulty: 'hard', tags: ['Смута', 'войны'] },
  { id: 'c369', year: '1609–1611', event: 'Оборона Смоленска от войск Сигизмунда III', period: 'XVII в.', era: 'time_of_troubles', difficulty: 'hard', tags: ['Смута', 'войны'] },
  { id: 'c370', year: '1610–1612', event: 'Семибоярщина (правление семи бояр во главе с Мстиславским)', period: 'XVII в.', era: 'time_of_troubles', difficulty: 'hard', tags: ['политика'] },

  // ===== ПЕРВЫЕ РОМАНОВЫ (early-romanovs) =====
  { id: 'c371', year: '1613–1645', event: 'Царствование Михаила Фёдоровича Романова', period: 'XVII в.', era: 'early-romanovs', difficulty: 'medium', ruler: 'Михаил Фёдорович', tags: ['правители'] },
  { id: 'c372', year: '1632–1634', event: 'Смоленская война с Речью Посполитой', period: 'XVII в.', era: 'early-romanovs', difficulty: 'hard', tags: ['войны'] },
  { id: 'c373', year: '1634', event: 'Поляновский мир с Речью Посполитой', period: 'XVII в.', era: 'early-romanovs', difficulty: 'hard', tags: ['внешняя политика'] },
  { id: 'c374', year: '1637–1642', event: 'Азовское осадное сидение донских казаков', period: 'XVII в.', era: 'early-romanovs', difficulty: 'hard', tags: ['войны'] },
  { id: 'c375', year: '1645–1676', event: 'Царствование Алексея Михайловича Тишайшего', period: 'XVII в.', era: 'early-romanovs', difficulty: 'medium', ruler: 'Алексей Михайлович', tags: ['правители'] },
  { id: 'c376', year: '1654–1667', event: 'Русско-польская война (за Украину и Белоруссию)', period: 'XVII в.', era: 'early-romanovs', difficulty: 'hard', tags: ['войны'] },
  { id: 'c377', year: '1667', event: 'Новоторговый устав (покровительственная политика)', period: 'XVII в.', era: 'early-romanovs', difficulty: 'hard', ruler: 'Алексей Михайлович', tags: ['экономика'] },
  { id: 'c378', year: '1668–1676', event: 'Соловецкое восстание (старообрядцев против реформ Никона)', period: 'XVII в.', era: 'early-romanovs', difficulty: 'hard', tags: ['восстания'] },
  { id: 'c379', year: '1676–1682', event: 'Царствование Фёдора Алексеевича', period: 'XVII в.', era: 'early-romanovs', difficulty: 'hard', ruler: 'Фёдор Алексеевич', tags: ['правители'] },
  { id: 'c380', year: '1676–1681', event: 'Русско-турецкая война. Чигиринские походы', period: 'XVII в.', era: 'early-romanovs', difficulty: 'hard', tags: ['войны'] },
  { id: 'c381', year: '1682', event: 'Отмена местничества (сожжение Разрядных книг)', period: 'XVII в.', era: 'early-romanovs', difficulty: 'hard', ruler: 'Фёдор Алексеевич', tags: ['реформы'] },
  { id: 'c382', year: '1682–1689', event: 'Регентство царевны Софьи Алексеевны', period: 'XVII в.', era: 'early-romanovs', difficulty: 'hard', tags: ['политика'] },
  { id: 'c383', year: '1686', event: 'Вечный мир с Речью Посполитой. Закрепление Левобережной Украины за Россией', period: 'XVII в.', era: 'early-romanovs', difficulty: 'hard', tags: ['внешняя политика'] },
  { id: 'c384', year: '1687', event: 'Поход князя В.В. Голицына на Крымское ханство (первый)', period: 'XVII в.', era: 'early-romanovs', difficulty: 'hard', tags: ['войны'] },
  { id: 'c385', year: '1689', event: 'Крымский поход В.В. Голицына (второй, неудачный)', period: 'XVII в.', era: 'early-romanovs', difficulty: 'hard', tags: ['войны'] },
  { id: 'c386', year: '1689', event: 'Нерчинский договор с Китаем (установление границы)', period: 'XVII в.', era: 'early-romanovs', difficulty: 'hard', tags: ['внешняя политика'] },

  // ===== ПЕТРОВСКАЯ ЭПОХА (peter) =====
  { id: 'c387', year: '1695', event: 'Первый Азовский поход Петра I (неудачный)', period: 'XVII в.', era: 'peter', difficulty: 'hard', tags: ['войны'] },
  { id: 'c388', year: '1696', event: 'Второй Азовский поход Петра I. Взятие Азова', period: 'XVII в.', era: 'peter', difficulty: 'medium', tags: ['войны'] },
  { id: 'c389', year: '1697–1698', event: 'Великое посольство Петра I в Западную Европу', period: 'XVII в.', era: 'peter', difficulty: 'medium', tags: ['внешняя политика'] },
  { id: 'c390', year: '1700, ноябрь', event: 'Поражение русских войск под Нарвой («Нарвская конфузия»)', period: 'XVIII в.', era: 'peter', difficulty: 'hard', tags: ['войны'] },
  { id: 'c391', year: '1702, октябрь', event: 'Взятие крепости Нотебург (Орешек) русскими войсками', period: 'XVIII в.', era: 'peter', difficulty: 'hard', tags: ['войны'] },
  { id: 'c392', year: '1705–1706', event: 'Восстание в Астрахани', period: 'XVIII в.', era: 'peter', difficulty: 'hard', tags: ['восстания'] },
  { id: 'c393', year: '1707–1708', event: 'Восстание под предводительством К. Булавина на Дону', period: 'XVIII в.', era: 'peter', difficulty: 'hard', tags: ['восстания'] },
  { id: 'c394', year: '1708, декабрь', event: 'Учреждение губерний (первая губернская реформа)', period: 'XVIII в.', era: 'peter', difficulty: 'medium', tags: ['реформы'] },
  { id: 'c395', year: '1711', event: 'Прутский поход Петра I против турок (неудачный)', period: 'XVIII в.', era: 'peter', difficulty: 'hard', tags: ['войны'] },
  { id: 'c396', year: '1720', event: 'Победа русского флота у острова Гренгам', period: 'XVIII в.', era: 'peter', difficulty: 'hard', tags: ['войны'] },
  { id: 'c397', year: '1722–1723', event: 'Каспийский (Персидский) поход Петра I', period: 'XVIII в.', era: 'peter', difficulty: 'hard', tags: ['войны'] },

  // ===== ДВОРЦОВЫЕ ПЕРЕВОРОТЫ (palace_coup) =====
  { id: 'c398', year: '1725–1727', event: 'Царствование (правление) Екатерины I Алексеевны', period: 'XVIII в.', era: 'palace_coup', difficulty: 'hard', ruler: 'Екатерина I', tags: ['правители'] },
  { id: 'c399', year: '1726', event: 'Создание Верховного тайного совета', period: 'XVIII в.', era: 'palace_coup', difficulty: 'hard', tags: ['политика'] },
  { id: 'c400', year: '1727–1730', event: 'Царствование Петра II Алексеевича', period: 'XVIII в.', era: 'palace_coup', difficulty: 'hard', tags: ['правители'] },
  { id: 'c401', year: '1730', event: 'Отмена указа о единонаследии', period: 'XVIII в.', era: 'palace_coup', difficulty: 'hard', tags: ['реформы'] },
  { id: 'c402', year: '1731', event: 'Принятие Младшего казахского жуза в подданство России', period: 'XVIII в.', era: 'palace_coup', difficulty: 'hard', tags: ['внешняя политика'] },
  { id: 'c403', year: '1735–1739', event: 'Русско-турецкая война (Белградский мир)', period: 'XVIII в.', era: 'palace_coup', difficulty: 'hard', tags: ['войны'] },
  { id: 'c404', year: '1740–1741', event: 'Правление Ивана VI Антоновича (регентство Бирона, затем Анны Леопольдовны)', period: 'XVIII в.', era: 'palace_coup', difficulty: 'hard', tags: ['правители'] },
  { id: 'c405', year: '1741–1761', event: 'Царствование Елизаветы Петровны', period: 'XVIII в.', era: 'palace_coup', difficulty: 'medium', ruler: 'Елизавета Петровна', tags: ['правители'] },
  { id: 'c406', year: '1753–1754', event: 'Таможенная реформа. Отмена внутренних таможенных пошлин', period: 'XVIII в.', era: 'palace_coup', difficulty: 'hard', tags: ['реформы', 'экономика'] },
  { id: 'c407', year: '1761–1762', event: 'Правление Петра III Фёдоровича', period: 'XVIII в.', era: 'palace_coup', difficulty: 'hard', tags: ['правители'] },

  // ===== ЕКАТЕРИНА II И ПАВЕЛ I (catherine) =====
  { id: 'c408', year: '1762–1796', event: 'Царствование Екатерины II Великой', period: 'XVIII в.', era: 'catherine', difficulty: 'medium', ruler: 'Екатерина II', tags: ['правители'] },
  { id: 'c409', year: '1765', event: 'Основание Вольного экономического общества', period: 'XVIII в.', era: 'catherine', difficulty: 'hard', tags: ['экономика'] },
  { id: 'c410', year: '1772', event: 'I раздел Речи Посполитой (между Россией, Пруссией и Австрией)', period: 'XVIII в.', era: 'catherine', difficulty: 'hard', tags: ['внешняя политика'] },
  { id: 'c411', year: '1787–1791', event: 'Русско-турецкая война (Ясский мир)', period: 'XVIII в.', era: 'catherine', difficulty: 'hard', tags: ['войны'] },
  { id: 'c412', year: '1788', event: 'Взятие Очакова русскими войсками', period: 'XVIII в.', era: 'catherine', difficulty: 'hard', tags: ['войны'] },
  { id: 'c413', year: '1793', event: 'II раздел Речи Посполитой', period: 'XVIII в.', era: 'catherine', difficulty: 'hard', tags: ['внешняя политика'] },
  { id: 'c414', year: '1794', event: 'Восстание Тадеуша Костюшко в Польше', period: 'XVIII в.', era: 'catherine', difficulty: 'hard', tags: ['восстания'] },
  { id: 'c415', year: '1795', event: 'III раздел Речи Посполитой. Прекращение существования Речи Посполитой', period: 'XVIII в.', era: 'catherine', difficulty: 'hard', tags: ['внешняя политика'] },
  { id: 'c416', year: '1796–1801', event: 'Царствование Павла I Петровича', period: 'XVIII в.', era: 'catherine', difficulty: 'medium', ruler: 'Павел I', tags: ['правители'] },
  { id: 'c417', year: '1797', event: 'Указ о престолонаследии (передача власти строго по мужской линии)', period: 'XVIII в.', era: 'catherine', difficulty: 'hard', tags: ['политика'] },
  { id: 'c418', year: '1797', event: 'Манифест о трёхдневной барщине', period: 'XVIII в.', era: 'catherine', difficulty: 'hard', tags: ['реформы'] },

  // ===== АЛЕКСАНДР I (alexander1) =====
  { id: 'c419', year: '1801–1825', event: 'Царствование Александра I Павловича', period: 'XIX в.', era: 'alexander1', difficulty: 'medium', ruler: 'Александр I', tags: ['правители'] },
  { id: 'c420', year: '1804–1813', event: 'Русско-иранская (персидская) война. Гюлистанский мир', period: 'XIX в.', era: 'alexander1', difficulty: 'hard', tags: ['войны'] },
  { id: 'c421', year: '1805, декабрь', event: 'Сражение при Аустерлице (поражение русско-австрийской армии от Наполеона)', period: 'XIX в.', era: 'alexander1', difficulty: 'hard', tags: ['войны'] },
  { id: 'c422', year: '1806–1812', event: 'Русско-турецкая война (Бухарестский мир)', period: 'XIX в.', era: 'alexander1', difficulty: 'hard', tags: ['войны'] },
  { id: 'c423', year: '1813–1814', event: 'Заграничные походы русской армии', period: 'XIX в.', era: 'alexander1', difficulty: 'medium', tags: ['войны'] },
  { id: 'c424', year: '1813, октябрь', event: '«Битва народов» под Лейпцигом', period: 'XIX в.', era: 'alexander1', difficulty: 'hard', tags: ['войны'] },
  { id: 'c425', year: '1814–1815', event: 'Венский конгресс (послевоенное устройство Европы)', period: 'XIX в.', era: 'alexander1', difficulty: 'hard', tags: ['внешняя политика'] },
  { id: 'c426', year: '1815', event: 'Дарование Конституции Царству Польскому', period: 'XIX в.', era: 'alexander1', difficulty: 'hard', tags: ['политика'] },
  { id: 'c427', year: '1821', event: 'Формирование Северного и Южного обществ декабристов', period: 'XIX в.', era: 'alexander1', difficulty: 'hard', tags: ['движения'] },

  // ===== НИКОЛАЙ I (nicholas1) =====
  { id: 'c428', year: '1825–1855', event: 'Царствование Николая I Павловича', period: 'XIX в.', era: 'nicholas1', difficulty: 'medium', ruler: 'Николай I', tags: ['правители'] },
  { id: 'c429', year: '1832', event: 'Издание Свода законов Российской империи М.М. Сперанского', period: 'XIX в.', era: 'nicholas1', difficulty: 'hard', tags: ['законы'] },
  { id: 'c430', year: '1833', event: 'Формулировка С.С. Уваровым теории «официальной народности»', period: 'XIX в.', era: 'nicholas1', difficulty: 'hard', tags: ['политика'] },
  { id: 'c431', year: '1836', event: 'Публикация «Философического письма» П.Я. Чаадаева', period: 'XIX в.', era: 'nicholas1', difficulty: 'hard', tags: ['культура'] },
  { id: 'c432', year: '1839–1843', event: 'Финансовая реформа Е.Ф. Канкрина (введение серебряного рубля)', period: 'XIX в.', era: 'nicholas1', difficulty: 'hard', tags: ['экономика'] },
  { id: 'c433', year: '1853, ноябрь', event: 'Синопское сражение (разгром турецкого флота адмиралом Нахимовым)', period: 'XIX в.', era: 'nicholas1', difficulty: 'hard', tags: ['войны'] },
  { id: 'c434', year: '1854–1855', event: 'Оборона Севастополя (первая оборона)', period: 'XIX в.', era: 'nicholas1', difficulty: 'hard', tags: ['войны'] },

  // ===== ВЕЛИКИЕ РЕФОРМЫ (reforms) =====
  { id: 'c435', year: '1855–1881', event: 'Царствование Александра II Николаевича', period: 'XIX в.', era: 'reforms', difficulty: 'medium', ruler: 'Александр II', tags: ['правители'] },
  { id: 'c436', year: '1863–1864', event: 'Восстание в Польше и Литве', period: 'XIX в.', era: 'reforms', difficulty: 'hard', tags: ['восстания'] },
  { id: 'c437', year: '1866', event: 'Покушение Д.В. Каракозова на Александра II', period: 'XIX в.', era: 'reforms', difficulty: 'hard', tags: ['политика'] },
  { id: 'c438', year: '1878', event: 'Берлинский конгресс. Пересмотр Сан-Стефанского мира', period: 'XIX в.', era: 'reforms', difficulty: 'hard', tags: ['внешняя политика'] },

  // ===== КОНТРРЕФОРМЫ (counterreforms) =====
  { id: 'c439', year: '1881–1894', event: 'Царствование Александра III Александровича', period: 'XIX в.', era: 'counterreforms', difficulty: 'medium', ruler: 'Александр III', tags: ['правители'] },
  { id: 'c440', year: '1884', event: 'Принятие нового Университетского устава (отмена автономии)', period: 'XIX в.', era: 'counterreforms', difficulty: 'hard', tags: ['политика'] },
  { id: 'c441', year: '1887', event: 'Циркуляр «о кухаркиных детях» (ограничение доступа к образованию)', period: 'XIX в.', era: 'counterreforms', difficulty: 'hard', tags: ['политика'] },
  { id: 'c442', year: '1894–1917', event: 'Царствование Николая II Александровича', period: 'XIX–XX вв.', era: 'counterreforms', difficulty: 'medium', ruler: 'Николай II', tags: ['правители'] },
  { id: 'c443', year: '1905–1907', event: 'Первая русская революция', period: 'XX в.', era: 'counterreforms', difficulty: 'medium', tags: ['революция'] },

  // ===== РЕВОЛЮЦИИ (revolution) =====
  { id: 'c444', year: '1906', event: '"Основные государственные законы" Российской империи', period: 'XX в.', era: 'revolution', difficulty: 'hard', tags: ['политика'] },

  // ===== СССР 1920-1930-е (ussr_early) =====
  { id: 'c445', year: '1929', event: 'Сплошная коллективизация. Начало массового раскулачивания', period: 'XX в.', era: 'ussr_early', difficulty: 'hard', tags: ['экономика', 'политика'] },
  { id: 'c446', year: '1932–1933', event: 'Голод в СССР (особенно на Украине, Северном Кавказе, Поволжье)', period: 'XX в.', era: 'ussr_early', difficulty: 'hard', tags: ['политика'] },

  // ===== ВЕЛИКАЯ ОТЕЧЕСТВЕННАЯ (wwii) =====
  { id: 'c447', year: '1941, июль–сентябрь', event: 'Смоленское сражение', period: 'XX в.', era: 'wwii', difficulty: 'hard', tags: ['войны'] },
  { id: 'c448', year: '1941, сентябрь', event: 'Начало блокады Ленинграда', period: 'XX в.', era: 'wwii', difficulty: 'medium', tags: ['войны'] },
  { id: 'c449', year: '1941, декабрь', event: 'Контрнаступление советских войск под Москвой', period: 'XX в.', era: 'wwii', difficulty: 'medium', tags: ['войны'] },
  { id: 'c450', year: '1942, июль–ноябрь', event: 'Оборонительный этап Сталинградской битвы', period: 'XX в.', era: 'wwii', difficulty: 'hard', tags: ['войны'] },
  { id: 'c451', year: '1942, август', event: 'Приказ №227 «Ни шагу назад!»', period: 'XX в.', era: 'wwii', difficulty: 'medium', tags: ['войны'] },
  { id: 'c452', year: '1943, июль', event: 'Битва под Прохоровкой (крупнейшее танковое сражение)', period: 'XX в.', era: 'wwii', difficulty: 'hard', tags: ['войны'] },
  { id: 'c453', year: '1944, январь', event: 'Полное снятие блокады Ленинграда', period: 'XX в.', era: 'wwii', difficulty: 'hard', tags: ['войны'] },
  { id: 'c454', year: '1944, июнь–август', event: 'Белорусская наступательная операция «Багратион»', period: 'XX в.', era: 'wwii', difficulty: 'hard', tags: ['войны'] },
  { id: 'c455', year: '1944, август', event: 'Ясско-Кишинёвская операция', period: 'XX в.', era: 'wwii', difficulty: 'hard', tags: ['войны'] },
  { id: 'c456', year: '1944, октябрь', event: 'Петсамо-Киркенесская операция (освобождение Заполярья)', period: 'XX в.', era: 'wwii', difficulty: 'hard', tags: ['войны'] },

  // ===== ПОСЛЕВОЕННЫЙ СССР (postwar) =====
  { id: 'c457', year: '1948', event: 'Дело Еврейского антифашистского комитета. Разгром «космополитов»', period: 'XX в.', era: 'postwar', difficulty: 'hard', tags: ['политика'] },
  { id: 'c458', year: '1949', event: 'Испытание первой советской атомной бомбы (РДС-1)', period: 'XX в.', era: 'postwar', difficulty: 'medium', tags: ['наука'] },
  { id: 'c459', year: '1951', event: 'Судебный процесс по «ленинградскому делу»', period: 'XX в.', era: 'postwar', difficulty: 'hard', tags: ['политика'] },
  { id: 'c460', year: '1952', event: 'XIX съезд ВКП(б). Переименование ВКП(б) в КПСС', period: 'XX в.', era: 'postwar', difficulty: 'hard', tags: ['политика'] },

  // ===== ОТТЕПЕЛЬ (thaw) =====
  { id: 'c461', year: '1953, сентябрь', event: 'Избрание Н.С. Хрущёва Первым секретарём ЦК КПСС', period: 'XX в.', era: 'thaw', difficulty: 'hard', tags: ['политика'] },
  { id: 'c462', year: '1956, февраль', event: 'XX съезд КПСС. Доклад Хрущёва о культе личности Сталина', period: 'XX в.', era: 'thaw', difficulty: 'medium', tags: ['политика'] },
  { id: 'c463', year: '1957', event: 'Всемирный фестиваль молодёжи и студентов в Москве', period: 'XX в.', era: 'thaw', difficulty: 'hard', tags: ['культура'] },
  { id: 'c464', year: '1961, апрель', event: 'Первый полёт человека в космос (Ю.А. Гагарин)', period: 'XX в.', era: 'thaw', difficulty: 'easy', tags: ['наука'] },
  { id: 'c465', year: '1961, октябрь', event: 'XXII съезд КПСС. Принятие новой Программы КПСС', period: 'XX в.', era: 'thaw', difficulty: 'hard', tags: ['политика'] },
  { id: 'c466', year: '1962', event: 'Новочеркасский расстрел рабочей демонстрации', period: 'XX в.', era: 'thaw', difficulty: 'hard', tags: ['политика'] },

  // ===== ЗАСТОЙ (stagnation) =====
  { id: 'c467', year: '1964–1982', event: 'Правление Л.И. Брежнева (Генеральный секретарь ЦК КПСС)', period: 'XX в.', era: 'stagnation', difficulty: 'medium', ruler: 'Брежнев', tags: ['правители'] },
  { id: 'c468', year: '1975, август', event: 'Подписание Заключительного акта Совещания по безопасности в Хельсинки', period: 'XX в.', era: 'stagnation', difficulty: 'hard', tags: ['внешняя политика'] },
  { id: 'c469', year: '1980, июль–август', event: 'XXII Олимпийские игры в Москве', period: 'XX в.', era: 'stagnation', difficulty: 'medium', tags: ['культура'] },
  { id: 'c470', year: '1982–1984', event: 'Правление Ю.В. Андропова (Генеральный секретарь)', period: 'XX в.', era: 'stagnation', difficulty: 'hard', ruler: 'Андропов', tags: ['политика'] },
  { id: 'c471', year: '1984–1985', event: 'Правление К.У. Черненко (Генеральный секретарь)', period: 'XX в.', era: 'stagnation', difficulty: 'hard', ruler: 'Черненко', tags: ['политика'] },
  { id: 'c472', year: '1985, март', event: 'Избрание М.С. Горбачёва Генеральным секретарём ЦК КПСС', period: 'XX в.', era: 'stagnation', difficulty: 'hard', ruler: 'Горбачёв', tags: ['политика'] },

  // ===== ПЕРЕСТРОЙКА (perestroika) =====
  { id: 'c473', year: '1985, апрель', event: 'Апрельский пленум ЦК КПСС. Курс на ускорение социально-экономического развития', period: 'XX в.', era: 'perestroika', difficulty: 'hard', tags: ['политика'] },
  { id: 'c474', year: '1988, июнь', event: 'XIX Всесоюзная партконференция. Начало политической реформы', period: 'XX в.', era: 'perestroika', difficulty: 'hard', tags: ['политика'] },
  { id: 'c475', year: '1989, май–июнь', event: 'I Съезд народных депутатов СССР', period: 'XX в.', era: 'perestroika', difficulty: 'hard', tags: ['политика'] },
  { id: 'c476', year: '1990, март', event: 'Избрание М.С. Горбачёва Президентом СССР', period: 'XX в.', era: 'perestroika', difficulty: 'hard', tags: ['политика'] },
  { id: 'c477', year: '1990, июнь', event: 'Принятие Декларации о государственном суверенитете РСФСР', period: 'XX в.', era: 'perestroika', difficulty: 'hard', tags: ['политика'] },
  { id: 'c478', year: '1991, март', event: 'Всесоюзный референдум о сохранении СССР', period: 'XX в.', era: 'perestroika', difficulty: 'hard', tags: ['политика'] },
  { id: 'c479', year: '1991, декабрь', event: 'Декларация о прекращении существования СССР (Алма-Атинская декларация)', period: 'XX в.', era: 'perestroika', difficulty: 'hard', tags: ['политика'] },

  // ===== НОВАЯ РОССИЯ (modern) =====
  { id: 'c480', year: '1992, январь', event: 'Либерализация цен (начало «шоковой терапии»)', period: 'XX в.', era: 'modern', difficulty: 'hard', tags: ['экономика'] },
  { id: 'c481', year: '1993, октябрь', event: 'Трагические события в Москве (расстрел Белого дома)', period: 'XX в.', era: 'modern', difficulty: 'hard', tags: ['политика'] },
  { id: 'c482', year: '1999, август', event: 'Начало Второй чеченской войны', period: 'XX в.', era: 'modern', difficulty: 'hard', tags: ['войны'] },
  { id: 'c483', year: '2001', event: 'Принятие Закона «О политических партиях»', period: 'XXI в.', era: 'modern', difficulty: 'hard', tags: ['политика'] },
  { id: 'c484', year: '2003', event: 'Введение Единого государственного экзамена (ЕГЭ) в экспериментальном порядке', period: 'XXI в.', era: 'modern', difficulty: 'hard', tags: ['политика'] },
  { id: 'c485', year: '2006', event: 'Начало реализации приоритетных национальных проектов', period: 'XXI в.', era: 'modern', difficulty: 'hard', tags: ['политика'] },
  { id: 'c486', year: '2006', event: 'Создание Парламентской ассамблеи ОДКБ', period: 'XXI в.', era: 'modern', difficulty: 'hard', tags: ['внешняя политика'] },
  { id: 'c487', year: '2007', event: 'Выступление В.В. Путина на Мюнхенской конференции по безопасности', period: 'XXI в.', era: 'modern', difficulty: 'hard', tags: ['внешняя политика'] },
  { id: 'c488', year: '2008, август', event: 'Вооружённый конфликт с Грузией (пятидневная война)', period: 'XXI в.', era: 'modern', difficulty: 'medium', tags: ['войны'] },
  { id: 'c489', year: '2008', event: 'Признание Россией независимости Абхазии и Южной Осетии', period: 'XXI в.', era: 'modern', difficulty: 'hard', tags: ['внешняя политика'] },
  { id: 'c490', year: '2011–2012', event: 'Массовые протестные акции в Москве («Болотная площадь»)', period: 'XXI в.', era: 'modern', difficulty: 'hard', tags: ['политика'] },
  { id: 'c491', year: '2015, сентябрь', event: 'Начало военной операции России в Сирии', period: 'XXI в.', era: 'modern', difficulty: 'hard', tags: ['войны'] },
  { id: 'c492', year: '2022, 24 февраля', event: 'Начало специальной военной операции (СВО) России на Украине', period: 'XXI в.', era: 'modern', difficulty: 'hard', tags: ['войны'] },
];

// ==================== ИСТОРИЧЕСКИЕ ЛИЧНОСТИ ====================

export interface HistoricalFigure {
  id: string;
  name: string;
  role: string;
  period: string;
  era: string;
  description: string;
  clue: string;
  relatedEvents: string[];
}

export const historicalFigures: HistoricalFigure[] = [
  { id: 'f1', name: 'Рюрик', role: 'Князь', period: 'IX в.', era: 'ancient', description: 'Варяжский князь, призванный на княжение в Новгород. Основатель династии, правившей на Руси более 700 лет.', clue: 'Варяг, основатель династии', relatedEvents: ['c1'] },
  { id: 'f2', name: 'Олег Вещий', role: 'Князь', period: 'IX–X вв.', era: 'ancient', description: 'Князь новгородский и киевский. Объединил Новгород и Киев, совершил успешный поход на Царьград.', clue: 'Объединил Новгород и Киев', relatedEvents: ['c2','c3'] },
  { id: 'f3', name: 'Владимир Святой', role: 'Великий князь', period: 'X в.', era: 'ancient', description: 'Великий князь киевский, крестивший Русь в 988 году. При нём Русь приняла православие как государственную религию.', clue: 'Креститель Руси', relatedEvents: ['c7','c8','c9'] },
  { id: 'f4', name: 'Ярослав Мудрый', role: 'Великий князь', period: 'XI в.', era: 'ancient', description: 'Великий князь киевский, при котором Русь достигла расцвета. Составил первый свод законов «Русская Правда».', clue: 'Автор «Русской Правды»', relatedEvents: ['c10','c11'] },
  { id: 'f5', name: 'Александр Невский', role: 'Князь', period: 'XIII в.', era: 'invasion', description: 'Князь новгородский, великий князь владимирский. Одержал победы над шведами (Невская битва) и немецкими рыцарями (Ледовое побоище).', clue: 'Невская битва и Ледовое побоище', relatedEvents: ['c23','c24','c25'] },
  { id: 'f6', name: 'Дмитрий Донской', role: 'Великий князь', period: 'XIV в.', era: 'moscow', description: 'Великий князь московский и владимирский. Одержал историческую победу над монголо-татарами в Куликовской битве.', clue: 'Победитель Куликовской битвы', relatedEvents: ['c29','c30'] },
  { id: 'f7', name: 'Иван III', role: 'Великий князь', period: 'XV в.', era: 'tsardom', description: 'Великий князь московский, «государь всея Руси». При нём было свергнуто ордынское иго и принят Судебник 1497 года.', clue: 'Сверг ордынское иго', relatedEvents: ['c34','c37','c38'] },
  { id: 'f8', name: 'Иван IV Грозный', role: 'Царь', period: 'XVI в.', era: 'grozny', description: 'Первый русский царь. Провёл реформы Избранной рады, затем учредил опричнину. При нём началось книгопечатание.', clue: 'Первый царь, опричнина', relatedEvents: ['c41','c42','c47','c48'] },
  { id: 'f9', name: 'Пётр I Великий', role: 'Император', period: 'XVIII в.', era: 'peter', description: 'Первый российский император, царь-реформатор. Создал регулярную армию и флот, основал Санкт-Петербург.', clue: 'Царь-реформатор, основатель Петербурга', relatedEvents: ['c68','c69','c72','c73','c74','c75','c76','c77'] },
  { id: 'f10', name: 'Екатерина II Великая', role: 'Императрица', period: 'XVIII в.', era: 'catherine', description: 'Российская императрица эпохи Просвещённого абсолютизма. Присоединила Крым и Новороссию.', clue: 'Просвещённый абсолютизм', relatedEvents: ['c83','c84','c86','c89','c90'] },
  { id: 'f11', name: 'Александр I', role: 'Император', period: 'XIX в.', era: 'alexander1', description: 'Российский император, «благословенный». В его правление Россия одержала победу в Отечественной войне 1812 года.', clue: 'Победитель Наполеона', relatedEvents: ['c94','c99','c102'] },
  { id: 'f12', name: 'Николай I', role: 'Император', period: 'XIX в.', era: 'nicholas1', description: 'Российский император, «железный». Начал правление с подавления восстания декабристов.', clue: 'Декабристы, «железный» император', relatedEvents: ['c104','c105','c106','c109'] },
  { id: 'f13', name: 'Александр II Освободитель', role: 'Император', period: 'XIX в.', era: 'reforms', description: 'Российский император, «освободитель». Отменил крепостное право, провёл Великие реформы.', clue: 'Отменил крепостное право', relatedEvents: ['c113','c114','c115','c116','c117'] },
  { id: 'f14', name: 'Николай II', role: 'Император', period: 'XIX–XX вв.', era: 'counterreforms', description: 'Последний российский император. В его правление произошли революции 1905 и 1917 годов.', clue: 'Последний император', relatedEvents: ['c126','c129','c132','c137'] },
  { id: 'f15', name: 'В.И. Ленин', role: 'Революционер', period: 'XIX–XX вв.', era: 'revolution', description: 'Лидер большевиков, основатель Советского государства. Организатор Октябрьской революции 1917 года.', clue: 'Основатель СССР', relatedEvents: ['c141','c142','c143','c145'] },
  { id: 'f16', name: 'И.В. Сталин', role: 'Генеральный секретарь', period: 'XX в.', era: 'ussr_early', description: 'Советский политический лидер. Провёл индустриализацию, коллективизацию и «Большой террор». Руководил СССР в годы Великой Отечественной войны.', clue: 'Вождь народов, индустриализация', relatedEvents: ['c150','c151','c152','c153','c154','c155'] },
  { id: 'f17', name: 'Н.С. Хрущёв', role: 'Генеральный секретарь', period: 'XX в.', era: 'thaw', description: 'Советский лидер эпохи «оттепели». Разоблачил культ личности Сталина на XX съезде КПСС. Запустил первого человека в космос.', clue: 'Оттепель, полёт Гагарина', relatedEvents: ['c177','c178','c179','c180'] },
  { id: 'f18', name: 'Ю.А. Гагарин', role: 'Космонавт', period: 'XX в.', era: 'thaw', description: 'Первый человек в космосе. Совершил исторический полёт на корабле «Восток-1» 12 апреля 1961 года.', clue: 'Первый космонавт', relatedEvents: ['c179'] },
  { id: 'f19', name: 'Л.И. Брежнев', role: 'Генеральный секретарь', period: 'XX в.', era: 'stagnation', description: 'Генеральный секретарь ЦК КПСС, правил 18 лет. Эпоха его правления получила название «застой».', clue: 'Эпоха застоя', relatedEvents: ['c184','c186','c187','c189','c190'] },
  { id: 'f20', name: 'М.С. Горбачёв', role: 'Президент СССР', period: 'XX в.', era: 'perestroika', description: 'Последний Генеральный секретарь ЦК КПСС, единственный Президент СССР. Начал перестройку и политику гласности.', clue: 'Перестройка, гласность', relatedEvents: ['c192','c193','c197','c198','c200'] },
  { id: 'f21', name: 'Б.Н. Ельцин', role: 'Президент', period: 'XX в.', era: 'modern', description: 'Первый Президент Российской Федерации. В его правление была принята Конституция 1993 года.', clue: 'Первый президент России', relatedEvents: ['c202','c203','c207'] },
  { id: 'f22', name: 'Сергий Радонежский', role: 'Святой', period: 'XIV в.', era: 'moscow', description: 'Русский православный святой, основатель Троице-Сергиевой лавры. Благословил Дмитрия Донского на Куликовскую битву.', clue: 'Благословил Донского на битву', relatedEvents: ['c29'] },
  { id: 'f23', name: 'М.В. Ломоносов', role: 'Учёный', period: 'XVIII в.', era: 'peter', description: 'Великий русский учёный-энциклопедист. Основатель Московского университета (МГУ).', clue: 'Основатель МГУ', relatedEvents: [] },
  { id: 'f24', name: 'Н.М. Карамзин', role: 'Историк', period: 'XVIII–XIX вв.', era: 'alexander1', description: 'Русский историк и писатель. Создатель «Истории государства Российского».', clue: 'Автор «Истории государства Российского»', relatedEvents: [] },

  // ===== ДОПОЛНИТЕЛЬНЫЕ ЛИЧНОСТИ =====
  { id: 'f25', name: 'Ольга', role: 'Княгиня', period: 'X в.', era: 'ancient', description: 'Княгиня киевская, жена Игоря. Первая на Руси приняла христианство. Провела налоговую реформу (уроки, погосты).', clue: 'Первая христианка на Руси', relatedEvents: ['c6'] },
  { id: 'f26', name: 'Святослав Игоревич', role: 'Князь', period: 'X в.', era: 'ancient', description: 'Великий князь киевский, полководец. Разгромил Хазарский каганат. Погиб в бою с печенегами.', clue: 'Князь-воин, разгромил Хазарию', relatedEvents: [] },
  { id: 'f27', name: 'Владимир Мономах', role: 'Великий князь', period: 'XII в.', era: 'fragmentation', description: 'Великий князь киевский. Организатор борьбы с половцами. Автор «Поучения Владимира Мономаха».', clue: 'Автор «Поучения»', relatedEvents: ['c14'] },
  { id: 'f28', name: 'Андрей Боголюбский', role: 'Великий князь', period: 'XII в.', era: 'fragmentation', description: 'Князь владимиро-суздальский, перенёс столицу во Владимир. Построил Успенский собор и Золотые ворота.', clue: 'Князь Владимирский, перенос центра', relatedEvents: ['c17'] },
  { id: 'f29', name: 'Иван Калита', role: 'Князь', period: 'XIV в.', era: 'moscow', description: 'Князь московский, получивший право собирать дань для Орды. Укрепил экономику Москвы.', clue: '«Денежный мешок»', relatedEvents: ['c26'] },
  { id: 'f30', name: 'Сергий Радонежский', role: 'Святой', period: 'XIV в.', era: 'moscow', description: 'Основатель Троице-Сергиевой лавры. Благословил Дмитрия Донского на Куликовскую битву.', clue: 'Благословил на Куликовскую битву', relatedEvents: ['c29'] },
  { id: 'f31', name: 'Аристотель Фиораванти', role: 'Архитектор', period: 'XV в.', era: 'tsardom', description: 'Итальянский зодчий, построивший Успенский собор Московского Кремля при Иване III.', clue: 'Строитель Успенского собора', relatedEvents: [] },
  { id: 'f32', name: 'Иван Фёдоров', role: 'Первопечатник', period: 'XVI в.', era: 'grozny', description: 'Русский первопечатник. В 1564 г. издал первую датированную книгу «Апостол».', clue: 'Первопечатник', relatedEvents: ['c48'] },
  { id: 'f33', name: 'Ермак Тимофеевич', role: 'Атаман', period: 'XVI в.', era: 'grozny', description: 'Казачий атаман, начавший освоение Сибири. Погиб в бою с ханом Кучумом.', clue: 'Покоритель Сибири', relatedEvents: [] },
  { id: 'f34', name: 'Кузьма Минин', role: 'Земский староста', period: 'XVII в.', era: 'time_of_troubles', description: 'Организатор Второго ополчения (1611–1612). Призывал народ жертвовать средства на освобождение Москвы.', clue: 'Организатор ополчения', relatedEvents: ['c54','c55','c56'] },
  { id: 'f35', name: 'Дмитрий Пожарский', role: 'Князь', period: 'XVII в.', era: 'time_of_troubles', description: 'Военачальник Второго ополчения. Руководил освобождением Москвы от поляков в 1612 г.', clue: 'Освободитель Москвы', relatedEvents: ['c55'] },
  { id: 'f36', name: 'Патриарх Никон', role: 'Патриарх', period: 'XVII в.', era: 'time_of_troubles', description: 'Патриарх Московский, проведший церковную реформу (1650–1660), приведшую к расколу.', clue: 'Церковная реформа, раскол', relatedEvents: [] },
  { id: 'f37', name: 'Протопоп Аввакум', role: 'Старообрядец', period: 'XVII в.', era: 'time_of_troubles', description: 'Лидер старообрядчества, противник реформ Никона. Сожжён за веру. Автор «Жития».', clue: 'Лидер старообрядцев', relatedEvents: [] },
  { id: 'f38', name: 'Емельян Пугачёв', role: 'Предводитель восстания', period: 'XVIII в.', era: 'catherine', description: 'Донской казак, предводитель крестьянской войны (1773–1775). Выдавал себя за Петра III.', clue: 'Крестьянская война, самозванец', relatedEvents: ['c249'] },
  { id: 'f39', name: 'А.В. Суворов', role: 'Полководец', period: 'XVIII в.', era: 'catherine', description: 'Великий русский полководец. Не проиграл ни одного сражения. Итальянский и Швейцарский походы.', clue: 'Непобедимый полководец', relatedEvents: ['c91','c93'] },
  { id: 'f40', name: 'М.И. Кутузов', role: 'Полководец', period: 'XIX в.', era: 'alexander1', description: 'Главнокомандующий русской армией в Отечественной войне 1812 г. Решение оставить Москву.', clue: 'Победитель Наполеона в 1812', relatedEvents: ['c99','c100'] },
  { id: 'f41', name: 'М.М. Сперанский', role: 'Государственный деятель', period: 'XIX в.', era: 'alexander1', description: 'Реформатор, автор проекта конституционной монархии. Создатель Государственного совета (1810).', clue: 'Реформатор, Госсовет', relatedEvents: ['c252'] },
  { id: 'f42', name: 'С.Ю. Витте', role: 'Государственный деятель', period: 'XIX–XX вв.', era: 'counterreforms', description: 'Министр финансов. Денежная реформа (золотой рубль, 1897). Строительство Транссиба.', clue: 'Золотой рубль, Транссиб', relatedEvents: ['c259'] },
  { id: 'f43', name: 'П.А. Столыпин', role: 'Премьер-министр', period: 'XX в.', era: 'revolution', description: 'Премьер-министр (1906–1911). Аграрная реформа, переселение крестьян, борьба с революцией.', clue: 'Аграрная реформа', relatedEvents: ['c133'] },
  { id: 'f44', name: 'Л.Д. Троцкий', role: 'Революционер', period: 'XX в.', era: 'revolution', description: 'Организатор Октябрьской революции, создатель Красной армии. Проиграл борьбу за власть Сталину.', clue: 'Создатель Красной армии', relatedEvents: [] },
  { id: 'f45', name: 'Г.К. Жуков', role: 'Полководец', period: 'XX в.', era: 'wwii', description: 'Маршал Советского Союза. Командовал обороной Москвы, брал Берлин. Четырежды Герой СССР.', clue: 'Маршал Победы', relatedEvents: [] },
  { id: 'f46', name: 'А.Д. Сахаров', role: 'Учёный, правозащитник', period: 'XX в.', era: 'stagnation', description: 'Физик-ядерщик, создатель водородной бомбы. Правозащитник, диссидент. Лауреат Нобелевской премии мира.', clue: 'Правозащитник, водородная бомба', relatedEvents: [] },
];

// ==================== ИСТОРИЧЕСКИЕ ЦИТАТЫ ====================

export interface HistoricalQuote {
  id: string;
  quote: string;
  author: string;
  context: string;
  period: string;
  era: string;
}

export const historicalQuotes: HistoricalQuote[] = [
  // Древняя Русь (IX–X вв.)
  { id: 'q1', quote: 'Иду на вас!', author: 'Святослав Игоревич', context: 'Из «Повести временных лет»: князь рассылал предупреждения врагам перед началом войны', period: 'X в.', era: 'ancient' },
  { id: 'q2', quote: 'Се же буди мати градом русским', author: 'Олег Вещий', context: 'Из «Повести временных лет», летописная фраза после взятия Киева в 882 г.', period: 'IX в.', era: 'ancient' },

  // Раздробленность (XII в.)
  { id: 'q3', quote: 'Хощу бо, рече, копие приломити конець поля Половецкаго', author: 'Князь Игорь Святославич', context: 'Из «Слова о полку Игореве» (1185 г.), решение о походе на половцев', period: 'XII в.', era: 'fragmentation' },

  // Монгольское нашествие (XIII в.)
  { id: 'q4', quote: 'Не в силе Бог, а в правде', author: 'Александр Невский', context: 'Житие Александра Невского, ответ новгородцам перед Невской битвой 1240 г.', period: 'XIII в.', era: 'invasion' },
  { id: 'q5', quote: 'Тяжело в ученье — легко в бою', author: 'А.В. Суворов', context: 'Из трактата «Наука побеждать» (1796 г.)', period: 'XVIII в.', era: 'catherine' },

  // Возвышение Москвы (XIV в.)
  { id: 'q6', quote: 'Князь великий Дмитрий Иванович… глаголя: «Братие, пора нам положити головы своя за веру христианскую»', author: 'Дмитрий Донской', context: 'Летописная повесть о Куликовской битве (1380 г.), обращение к войску', period: 'XIV в.', era: 'moscow' },

  // Иван Грозный (XVI в.)
  { id: 'q7', quote: 'Жаловати есмя своих холопей вольны, а и казнити вольны же', author: 'Иван IV Грозный', context: 'Из переписки с Андреем Курбским (1564 г.) — апология самодержавной власти', period: 'XVI в.', era: 'grozny' },

  // Смутное время (XVII в.)
  { id: 'q8', quote: 'Целуем крест: за Московское государство стояти и битися до смерти', author: 'К. Минин', context: 'Из грамоты II земского ополчения 1612 г., призыв к освобождению Москвы', period: 'XVII в.', era: 'time_of_troubles' },

  // Пётр I (XVIII в.)
  { id: 'q9', quote: 'А о Петре ведайте, что жизнь ему не дорога, жила бы только Россия в благоденствии и славе', author: 'Пётр I', context: 'Из предания о словах царя накануне Полтавской битвы (1709 г.)', period: 'XVIII в.', era: 'peter' },

  // Екатерина II (XVIII в.)
  { id: 'q10', quote: 'Победителей не судят', author: 'Екатерина II', context: 'Фраза из письма императрицы к графу П.А. Румянцеву после победы над турками при Кагуле (1770 г.)', period: 'XVIII в.', era: 'catherine' },

  // Александр I, Отечественная война (XIX в.)
  { id: 'q11', quote: 'С потерею Москвы не потеряна ещё Россия', author: 'М.И. Кутузов', context: 'Из речи на совете в Филях 13 сентября 1812 г. (запись А.П. Ермолова)', period: 'XIX в.', era: 'alexander1' },

  // Николай I (XIX в.)
  { id: 'q12', quote: 'Самодержавие составляет главное условие политического существования России', author: 'Николай I', context: 'Из манифеста 1826 г. по случаю коронации', period: 'XIX в.', era: 'nicholas1' },

  // Великие реформы (XIX в.)
  { id: 'q13', quote: 'Лучше отменить крепостное право сверху, нежели дождаться, когда оно само начнёт отменяться снизу', author: 'Александр II', context: 'Из речи перед представителями московского дворянства 30 марта 1856 г.', period: 'XIX в.', era: 'reforms' },

  // Контрреформы / поздняя империя (XIX в.)
  { id: 'q14', quote: 'Россия сосредоточивается', author: 'А.М. Горчаков', context: 'Из циркулярной депеши министра иностранных дел от 21 сентября 1856 г. о внешней политике после Крымской войны', period: 'XIX в.', era: 'counterreforms' },

  // Революция (XX в.)
  { id: 'q15', quote: 'Есть такая партия!', author: 'В.И. Ленин', context: 'Из речи на II Всероссийском съезде Советов 25 октября 1917 г. (по газетному отчёту)', period: 'XX в.', era: 'revolution' },

  // СССР 1920–1930-е
  { id: 'q16', quote: 'Кадры решают всё', author: 'И.В. Сталин', context: 'Из выступления на выпуске академиков Красной Армии 4 мая 1935 г.', period: 'XX в.', era: 'ussr_early' },

  // Великая Отечественная война (1941–1945)
  { id: 'q17', quote: 'Наше дело правое. Враг будет разбит. Победа будет за нами', author: 'В.М. Молотов', context: 'Из обращения к советскому народу 22 июня 1941 г. (текст утверждён Сталиным)', period: 'XX в.', era: 'wwii' },

  // Оттепель (XX в.)
  { id: 'q18', quote: 'Поехали!', author: 'Ю.А. Гагарин', context: 'Из переговоров с Центром управления полётом при старте корабля «Восток-1» 12 апреля 1961 г.', period: 'XX в.', era: 'thaw' },

  // Застой (XX в.)
  { id: 'q19', quote: 'Экономика должна быть экономной', author: 'Л.И. Брежнев', context: 'Из Отчётного доклада ЦК КПСС XXVI съезду партии 23 февраля 1981 г.', period: 'XX в.', era: 'stagnation' },

  // Перестройка / распад (XX в.)
  { id: 'q20', quote: 'Я с большим уважением думал о Вас, и прошу Вас хорошо ко мне относиться', author: 'М.С. Горбачёв', context: 'Из выступления по телевидению 18 августа 1991 г. (во время событий ГКЧП, обращение к народу)', period: 'XX в.', era: 'perestroika' },
];

// ==================== УРОКИ ====================

export const lessons: Lesson[] = [
  // Древняя Русь (IX–X вв.)
  { id: 'l1', title: 'Призвание варягов', era: 'ancient', eraIndex: 0, description: 'Рюрик, Олег, Игорь', cardIds: ['c1','c2','c3','c4','c277','c278','c279','c280'], type: 'core', xpReward: 20 },
  { id: 'l2', title: 'Первые князья', era: 'ancient', eraIndex: 0, description: 'Ольга, Святослав, Владимир', cardIds: ['c5','c6','c7','c8','c9','c281','c282','c283','c284','c285','c286','c287','c288','c289','c290','c291','c292','c293','c294'], type: 'core', xpReward: 20 },
  { id: 'l3', title: 'Крещение Руси', era: 'ancient', eraIndex: 0, description: 'Ключевые события', cardIds: ['c7','c8','c9'], type: 'core', xpReward: 25 },
  { id: 'l4', title: 'Ярослав Мудрый', era: 'ancient', eraIndex: 0, description: 'Расцвет Киевской Руси', cardIds: ['c10','c11','c295','c296','c297','c298','c299'], type: 'core', xpReward: 20 },
  { id: 'l3b', title: 'Битва за Древнюю Русь', era: 'ancient', eraIndex: 0, description: 'Финальное испытание', cardIds: ['c1','c2','c3','c4','c5','c6','c7','c8','c9','c10','c11','c277','c278','c279','c280','c281','c282','c283','c284','c285','c286','c287','c288','c289','c290','c291','c292','c293','c294','c295','c296','c297','c298','c299'], type: 'boss', unlockRequirement: 'l4', xpReward: 35 },

  // Раздробленность (XI–XII вв.)
  { id: 'l5', title: 'Начало раздробленности', era: 'fragmentation', eraIndex: 1, description: 'Любечский съезд — Мстислав', cardIds: ['c13','c14','c15','c16','c300','c301','c302','c303','c304','c305','c306','c307','c308','c309','c310','c311','c312','c313','c314','c315','c316','c317','c318'], type: 'core', xpReward: 20 },
  { id: 'l5b', title: 'Эпоха раздробленности', era: 'fragmentation', eraIndex: 1, description: 'Финальное испытание', cardIds: ['c12','c13','c14','c15','c16','c17','c18','c300','c301','c302','c303','c304','c305','c306','c307','c308','c309','c310','c311','c312','c313','c314','c315','c316','c317','c318'], type: 'boss', unlockRequirement: 'l5', xpReward: 35 },

  // Нашествие (XIII в.)
  { id: 'l6', title: 'Монгольское нашествие', era: 'invasion', eraIndex: 2, description: 'Батый, Калка, Сить', cardIds: ['c19','c20','c21','c22','c23','c319','c320','c321','c322','c323','c324','c325'], type: 'core', xpReward: 20 },
  { id: 'l7', title: 'Борьба с Западом', era: 'invasion', eraIndex: 2, description: 'Невский, Ледовое побоище', cardIds: ['c22','c23','c24','c25'], type: 'core', xpReward: 20 },
  { id: 'l7b', title: 'Натиск с Востока и Запада', era: 'invasion', eraIndex: 2, description: 'Финальное испытание', cardIds: ['c19','c20','c21','c22','c23','c24','c25','c319','c320','c321','c322','c323','c324','c325'], type: 'boss', unlockRequirement: 'l7', xpReward: 35 },

  // Возвышение Москвы (XIV в.)
  { id: 'l8', title: 'Возвышение Москвы', era: 'moscow', eraIndex: 3, description: 'Иван Калита — Дмитрий Донской', cardIds: ['c26','c27','c28','c29','c326','c327','c328','c329','c330','c331','c332','c333','c334','c335','c336','c337','c338','c339','c340'], type: 'core', xpReward: 20 },
  { id: 'l9', title: 'Куликовская битва', era: 'moscow', eraIndex: 3, description: 'Донской, Тамерлан', cardIds: ['c29','c30','c31','c32'], type: 'core', xpReward: 25 },
  { id: 'l9b', title: 'Москва собирает земли', era: 'moscow', eraIndex: 3, description: 'Финальное испытание', cardIds: ['c26','c27','c28','c29','c30','c31','c32','c326','c327','c328','c329','c330','c331','c332','c333','c334','c335','c336','c337','c338','c339','c340'], type: 'boss', unlockRequirement: 'l9', xpReward: 35 },

  // Московское царство (XV в.)
  { id: 'l10', title: 'Иван III', era: 'tsardom', eraIndex: 4, description: 'Объединение земель', cardIds: ['c33','c34','c35','c36','c37','c341','c342','c343','c344','c345','c346','c347','c348'], type: 'core', xpReward: 20 },
  { id: 'l11', title: 'Стояние на Угре', era: 'tsardom', eraIndex: 4, description: 'Конец ига, Судебник', cardIds: ['c37','c38','c39','c40'], type: 'core', xpReward: 25 },
  { id: 'l11b', title: 'Создние единого государства', era: 'tsardom', eraIndex: 4, description: 'Финальное испытание', cardIds: ['c33','c34','c35','c36','c37','c38','c39','c40'], type: 'boss', unlockRequirement: 'l11', xpReward: 35 },

  // Иван Грозный (XVI в.)
  { id: 'l12', title: 'Реформы Избранной рады', era: 'grozny', eraIndex: 5, description: 'Венчание, Земский собор, Судебник', cardIds: ['c41','c42','c43','c44','c45','c46','c349','c350','c351','c352','c353'], type: 'core', xpReward: 20 },
  { id: 'l13', title: 'Опричнина', era: 'grozny', eraIndex: 5, description: 'Опричнина, Ливонская война', cardIds: ['c47','c48','c49','c50','c51','c354','c355','c356','c357','c358','c359','c360','c361'], type: 'core', xpReward: 25 },
  { id: 'l13b', title: 'Эпоха Грозного', era: 'grozny', eraIndex: 5, description: 'Финальное испытание', cardIds: ['c41','c42','c43','c44','c45','c46','c47','c48','c49','c50','c51','c349','c350','c351','c352','c353','c354','c355','c356','c357','c358','c359','c360','c361'], type: 'boss', unlockRequirement: 'l13', xpReward: 35 },

  // Смутное время (1598-1618)
  { id: 'l14', title: 'Смута', era: 'time_of_troubles', eraIndex: 6, description: 'Лжедмитрий, Болотников', cardIds: ['c52','c53','c54','c55','c362','c363','c364','c365','c366','c367','c368','c369','c370'], type: 'core', xpReward: 20 },
  { id: 'l14b', title: 'Конец Смуты', era: 'time_of_troubles', eraIndex: 6, description: 'Финальное испытание', cardIds: ['c52','c53','c54','c55','c56','c57','c58','c362','c363','c364','c365','c366','c367','c368','c369','c370'], type: 'boss', unlockRequirement: 'l14', xpReward: 35 },

  // Первые Романовы (1613-1698)
  { id: 'l15', title: 'Первые Романовы', era: 'early-romanovs', eraIndex: 7, description: 'Соборное уложение, Переяславская рада', cardIds: ['c59','c60','c61','c62','c63','c64','c371','c372','c373','c374','c375','c376','c377','c378','c379','c380','c381','c382','c383','c384','c385','c386'], type: 'core', xpReward: 25 },
  { id: 'l15b', title: 'Бунташный век', era: 'early-romanovs', eraIndex: 7, description: 'Финальное испытание', cardIds: ['c59','c60','c61','c62','c63','c64','c65','c66','c67','c371','c372','c373','c374','c375','c376','c377','c378','c379','c380','c381','c382','c383','c384','c385','c386'], type: 'boss', unlockRequirement: 'l15', xpReward: 40 },

  // Петровская эпоха (XVIII в.)
  { id: 'l16', title: 'Начало Северной войны', era: 'peter', eraIndex: 8, description: 'Полтава, Лесная', cardIds: ['c68','c69','c70','c71','c72','c387','c388','c389','c390','c391','c392','c393','c394','c395','c396','c397'], type: 'core', xpReward: 20 },
  { id: 'l17', title: 'Реформы Петра I', era: 'peter', eraIndex: 8, description: 'Сенат, коллегии, Табель', cardIds: ['c72','c73','c74','c75','c76','c77'], type: 'core', xpReward: 25 },
  { id: 'l17b', title: 'Петровская модернизация', era: 'peter', eraIndex: 8, description: 'Финальное испытание', cardIds: ['c68','c69','c70','c71','c72','c73','c74','c75','c76','c77','c387','c388','c389','c390','c391','c392','c393','c394','c395','c396','c397'], type: 'boss', unlockRequirement: 'l17', xpReward: 35 },

  // Дворцовые перевороты
  { id: 'l18', title: 'Дворцовые перевороты', era: 'palace_coup', eraIndex: 9, description: 'Эпоха переворотов', cardIds: ['c78','c79','c80','c81','c82','c398','c399','c400','c401','c402','c403','c404','c405','c406','c407'], type: 'core', xpReward: 25 },
  { id: 'l19', title: 'Семилетняя война', era: 'palace_coup', eraIndex: 9, description: 'Война и наука', cardIds: ['c78','c79','c80','c81','c82','c398','c399','c400','c401','c402','c403','c404','c405','c406','c407'], type: 'core', xpReward: 25 },

  // Екатерина Великая
  { id: 'l20', title: 'Екатерина II', era: 'catherine', eraIndex: 10, description: 'Просвещённый абсолютизм', cardIds: ['c83','c84','c85','c86','c87','c88'], type: 'core', xpReward: 20 },
  { id: 'l21', title: 'Внешняя политика Екатерины', era: 'catherine', eraIndex: 10, description: 'Крым, Измаил', cardIds: ['c88','c89','c90','c91','c92','c93'], type: 'core', xpReward: 25 },
  { id: 'l21b', title: 'Век Екатерины', era: 'catherine', eraIndex: 10, description: 'Финальное испытание', cardIds: ['c83','c84','c85','c86','c87','c88','c89','c90','c91','c92','c93'], type: 'boss', unlockRequirement: 'l21', xpReward: 35 },

  // Александр I
  { id: 'l22', title: 'Либеральные реформы', era: 'alexander1', eraIndex: 11, description: 'Министерства, Сперанский', cardIds: ['c94','c95','c96','c97','c98'], type: 'core', xpReward: 20 },
  { id: 'l23', title: 'Отечественная война 1812 г.', era: 'alexander1', eraIndex: 11, description: 'Бородино, декабристы', cardIds: ['c99','c100','c101','c102','c103'], type: 'core', xpReward: 25 },
  { id: 'l23b', title: 'Эпоха Александра I', era: 'alexander1', eraIndex: 11, description: 'Финальное испытание', cardIds: ['c94','c95','c96','c97','c98','c99','c100','c101','c102','c103'], type: 'boss', unlockRequirement: 'l23', xpReward: 35 },

  // Николай I
  { id: 'l24', title: 'Николай I', era: 'nicholas1', eraIndex: 12, description: 'Декабристы, III отделение', cardIds: ['c104','c105','c106','c107','c108'], type: 'core', xpReward: 20 },
  { id: 'l25', title: 'Крымская война', era: 'nicholas1', eraIndex: 12, description: 'Война и железные дороги', cardIds: ['c109','c110','c111','c112'], type: 'core', xpReward: 25 },
  { id: 'l25b', title: 'Эпоха Николая I', era: 'nicholas1', eraIndex: 12, description: 'Финальное испытание', cardIds: ['c104','c105','c106','c107','c108','c109','c110','c111','c112'], type: 'boss', unlockRequirement: 'l25', xpReward: 35 },

  // Великие реформы
  { id: 'l26', title: 'Отмена крепостного права', era: 'reforms', eraIndex: 13, description: '1861 г., земская реформа', cardIds: ['c113','c114','c115','c116'], type: 'core', xpReward: 20 },
  { id: 'l27', title: 'Реформы 1860-1870-х', era: 'reforms', eraIndex: 13, description: 'Городская, военная реформы', cardIds: ['c117','c118','c119','c120','c121'], type: 'core', xpReward: 25 },
  { id: 'l27b', title: 'Великие реформы', era: 'reforms', eraIndex: 13, description: 'Финальное испытание', cardIds: ['c113','c114','c115','c116','c117','c118','c119','c120','c121'], type: 'boss', unlockRequirement: 'l27', xpReward: 35 },

  // Контрреформы
  { id: 'l28', title: 'Александр III', era: 'counterreforms', eraIndex: 14, description: 'Контрреформы', cardIds: ['c122','c123','c124','c125'], type: 'core', xpReward: 20 },
  { id: 'l29', title: 'Начало правления Николая II', era: 'counterreforms', eraIndex: 14, description: 'Витте, РСДРП, война', cardIds: ['c126','c127','c128','c129','c130','c131'], type: 'core', xpReward: 25 },
  { id: 'l29b', title: 'Конец XIX — начало XX', era: 'counterreforms', eraIndex: 14, description: 'Финальное испытание', cardIds: ['c122','c123','c124','c125','c126','c127','c128','c129','c130','c131'], type: 'boss', unlockRequirement: 'l29', xpReward: 35 },

  // Революции
  { id: 'l30', title: 'Революция 1905 г.', era: 'revolution', eraIndex: 15, description: 'Манифест 17 октября', cardIds: ['c132','c133','c134','c135','c136'], type: 'core', xpReward: 20 },
  { id: 'l31', title: '1917 год', era: 'revolution', eraIndex: 15, description: 'Февраль — Октябрь', cardIds: ['c137','c138','c139','c140','c141','c142','c143','c144'], type: 'core', xpReward: 25 },
  { id: 'l31b', title: 'Революция и Гражданская война', era: 'revolution', eraIndex: 15, description: 'Финальное испытание', cardIds: ['c132','c133','c134','c135','c136','c137','c138','c139','c140','c141','c142','c143','c144'], type: 'boss', unlockRequirement: 'l31', xpReward: 40 },

  // СССР 1920-1930-е
  { id: 'l32', title: 'СССР в 1920-е', era: 'ussr_early', eraIndex: 16, description: 'НЭП, образование СССР', cardIds: ['c145','c146','c147','c148','c149'], type: 'core', xpReward: 20 },
  { id: 'l33', title: 'Индустриализация и репрессии', era: 'ussr_early', eraIndex: 16, description: 'Пятилетки, Большой террор', cardIds: ['c150','c151','c152','c153','c154','c155','c156'], type: 'core', xpReward: 25 },
  { id: 'l33b', title: 'Сталинский СССР', era: 'ussr_early', eraIndex: 16, description: 'Финальное испытание', cardIds: ['c145','c146','c147','c148','c149','c150','c151','c152','c153','c154','c155','c156'], type: 'boss', unlockRequirement: 'l33', xpReward: 40 },

  // Великая Отечественная
  { id: 'l34', title: '1941 — трагедия и мужество', era: 'wwii', eraIndex: 17, description: 'Начало войны, блокада', cardIds: ['c157','c158','c159','c160','c161'], type: 'core', xpReward: 20 },
  { id: 'l35', title: 'Коренной перелом', era: 'wwii', eraIndex: 17, description: 'Сталинград, Курск', cardIds: ['c162','c163','c164','c165','c166','c167','c168','c169'], type: 'core', xpReward: 25 },
  { id: 'l35b', title: 'Великая Отечественная война', era: 'wwii', eraIndex: 17, description: 'Финальное испытание', cardIds: ['c157','c158','c159','c160','c161','c162','c163','c164','c165','c166','c167','c168','c169'], type: 'boss', unlockRequirement: 'l35', xpReward: 40 },

  // Послевоенный СССР
  { id: 'l36', title: 'Послевоенное восстановление', era: 'postwar', eraIndex: 18, description: 'Атомная бомба, СЭВ', cardIds: ['c170','c171','c172','c173'], type: 'core', xpReward: 25 },
  { id: 'l36b', title: 'Холодная война', era: 'postwar', eraIndex: 18, description: 'Финальное испытание', cardIds: ['c170','c171','c172','c173'], type: 'boss', unlockRequirement: 'l36', xpReward: 35 },

  // Оттепель
  { id: 'l37', title: 'Хрущёвская оттепель', era: 'thaw', eraIndex: 19, description: 'XX съезд, космос', cardIds: ['c174','c175','c176','c177','c178'], type: 'core', xpReward: 20 },
  { id: 'l38', title: 'Внешняя политика оттепели', era: 'thaw', eraIndex: 19, description: 'арибский кризис', cardIds: ['c179','c180','c181','c182','c183'], type: 'core', xpReward: 25 },
  { id: 'l38b', title: 'Оттепель', era: 'thaw', eraIndex: 19, description: 'Финальное испытание', cardIds: ['c174','c175','c176','c177','c178','c179','c180','c181','c182','c183'], type: 'boss', unlockRequirement: 'l38', xpReward: 35 },

  // Застой
  { id: 'l39', title: 'Эпоха Брежнева', era: 'stagnation', eraIndex: 20, description: 'Косыгин, разрядка', cardIds: ['c184','c185','c186','c187','c188','c189'], type: 'core', xpReward: 25 },
  { id: 'l39b', title: 'Застой', era: 'stagnation', eraIndex: 20, description: 'Финальное испытание', cardIds: ['c190','c191'], type: 'boss', unlockRequirement: 'l39', xpReward: 35 },

  // Перестройка
  { id: 'l40', title: 'Перестройка', era: 'perestroika', eraIndex: 21, description: 'Реформы Горбачёва', cardIds: ['c192','c193','c194','c195','c196'], type: 'core', xpReward: 20 },
  { id: 'l41', title: 'Распад СССР', era: 'perestroika', eraIndex: 21, description: 'ГКЧП, Беловежье', cardIds: ['c197','c198','c199','c200','c201'], type: 'core', xpReward: 25 },
  { id: 'l41b', title: 'Крушение СССР', era: 'perestroika', eraIndex: 21, description: 'Финальное испытание', cardIds: ['c192','c193','c194','c195','c196','c197','c198','c199','c200','c201'], type: 'boss', unlockRequirement: 'l41', xpReward: 35 },

  // Новая Россия
  { id: 'l42', title: 'Россия в 1990-е', era: 'modern', eraIndex: 22, description: 'Шоковая терапия, Ельцин', cardIds: ['c202','c203','c204','c205','c206','c207'], type: 'core', xpReward: 25 },
  { id: 'l43', title: 'Россия в XXI веке', era: 'modern', eraIndex: 22, description: 'Крым, Олимпиада', cardIds: ['c208','c209','c210','c211','c212','c213','c214','c215'], type: 'core', xpReward: 25 },
  { id: 'l43b', title: 'Современная Россия', era: 'modern', eraIndex: 22, description: 'Финальное испытание', cardIds: ['c202','c203','c204','c205','c206','c207','c208','c209','c210','c211','c212','c213','c214','c215'], type: 'boss', unlockRequirement: 'l43', xpReward: 40 },
];
// ==================== ЭПОХИ ====================

export const eras: Era[] = [
  {
    id: 'ancient',
    index: 0,
    name: 'Древняя Русь',
    shortName: 'Древняя Русь',
    color: '#22c55e',
    icon: '🛡️',
    description: 'От призвания варягов до Ярослава Мудрого',
    lessonIds: ['l1', 'l2', 'l3', 'l4', 'l3b'],
    yearRange: 'IX–XI вв.',
  },
  {
    id: 'fragmentation',
    index: 1,
    name: 'Раздробленность',
    shortName: 'Раздробленность',
    color: '#3b82f6',
    icon: '⚔️',
    description: 'Расцвет и распад Киевской Руси',
    lessonIds: ['l5', 'l5b'],
    yearRange: 'XI–XII вв.',
  },
  {
    id: 'invasion',
    index: 2,
    name: 'Нашествие',
    shortName: 'Нашествие',
    color: '#ef4444',
    icon: '🛡️',
    description: 'Монгольское нашествие и Невский',
    lessonIds: ['l6', 'l7', 'l7b'],
    yearRange: 'XIII в.',
  },
  {
    id: 'moscow',
    index: 3,
    name: 'Возвышение Москвы',
    shortName: 'Возвышение Москвы',
    color: '#f59e0b',
    icon: '🏛️',
    description: 'Москва собирает земли',
    lessonIds: ['l8', 'l9', 'l9b'],
    yearRange: 'XIV в.',
  },
  {
    id: 'tsardom',
    index: 4,
    name: 'Московское царство',
    shortName: 'Московское царство',
    color: '#ec4899',
    icon: '👑',
    description: 'Свержение ига и создание единого государства',
    lessonIds: ['l10', 'l11', 'l11b'],
    yearRange: 'XV в.',
  },
  {
    id: 'grozny',
    index: 5,
    name: 'Иван Грозный',
    shortName: 'Иван Грозный',
    color: '#8b5cf6',
    icon: '⚡',
    description: 'Реформы Избранной рады и Опричнина',
    lessonIds: ['l12', 'l13', 'l13b'],
    yearRange: 'XVI в.',
  },
  {
    id: 'time_of_troubles',
    index: 6,
    name: 'Смутное время',
    shortName: 'Смутное время',
    color: '#f97316',
    icon: '🔥',
    description: 'Кризис власти и борьба с интервентами',
    lessonIds: ['l14', 'l14b'],
    yearRange: '1598–1618',
  },
  {
    id: 'early-romanovs',
    index: 7,
    name: 'Первые Романовы',
    shortName: 'Первые Романовы',
    color: '#e11d48',
    icon: '👑',
    description: 'Соляной бунт, Соборное уложение, Переяславская рада',
    lessonIds: ['l15', 'l15b'],
    yearRange: '1613–1698',
  },
  {
    id: 'peter',
    index: 8,
    name: 'Петровская эпоха',
    shortName: 'Петровская эпоха',
    color: '#06b6d4',
    icon: '⚓',
    description: 'Северная война и реформы Петра I',
    lessonIds: ['l16', 'l17', 'l17b'],
    yearRange: 'XVIII в.',
  },
  {
    id: 'palace_coup',
    index: 9,
    name: 'Дворцовые перевороты',
    shortName: 'Дворцовые перевороты',
    color: '#a855f7',
    icon: '👸',
    description: 'Эпоха дворцовых переворотов',
    lessonIds: ['l18', 'l19'],
    yearRange: 'сер. XVIII в.',
  },
  {
    id: 'catherine',
    index: 10,
    name: 'Екатерина Великая',
    shortName: 'Екатерина II',
    color: '#eab308',
    icon: '📜',
    description: 'Просвещённый абсолютизм',
    lessonIds: ['l20', 'l21', 'l21b'],
    yearRange: 'вт. пол. XVIII в.',
  },
  {
    id: 'alexander1',
    index: 11,
    name: 'Александр I',
    shortName: 'Александр I',
    color: '#14b8a6',
    icon: '🎭',
    description: 'Отечественная война и либеральные реформы',
    lessonIds: ['l22', 'l23', 'l23b'],
    yearRange: 'нач. XIX в.',
  },
  {
    id: 'nicholas1',
    index: 12,
    name: 'Николай I',
    shortName: 'Николай I',
    color: '#6366f1',
    icon: '🏛️',
    description: 'Укрепление самодержавия и Крымская война',
    lessonIds: ['l24', 'l25', 'l25b'],
    yearRange: '1825–1855',
  },
  {
    id: 'reforms',
    index: 13,
    name: 'Великие реформы',
    shortName: 'Александр II',
    color: '#22d3ee',
    icon: '🕊️',
    description: 'Отмена крепостного права и либеральные реформы',
    lessonIds: ['l26', 'l27', 'l27b'],
    yearRange: '1860–1870-е',
  },
  {
    id: 'counterreforms',
    index: 14,
    name: 'Контрреформы',
    shortName: 'Александр III',
    color: '#f43f5e',
    icon: '⚖️',
    description: 'Контрреформы и начало правления Николая II',
    lessonIds: ['l28', 'l29', 'l29b'],
    yearRange: '1880–1890-е',
  },
  {
    id: 'revolution',
    index: 15,
    name: 'Революции',
    shortName: 'Революции',
    color: '#dc2626',
    icon: '🚩',
    description: 'Революции, Гражданская война и образование СССР',
    lessonIds: ['l30', 'l31', 'l31b'],
    yearRange: '1900–1920-е',
  },
  {
    id: 'ussr_early',
    index: 16,
    name: 'СССР 1920-1930-е',
    shortName: 'Сталинский СССР',
    color: '#d946ef',
    icon: '🏗️',
    description: 'Индустриализация, коллективизация и репрессии',
    lessonIds: ['l32', 'l33', 'l33b'],
    yearRange: '1920–1930-е',
  },
  {
    id: 'wwii',
    index: 17,
    name: 'Великая Отечественная',
    shortName: 'ВОВ',
    color: '#ef4444',
    icon: '🎖️',
    description: 'Ключевые сражения Великой Отечественной войны',
    lessonIds: ['l34', 'l35', 'l35b'],
    yearRange: '1941–1945',
  },
  {
    id: 'postwar',
    index: 18,
    name: 'Послевоенный СССР',
    shortName: 'Послевоенный СССР',
    color: '#78716c',
    icon: '☢️',
    description: 'Восстановление и начало холодной войны',
    lessonIds: ['l36', 'l36b'],
    yearRange: '1945–1953',
  },
  {
    id: 'thaw',
    index: 19,
    name: 'Оттепель',
    shortName: 'Хрущёв',
    color: '#fbbf24',
    icon: '🚀',
    description: 'Хрущёвская оттепель и освоение космоса',
    lessonIds: ['l37', 'l38', 'l38b'],
    yearRange: '1953–1964',
  },
  {
    id: 'stagnation',
    index: 20,
    name: 'Застой',
    shortName: 'Брежнев',
    color: '#64748b',
    icon: '🌍',
    description: 'Эпоха Брежнева и холодная война',
    lessonIds: ['l39', 'l39b'],
    yearRange: '1964–1985',
  },
  {
    id: 'perestroika',
    index: 21,
    name: 'Перестройка',
    shortName: 'Перестройка',
    color: '#a21caf',
    icon: '🔄',
    description: 'Перестройка, гласность и распад СССР',
    lessonIds: ['l40', 'l41', 'l41b'],
    yearRange: '1985–1991',
  },
  {
    id: 'modern',
    index: 22,
    name: 'Новая Россия',
    shortName: 'Новая Россия',
    color: '#0ea5e9',
    icon: '🇷🇺',
    description: 'Россия в постсоветский период',
    lessonIds: ['l42', 'l43', 'l43b'],
    yearRange: '1992–наст. время',
  },
];