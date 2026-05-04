import React, { useState, useRef, useEffect } from 'react';
import { MapZone, MapData } from '../../types/mapTypes';

interface MapViewerProps {
  map: MapData;
  activeZoneId?: string;
  onZoneClick?: (zone: MapZone) => void;
  highlightCorrect?: string;
  highlightWrong?: string;
  showLabels?: boolean;
}

// Цвета для разных типов зон
const zoneColors: Record<string, { fill: string; stroke: string; bg: string }> = {
  number: {
    fill: 'rgba(59, 130, 246, 0.15)',
    stroke: '#3b82f6',
    bg: '#dbeafe',
  },
  letter: {
    fill: 'rgba(139, 92, 246, 0.15)',
    stroke: '#8b5cf6',
    bg: '#ede9fe',
  },
  area: {
    fill: 'rgba(34, 197, 94, 0.10)',
    stroke: '#22c55e',
    bg: '#dcfce7',
  },
  route: {
    fill: 'rgba(245, 158, 11, 0.10)',
    stroke: '#f59e0b',
    bg: '#fef3c7',
  },
  arrow: {
    fill: 'rgba(245, 158, 11, 0.10)',
    stroke: '#f59e0b',
    bg: '#fef3c7',
  },
  city: {
    fill: 'rgba(59, 130, 246, 0.15)',
    stroke: '#3b82f6',
    bg: '#dbeafe',
  },
};

const MapViewer: React.FC<MapViewerProps> = ({
  map,
  activeZoneId,
  onZoneClick,
  highlightCorrect,
  highlightWrong,
  showLabels = false,
}) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'digits' | 'letters'>('all');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });

  const filteredZones = map.zones.filter(z => {
    if (activeTab === 'digits') return z.type === 'number';
    if (activeTab === 'letters') return z.type === 'letter' || z.type === 'area';
    return true;
  });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      setImageLoaded(true);
      setImageError(false);
    };
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
    };
    img.src = map.imagePath;
    return () => { img.onload = null; img.onerror = null; };
  }, [map.imagePath]);

  return (
    <div className="p-4">
      {/* Легенда */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400'
          }`}
        >
          Все
        </button>
        <button
          onClick={() => setActiveTab('digits')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'digits'
              ? 'bg-primary-500 text-white'
              : 'bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400'
          }`}
        >
          Цифры
        </button>
        <button
          onClick={() => setActiveTab('letters')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'letters'
              ? 'bg-primary-500 text-white'
              : 'bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400'
          }`}
        >
          Буквы / территории
        </button>
        <div className="flex-1" />
        <span className="text-xs text-surface-400">{filteredZones.length} обозначений</span>
      </div>

      {/* Изображение карты с SVG-наложением */}
      <div
        ref={containerRef}
        className="relative bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden select-none"
      >
        {imageError ? (
          <div className="flex items-center justify-center p-8 text-surface-400">
            <div className="text-center">
              <p className="text-2xl mb-2">🗺️</p>
              <p className="text-sm">Изображение карты не найдено</p>
              <p className="text-xs mt-1 text-surface-300">{map.imagePath}</p>
            </div>
          </div>
        ) : (
          <div className="relative" style={{ aspectRatio: `${imageSize.width} / ${imageSize.height}` }}>
            <img
              src={map.imagePath}
              alt={map.title}
              className="w-full h-full object-contain"
              style={{ display: imageLoaded ? 'block' : 'none' }}
              draggable={false}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface-100 dark:bg-surface-800">
                <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {/* SVG-зоны поверх изображения */}
            {imageLoaded && (
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
                preserveAspectRatio="xMidYMid meet"
                style={{ pointerEvents: imageLoaded ? 'auto' : 'none' }}
              >
                {map.zones.map(zone => {
                  const [x1, y1, x2, y2] = zone.coords;
                  const isHovered = hoveredZone === zone.id;
                  const isActive = zone.id === activeZoneId;
                  const isCorrect = zone.id === highlightCorrect;
                  const isWrong = zone.id === highlightWrong;
                  const isFiltered = filteredZones.includes(zone);
                  const colors = zoneColors[zone.type] || zoneColors.number;

                  let fill = isFiltered ? colors.fill : 'transparent';
                  let stroke = isFiltered ? colors.stroke : 'transparent';
                  let strokeWidth = isFiltered ? 2 : 0;

                  if (isCorrect) {
                    fill = 'rgba(34, 197, 94, 0.25)';
                    stroke = '#22c55e';
                    strokeWidth = 3;
                  } else if (isWrong) {
                    fill = 'rgba(239, 68, 68, 0.25)';
                    stroke = '#ef4444';
                    strokeWidth = 3;
                  } else if (isActive) {
                    fill = 'rgba(59, 130, 246, 0.25)';
                    stroke = '#3b82f6';
                    strokeWidth = 3;
                  } else if (isHovered && isFiltered) {
                    fill = colors.fill;
                    stroke = colors.stroke;
                    strokeWidth = 3;
                  }

                  const width = x2 - x1;
                  const height = y2 - y1;

                  return (
                    <g key={zone.id}>
                      <rect
                        x={x1}
                        y={y1}
                        width={width}
                        height={height}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        rx={2}
                        className={isFiltered && onZoneClick ? 'cursor-pointer' : ''}
                        style={{ cursor: isFiltered && onZoneClick ? 'pointer' : 'default' }}
                        onClick={() => isFiltered && onZoneClick?.(zone)}
                        onMouseEnter={() => isFiltered && setHoveredZone(zone.id)}
                        onMouseLeave={() => setHoveredZone(null)}
                      />
                      {isFiltered && (
                        <text
                          x={x1 + width / 2}
                          y={y1 + height / 2}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={
                            isCorrect ? '#16a34a' :
                            isWrong ? '#dc2626' :
                            isActive ? '#2563eb' :
                            colors.stroke
                          }
                          fontSize={Math.max(14, Math.min(22, imageSize.width / 60))}
                          fontWeight={700}
                          style={{
                            pointerEvents: 'none',
                            userSelect: 'none',
                            textShadow: '0 0 4px white, 0 0 4px white',
                          }}
                        >
                          {showLabels ? zone.meaning : zone.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Список всех зон */}
      <div className="mt-3 space-y-1.5">
        {filteredZones.map(zone => {
          const isCorrect = zone.id === highlightCorrect;
          const isWrong = zone.id === highlightWrong;
          const colors = zoneColors[zone.type] || zoneColors.number;

          return (
            <button
              key={zone.id}
              onClick={() => onZoneClick?.(zone)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : isWrong
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  : 'bg-surface-50 dark:bg-surface-800/50 border border-surface-150 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
            >
              <span
                className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: colors.bg, color: colors.stroke }}
              >
                {zone.label}
              </span>
              <span className={`text-left flex-1 ${
                isCorrect ? 'text-green-700 dark:text-green-300 font-medium' :
                isWrong ? 'text-red-700 dark:text-red-300 font-medium' :
                'text-surface-600 dark:text-surface-300'
              }`}>
                {zone.meaning}
              </span>
              {isCorrect && <span className="text-green-500 text-sm">✓</span>}
              {isWrong && <span className="text-red-500 text-sm">✗</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MapViewer;