import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Crown, Lock, Check, TestTube, Zap } from 'lucide-react';
import { TopBar } from '../components/ui/TopBar';
import { useStore } from '../store/useStore';
import { eras, lessons } from '../data/historyDates';

const EraPage: React.FC = () => {
  const { eraId } = useParams<{ eraId: string }>();
  const navigate = useNavigate();
  const { completedLessons, unlockedLessons, getEraStatus, canAttemptDiagnostic } = useStore();

  const era = eras.find(e => e.id === eraId);
  if (!era) {
    navigate('/');
    return null;
  }

  const eraStatus = getEraStatus(era.id);
  const canDiagnostic = canAttemptDiagnostic(era.id);

  // Если эпоха заблокирована — показываем экран разблокировки
  if (eraStatus === 'locked') {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <TopBar />
        <div className="max-w-lg mx-auto px-4 pb-40">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 mb-6 mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>На главную</span>
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-12"
          >
            <div className="w-24 h-24 rounded-2xl bg-surface-200 dark:bg-surface-700 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-12 h-12 text-surface-400 dark:text-surface-500" />
            </div>

            <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-2">{era.name}</h1>
            <p className="text-surface-500 dark:text-surface-400 mb-2">{era.yearRange}</p>
            <p className="text-surface-400 dark:text-surface-500 text-sm mb-8">{era.description}</p>

            {canDiagnostic ? (
              <div className="space-y-4">
                <div className="card bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-800/50">
                  <TestTube className="w-10 h-10 text-primary-500 mx-auto mb-3" />
                  <h2 className="text-lg font-bold text-surface-800 dark:text-surface-100 mb-2">
                    Пройди диагностику
                  </h2>
                  <p className="text-sm text-surface-600 dark:text-surface-300 mb-4">
                    Ответь правильно на 70% вопросов по предыдущим эпохам, чтобы открыть "{era.name}"
                  </p>
                  <Link to={`/diagnostic/${era.id}`}>
                    <button className="btn-primary w-full flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5" />
                      Начать тест
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="card bg-surface-100 dark:bg-surface-800">
                <p className="text-surface-500 dark:text-surface-400 text-sm">
                  Сначала пройди уроки из предыдущих эпох, чтобы открыть эту
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  const eraLessons = era.lessonIds.map(id => lessons.find(l => l.id === id)).filter(Boolean);

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

        {/* Era Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4"
            style={{ backgroundColor: `${era.color}20` }}
          >
            {era.icon}
          </div>
          <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100">{era.name}</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">{era.description}</p>
          <span className="inline-block mt-2 text-xs font-medium text-surface-400 dark:text-surface-500 bg-surface-100 dark:bg-surface-800 px-3 py-1 rounded-full">
            {era.yearRange}
          </span>
        </motion.div>

        {/* Lessons */}
        <div className="space-y-4">
          {eraLessons.map((lesson, index) => {
            if (!lesson) return null;

            const isCompleted = completedLessons.includes(lesson.id);
            const isUnlocked = unlockedLessons.includes(lesson.id);
            const isBoss = lesson.type === 'boss';

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {isUnlocked ? (
                  <Link to={`/lesson/${lesson.id}`}>
                    <div className={`card card-hover ${isBoss ? 'border-gold-200 bg-gold-50 dark:border-gold-800/50 dark:bg-gold-900/20' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                          ${isCompleted 
                            ? 'bg-primary-500' 
                            : isBoss 
                              ? 'bg-gold-500' 
                              : 'bg-surface-200 dark:bg-surface-700'
                          }
                        `}>
                          {isCompleted ? (
                            <Check className="w-6 h-6 text-white" />
                          ) : isBoss ? (
                            <Crown className="w-6 h-6 text-white" />
                          ) : (
                            <Star className="w-6 h-6 text-surface-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-surface-800 dark:text-surface-100">{lesson.title}</h3>
                            <span className="text-xs text-surface-400 dark:text-surface-500">+{lesson.xpReward} XP</span>
                          </div>
                          <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">{lesson.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-surface-400 dark:text-surface-500">{lesson.cardIds.length} карточек</span>
                            {isBoss && (
                              <span className="badge badge-warning">Босс</span>
                            )}
                            {lesson.type === 'review' && (
                              <span className="badge badge-success">Повторение</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="card opacity-50 dark:bg-surface-800">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-200 dark:bg-surface-700 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-surface-400 dark:text-surface-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-surface-600 dark:text-surface-400">{lesson.title}</h3>
                        <p className="text-sm text-surface-400 dark:text-surface-500 mt-0.5">Пройди предыдущие уроки</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EraPage;
