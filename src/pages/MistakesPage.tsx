import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, X, RotateCcw } from 'lucide-react';
import { TopBar } from '../components/ui/TopBar';
import { useStore } from '../store/useStore';
import { historyCards } from '../data/historyDates';

const MistakesPage: React.FC = () => {
  const navigate = useNavigate();
  const { mistakes, cardProgress } = useStore();

  const mistakesWithCards = useMemo(() => {
    const uniqueMistakes = mistakes.reduce((acc, mistake) => {
      const existing = acc.find(m => m.cardId === mistake.cardId);
      if (!existing) {
        acc.push(mistake);
      } else {
        existing.timestamp = mistake.timestamp;
      }
      return acc;
    }, [] as typeof mistakes);

    return uniqueMistakes
      .map(mistake => {
        const card = historyCards.find(c => c.id === mistake.cardId);
        return { ...mistake, card };
      })
      .filter((m): m is typeof m & { card: typeof historyCards[0] } => m.card !== undefined)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [mistakes]);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <TopBar />
      
      <div className="max-w-lg mx-auto px-4 pb-40">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 mb-6 mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-error-400 to-error-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-error-500/25">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-2">Мои ошибки</h1>
          <p className="text-surface-500 dark:text-surface-400">
            {mistakesWithCards.length > 0
              ? `Запомни ${mistakesWithCards.length} ошибок. Повторение — мать учения!`
              : 'Пока ошибок нет! Так держать! 🎉'}
          </p>
        </motion.div>

        {mistakesWithCards.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Link
                to="/review"
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Проработать ошибки
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-lg font-bold text-surface-800 dark:text-surface-100 mb-3">История ошибок</h2>
              <div className="space-y-2">
                {mistakesWithCards.slice(0, 30).map((mistake, index) => (
                  <motion.div
                    key={`${mistake.cardId}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="card p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-error-100 dark:bg-error-900/40 flex items-center justify-center flex-shrink-0">
                        <X className="w-4 h-4 text-error-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-700 dark:text-surface-200">{mistake.card.event}</p>
                        <p className="text-xs text-primary-500 font-semibold mt-1">{mistake.card.year}</p>
                        <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">{mistake.card.period} • {mistake.card.era}</p>
                        {mistake.card.ruler && (
                          <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">👤 {mistake.card.ruler}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center py-12"
          >
            <span className="text-6xl mb-4">🏆</span>
            <p className="text-surface-600 dark:text-surface-300 font-medium text-lg mb-2">Чистый лист!</p>
            <p className="text-surface-400 dark:text-surface-500 text-sm">Ошибки — это нормально. Они помогают нам учиться!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MistakesPage;
