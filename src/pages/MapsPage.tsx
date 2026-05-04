import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/ui/TopBar';
import { mapCategories, mapData, getMapsByCategory } from '../data/mapData';
import MapViewer from '../components/map/MapViewer';

const MapsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(mapCategories[0].id);
  const [expandedMap, setExpandedMap] = useState<string | null>(null);

  const currentCategory = mapCategories.find(c => c.id === selectedCategory);
  const maps = useMemo(
    () => getMapsByCategory(selectedCategory),
    [selectedCategory]
  );

  const handleStartQuiz = (mapId: string) => {
    navigate(`/map-task/${mapId}`);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 pb-24">
      <TopBar />

      <div className="max-w-lg mx-auto px-4 pt-4 pb-40">
        {/* Заголовок */}
        <h1 className="text-xl font-bold text-surface-800 dark:text-surface-100 mb-1">Исторические карты</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
          Изучайте карты по эпохам и тренируйтесь в их определении
        </p>

        {/* Счётчик */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentCategory?.icon}</span>
            <span className="font-semibold text-surface-700 dark:text-surface-200 text-sm">{currentCategory?.name}</span>
          </div>
          <span className="text-xs text-surface-400">{maps.length} карт</span>
        </div>

        {/* Категории — горизонтальный скролл как в теориях */}
        <div className="overflow-x-auto pb-2 mb-4 -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            {mapCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setExpandedMap(null); }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all
                  ${selectedCategory === cat.id
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700'
                  }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-70">({cat.period})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Список карт как карточки уроков */}
        <div className="space-y-3">
          {maps.length === 0 ? (
            <div className="text-center py-10 text-surface-400">
              <p className="text-lg">😕</p>
              <p className="mt-2 text-sm">Карты этого периода скоро появятся</p>
            </div>
          ) : (
            maps.map(map => {
              const isExpanded = expandedMap === map.id;
              return (
                <div
                  key={map.id}
                  className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 overflow-hidden"
                >
                  {/* Краткая информация как в эпохах */}
                  <div
                    onClick={() => setExpandedMap(isExpanded ? null : map.id)}
                    className="p-4 cursor-pointer active:bg-surface-50 dark:active:bg-surface-750 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-lg flex-shrink-0">
                        🗺️
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-surface-800 dark:text-surface-100 text-sm">
                          {map.title}
                        </h3>
                        <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 line-clamp-1">
                          {map.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full font-medium">
                            {map.period}
                          </span>
                          <span className="text-[10px] text-surface-400">
                            {map.zones.length} обозн.
                          </span>
                        </div>
                      </div>
                      <svg
                        className={`w-4 h-4 text-surface-400 mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Развёрнутая карта + кнопки */}
                  {isExpanded && (
                    <div className="border-t border-surface-200 dark:border-surface-700">
                      <MapViewer map={map} showLabels={true} />
                      <div className="px-4 pb-4 flex gap-2">
                        <button
                          onClick={() => handleStartQuiz(map.id)}
                          className="flex-1 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
                        >
                          Начать тест
                        </button>
                        <button
                          onClick={() => navigate(`/map-task/${map.id}`)}
                          className="flex-1 bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 active:bg-surface-300 dark:active:bg-surface-500 text-surface-700 dark:text-surface-200 py-2.5 rounded-lg font-medium text-sm transition-colors"
                        >
                          Подробнее
                        </button>
                      </div>
                      {/* Подсказки */}
                      <div className="mx-4 mb-4 bg-surface-50 dark:bg-surface-900/50 rounded-lg p-3 border border-surface-150 dark:border-surface-700/50">
                        <p className="text-xs font-medium text-surface-500 mb-1">💡 Как узнать карту:</p>
                        <ul className="text-xs text-surface-400 space-y-0.5">
                          {map.recognitionHints.map((hint, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span>•</span>
                              <span>{hint}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MapsPage;