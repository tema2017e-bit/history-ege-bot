// Маппинг между era ID (из historyCards) и section ID (из theorySections)
// Так как структура идёт параллельно, маппинг один-к-одному
export const eraToTheorySection: Record<string, string> = {
  // Древняя Русь и раздробленность — оба маппятся на одну секцию theoryData
  'ancient': 'ancient-rus',
  'fragmentation': 'ancient-rus',
  // Борьба с внешними угрозами в XIII в.
  'invasion': 'external-threats-13th',
  // Образование единого Русского государства
  'moscow': 'unification',
  // Россия в XVI веке (Иван Грозный)
  'tsardom': 'russia-16th',
  'grozny': 'russia-16th',
  // Смутное время
  'time_of_troubles': 'time-of-troubles',
  // Россия в XVII веке (Первые Романовы)
  'early-romanovs': 'russia-17th',
  // Эпоха Петра I
  'peter': 'peter-great',
  // Эпоха дворцовых переворотов
  'palace_coup': 'palace-coups',
  // Россия во второй половине XVIII века (Екатерина II)
  'catherine': 'russia-1762-1801',
  // Россия в первой половине XIX века
  'alexander1': 'russia-1801-1855',
  'nicholas1': 'russia-1801-1855',
  // Великие реформы и вторая половина XIX века
  'reforms': 'great-reforms',
  'counterreforms': 'counter-reforms',
  // Первая мировая война, Революции 1917 и Гражданская война
  'revolution': 'revolution-civil-war',
  // СССР 1920-1930-е (Сталин)
  'ussr_early': 'ussr-1917-1941',
  // Великая Отечественная война
  'wwii': 'great-patriotic',
  // Послевоенный СССР (1945-1953)
  'postwar': 'post-war-ussr',
  // Хрущёвская оттепель
  'thaw': 'thaw',
  // Застой (Брежнев)
  'stagnation': 'stagnation',
  // Перестройка и распад СССР
  'perestroika': 'perestroika',
  // Новая Россия (1992-наст. время)
  'modern': 'modern-russia',
};

// Обратный маппинг: theorySectionId -> eraId
export const theorySectionToEra: Record<string, string> = {};
for (const [eraId, sectionId] of Object.entries(eraToTheorySection)) {
  theorySectionToEra[sectionId] = eraId;
}