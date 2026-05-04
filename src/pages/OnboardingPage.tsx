import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Zap, Target, Flame, ArrowRight, Check } from 'lucide-react';
import { useStore } from '../store/useStore';

const steps = [
  {
    icon: <BookOpen className="w-12 h-12" />,
    title: 'Добро пожаловать!',
    description: 'Учи даты по истории ЕГЭ легко и увлекательно',
    color: 'from-primary-400 to-primary-600',
  },
  {
    icon: <Zap className="w-12 h-12" />,
    title: 'Микроуроки',
    description: 'Проходи уроки по 1-3 минуты в любом месте',
    color: 'from-gold-400 to-gold-600',
  },
  {
    icon: <Target className="w-12 h-12" />,
    title: '6+ типов заданий',
    description: 'Разнообразные задания для лучшего запоминания',
    color: 'from-blue-400 to-blue-600',
  },
  {
    icon: <Flame className="w-12 h-12" />,
    title: 'Собирай серии!',
    description: 'Зарабатывай XP, открывай достижения и учись каждый день',
    color: 'from-orange-400 to-red-500',
  },
];

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const completeOnboarding = useStore(state => state.completeOnboarding);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleLevelSelect = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setSelectedLevel(level);
    completeOnboarding(level);
    navigate('/');
  };

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center"
          >
            {/* Icon */}
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-8 shadow-xl text-white`}>
              {step.icon}
            </div>

            {/* Content */}
            <h1 className="text-3xl font-bold text-surface-800 mb-3">
              {step.title}
            </h1>
            <p className="text-lg text-surface-500 mb-12">
              {step.description}
            </p>

            {/* Dots */}
            <div className="flex justify-center gap-2 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep ? 'w-8 bg-primary-500' : 'bg-surface-300'
                  }`}
                />
              ))}
            </div>

            {/* Button */}
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Далее
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-surface-500 mb-4">Выбери свой уровень:</p>
                <button
                  onClick={() => handleLevelSelect('beginner')}
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    selectedLevel === 'beginner'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white hover:bg-surface-100 text-surface-700 border-2 border-surface-200'
                  }`}
                >
                  🌱 Новичок — начинаю с нуля
                </button>
                <button
                  onClick={() => handleLevelSelect('intermediate')}
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    selectedLevel === 'intermediate'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white hover:bg-surface-100 text-surface-700 border-2 border-surface-200'
                  }`}
                >
                  📚 Знаю основы — хочу подтянуть даты
                </button>
                <button
                  onClick={() => handleLevelSelect('advanced')}
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    selectedLevel === 'advanced'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white hover:bg-surface-100 text-surface-700 border-2 border-surface-200'
                  }`}
                >
                  🎓 Готов к ЕГЭ — нужен повтор
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingPage;
