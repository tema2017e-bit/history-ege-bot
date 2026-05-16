import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Users, ScrollText, Lightbulb, Link2, Target, ChevronDown, ChevronRight, Search, GraduationCap, Sparkles, Lock } from 'lucide-react';
import { TopBar } from '../components/ui/TopBar';
import { useStore, FREE_ERAS_COUNT } from '../store/useStore';
import { theorySections } from '../data/theoryData';
import type { TheoryTopic } from '../types';

// Вспомогательная функция для извлечения всего текста из контента темы
function extractAllText(topic: TheoryTopic): string {
  const parts: string[] = [];
  
  parts.push(topic.title);
  if (topic.timeRange) parts.push(topic.timeRange);
  
  if (typeof topic.content === 'string') {
    parts.push(topic.content);
  } else if (topic.content) {
    const c = topic.content;
    if (c.text) parts.push(c.text);
    if (c.rulers) c.rulers.forEach(r => parts.push(r.name, r.years, r.description || ''));
    if (c.keyDates) c.keyDates.forEach(d => parts.push(d.year, d.event));
    if (c.events) parts.push(...c.events);
    if (c.results) parts.push(...c.results);
    if (c.terms) c.terms.forEach(t => parts.push(t.term, t.definition));
    if (c.persons) c.persons.forEach(p => parts.push(p.name, p.role, p.fact));
    if (c.keyFacts) parts.push(...c.keyFacts);
    if (c.causalLinks) c.causalLinks.forEach(cl => parts.push(cl.cause, cl.effect));
    if (c.examFocus) parts.push(...c.examFocus);
  }
  
  return parts.join(' ').toLowerCase();
}

const TheoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const subscription = useStore(s => s.subscription);
  const navigateSub = () => window.location.href = '/profile';

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return theorySections;
    
    const q = searchQuery.toLowerCase();
    return theorySections
      .map(section => ({
        ...section,
        topics: section.topics.filter(topic => extractAllText(topic).includes(q)),
      }))
      .filter(section => section.topics.length > 0);
  }, [searchQuery]);

  // Автоматически раскрываем секции при поиске
  useEffect(() => {
    if (searchQuery.trim()) {
      setExpandedSections(prev => {
        const next = new Set(prev);
        filteredSections.forEach(s => next.add(s.id));
        return next;
      });
    }
  }, [searchQuery, filteredSections]);

  const isSectionLocked = (sectionIndex: number) => {
    if (subscription) return false;
    return sectionIndex >= FREE_ERAS_COUNT;
  };

  const toggleTopic = (id: string) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getSectionProgress = (section: typeof theorySections[0]) => {
    const total = section.topics.length;
    if (total === 0) return 0;
    const opened = [...expandedTopics].filter(id => 
      section.topics.some(t => t.id === id)
    ).length;
    return Math.round((opened / total) * 100);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 pb-24">
      <TopBar />
      
      <div className="max-w-lg mx-auto px-4 pb-40">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-6"
        >
          <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100">
            Теория по истории
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1 text-sm">
            Полный курс для подготовки к ЕГЭ
          </p>
        </motion.div>

        {/* Поиск */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            placeholder="Поиск по датам, терминам, личностям..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-800 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </div>

        {/* Разделы */}
        <div className="space-y-4">
          {filteredSections.map((section, sectionIndex) => {
            const locked = isSectionLocked(sectionIndex);
            return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white dark:bg-surface-800 rounded-2xl overflow-hidden border ${locked ? 'border-amber-300 dark:border-amber-700' : 'border-surface-200 dark:border-surface-700'}`}
            >
              {/* Заголовок раздела */}
              <button
                onClick={() => !locked && toggleSection(section.id)}
                className="w-full flex items-center gap-3 p-4 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors focus:outline-none focus-visible:outline-none"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: `${section.color}20` }}
                >
                  {section.icon}
                </div>
                <div className="flex-1 text-left">
                  <h2 className="font-semibold text-surface-800 dark:text-surface-100 flex items-center gap-2">
                    {section.title}
                    {locked && <Lock className="w-4 h-4 text-amber-500" />}
                  </h2>
                  <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
                    {section.yearRange} • {section.topics.length} {section.topics.length === 1 ? 'тема' : 'темы'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!locked && (
                    <div className="w-16 h-1.5 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${getSectionProgress(section)}%`,
                          backgroundColor: section.color,
                        }}
                      />
                    </div>
                  )}
                  {locked ? (
                    <Lock className="w-5 h-5 text-amber-500" />
                  ) : expandedSections.has(section.id) ? (
                    <ChevronDown className="w-5 h-5 text-surface-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-surface-400" />
                  )}
                </div>
              </button>

              {/* Заблокировано — показываем баннер */}
              {locked && (
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30">
                    <Lock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                        Раздел доступен по подписке
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                        Откройте доступ ко всей теории
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigateSub(); }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium transition-colors flex-shrink-0"
                    >
                      Открыть
                    </button>
                  </div>
                </div>
              )}

              {/* Темы раздела */}
              {!locked && expandedSections.has(section.id) && (
                <div className="border-t border-surface-100 dark:border-surface-700">
                  {section.topics.map(topic => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      sectionColor={section.color || '#6B7280'}
                      isExpanded={expandedTopics.has(topic.id)}
                      onToggle={() => toggleTopic(topic.id)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          );
          })}

          {filteredSections.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-400 dark:text-surface-500">
                Ничего не найдено по запросу "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TopicCard: React.FC<{
  topic: TheoryTopic;
  sectionColor: string;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ topic, sectionColor, isExpanded, onToggle }) => {
  const { content } = topic;
  const isStringContent = typeof content === 'string';

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors focus:outline-none focus-visible:outline-none"
      >
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: sectionColor }} />
        <div className="flex-1 text-left">
          <h3 className="text-sm font-medium text-surface-700 dark:text-surface-200">
            {topic.title}
          </h3>
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">{topic.timeRange}</p>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-surface-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-surface-400" />
        )}
      </button>

      {isExpanded && isStringContent && (
        <div className="px-4 pb-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-sm text-surface-600 dark:text-surface-300 whitespace-pre-line">{content}</p>
          </div>
        </div>
      )}

      {isExpanded && !isStringContent && content && (
        <div className="px-4 pb-4 space-y-4">
          {/* Правители */}
          {content.rulers && content.rulers.length > 0 && (
            <InfoBlock title="Правители" icon={<Users className="w-4 h-4" />} color="text-blue-600 dark:text-blue-400">
              <div className="space-y-2">
                {content.rulers.map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-surface-500 dark:text-surface-400 whitespace-nowrap mt-0.5">{r.years}</span>
                    <div>
                      <span className="font-medium text-sm text-surface-700 dark:text-surface-200">{r.name}</span>
                      <p className="text-xs text-surface-500 dark:text-surface-400">{r.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </InfoBlock>
          )}

          {/* Ключевые даты */}
          {content.keyDates && content.keyDates.length > 0 && (
            <InfoBlock title="Ключевые даты" icon={<Calendar className="w-4 h-4" />} color="text-green-600 dark:text-green-400">
              <div className="space-y-1.5">
                {content.keyDates.map((d, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 whitespace-nowrap mt-0.5">{d.year}</span>
                    <span className="text-sm text-surface-600 dark:text-surface-300">{d.event}</span>
                  </div>
                ))}
              </div>
            </InfoBlock>
          )}

          {/* Основные события */}
          {content.events && content.events.length > 0 && (
            <InfoBlock title="Основные события" icon={<ScrollText className="w-4 h-4" />} color="text-amber-600 dark:text-amber-400">
              <ul className="space-y-1.5">
                {content.events.map((e, i) => (
                  <li key={i} className="text-sm text-surface-600 dark:text-surface-300 flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </InfoBlock>
          )}

          {/* Итоги / Результаты */}
          {content.results && content.results.length > 0 && (
            <InfoBlock title="Итоги и значение" icon={<Target className="w-4 h-4" />} color="text-purple-600 dark:text-purple-400">
              <ul className="space-y-1.5">
                {content.results.map((r, i) => (
                  <li key={i} className="text-sm text-surface-600 dark:text-surface-300 flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </InfoBlock>
          )}

          {/* Термины */}
          {content.terms && content.terms.length > 0 && (
            <InfoBlock title="Термины" icon={<BookOpen className="w-4 h-4" />} color="text-sky-600 dark:text-sky-400">
              <div className="space-y-2">
                {content.terms.map((t, i) => (
                  <div key={i}>
                    <span className="font-medium text-sm text-surface-700 dark:text-surface-200">{t.term}</span>
                    <p className="text-xs text-surface-500 dark:text-surface-400">{t.definition}</p>
                  </div>
                ))}
              </div>
            </InfoBlock>
          )}

          {/* Исторические личности */}
          {content.persons && content.persons.length > 0 && (
            <InfoBlock title="Исторические личности" icon={<Users className="w-4 h-4" />} color="text-rose-600 dark:text-rose-400">
              <div className="space-y-2">
                {content.persons.map((p, i) => (
                  <div key={i}>
                    <span className="font-medium text-sm text-surface-700 dark:text-surface-200">{p.name}</span>
                    <p className="text-xs text-surface-400 mt-0.5">{p.role}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">{p.fact}</p>
                  </div>
                ))}
              </div>
            </InfoBlock>
          )}

          {/* Важные факты */}
          {content.keyFacts && content.keyFacts.length > 0 && (
            <InfoBlock title="Важные факты" icon={<Lightbulb className="w-4 h-4" />} color="text-yellow-600 dark:text-yellow-400">
              <ul className="space-y-1.5">
                {content.keyFacts.map((f, i) => (
                  <li key={i} className="text-sm text-surface-600 dark:text-surface-300 flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">💡</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </InfoBlock>
          )}

          {/* Причинно-следственные связи */}
          {content.causalLinks && content.causalLinks.length > 0 && (
            <InfoBlock title="Причинно-следственные связи" icon={<Link2 className="w-4 h-4" />} color="text-indigo-600 dark:text-indigo-400">
              <div className="space-y-2">
                {content.causalLinks.map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="flex-1 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
                      <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mb-0.5">Причина</p>
                      <p className="text-sm text-surface-600 dark:text-surface-300">{c.cause}</p>
                    </div>
                    <div className="flex items-center pt-4">
                      <span className="text-indigo-400">→</span>
                    </div>
                    <div className="flex-1 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                      <p className="text-xs text-emerald-500 dark:text-emerald-400 font-medium mb-0.5">Следствие</p>
                      <p className="text-sm text-surface-600 dark:text-surface-300">{c.effect}</p>
                    </div>
                  </div>
                ))}
              </div>
            </InfoBlock>
          )}

          {/* Фокус ЕГЭ */}
          {content.examFocus && content.examFocus.length > 0 && (
            <InfoBlock title="Акцент для ЕГЭ" icon={<Target className="w-4 h-4" />} color="text-red-600 dark:text-red-400">
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30">
                <ul className="space-y-1.5">
                  {content.examFocus.map((f, i) => (
                    <li key={i} className="text-sm text-surface-600 dark:text-surface-300 flex items-start gap-2">
                      <span className="text-red-500 mt-1">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </InfoBlock>
          )}
        </div>
      )}
    </div>
  );
};

const InfoBlock: React.FC<{
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}> = ({ title, icon, color, children }) => (
  <div>
    <div className="flex items-center gap-1.5 mb-2">
      <span className={color}>{icon}</span>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        {title}
      </h4>
    </div>
    {children}
  </div>
);

export default TheoryPage;