import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LessonPage from './pages/LessonPage';
import ReviewPage from './pages/ReviewPage';
import MistakesPage from './pages/MistakesPage';
import ProfilePage from './pages/ProfilePage';
import EraPage from './pages/EraPage';
import HeartRecoveryPage from './pages/HeartRecoveryPage';
import ReignsPage from './pages/ReignsPage';
import OnboardingPage from './pages/OnboardingPage';
import TheoryPage from './pages/TheoryPage';
import DiagnosticPage from './pages/DiagnosticPage';
import DateMemoryPage from './pages/DateMemoryPage';
import EndlessPage from './pages/EndlessPage';
import { useStore, unlockAllEras, checkSubscriptionStatus } from './store/useStore';
import { useTelegram } from './utils/telegram';

// Компонент, проверяющий статус подписки через API бота
// Если у пользователя есть unlocked_all — разблокирует все эпохи
// Если подписка закончилась — блокируе обратно
const SubscriptionHandler: React.FC = () => {
  const tgUser = useStore(state => state.tgUser);
  const unlockedAllByAdmin = useStore(state => state.unlockedAllByAdmin);

  useEffect(() => {
    if (!tgUser?.id) return;

    let cancelled = false;

    const checkStatus = async () => {
      try {
        const result = await checkSubscriptionStatus(tgUser);
        if (cancelled) return;

        if (result.subscription) {
          // Пользователь оплатил — разблокируем всё
          unlockAllEras();
        }
        // Если подписки нет — ничего не делаем,
        // пользователь всё равно может пользоваться бесплатными эпохами
      } catch (e) {
        console.error('Subscription check failed:', e);
      }
    };

    checkStatus();

    return () => { cancelled = true; };
  }, [tgUser?.id]);

  return null;
};

// Обработчик URL-параметров (unlock=1, subscribe и т.д.)
const UrlParamHandler: React.FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Параметр unlock=1 — разблокировать все эпохи (для админов)
    if (searchParams.get('unlock') === '1') {
      unlockAllEras();
      toast.success('✅ Все эпохи разблокированы!', { duration: 3000 });
      
      // Убираем параметр из URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  return null;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const onboardingComplete = useStore(state => state.onboardingComplete);
  
  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const onboardingComplete = useStore(state => state.onboardingComplete);
  const theme = useStore(state => state.theme);
  const setTheme = useStore(state => state.setTheme);
  const setTgUser = useStore(state => state.setTgUser);

  // Telegram Mini App интеграция
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    // Применяем тему Telegram
    const colorScheme = tg.colorScheme; // 'light' | 'dark'
    if (colorScheme === 'dark') {
      setTheme('dark');
    } else {
      setTheme('light');
    }

    // Подписываемся на смену темы в Telegram
    tg.onEvent('themeChanged', () => {
      const newScheme = tg.colorScheme;
      if (newScheme === 'dark') {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    });

    // Автоматическая авторизация через Telegram
    const initDataUnsafe = tg.initDataUnsafe;
    if (initDataUnsafe?.user) {
      setTgUser({
        id: initDataUnsafe.user.id,
        first_name: initDataUnsafe.user.first_name,
        last_name: initDataUnsafe.user.last_name,
        username: initDataUnsafe.user.username,
        photo_url: initDataUnsafe.user.photo_url,
      });
    }

    // Задний фон под цвет темы
    tg.setHeaderColor(colorScheme === 'dark' ? '#1c1c1e' : '#ffffff');
    tg.setBackgroundColor(colorScheme === 'dark' ? '#000000' : '#f8f9fa');

    return () => {
      tg.offEvent('themeChanged');
    };
  }, [setTheme, setTgUser]);

  // Синхронизация темы с HTML
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <SubscriptionHandler />
      <UrlParamHandler />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lesson/:lessonId"
          element={
            <ProtectedRoute>
              <LessonPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review"
          element={
            <ProtectedRoute>
              <ReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mistakes"
          element={
            <ProtectedRoute>
              <MistakesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/era/:eraId"
          element={
            <ProtectedRoute>
              <EraPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recovery"
          element={
            <ProtectedRoute>
              <HeartRecoveryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reigns"
          element={
            <ProtectedRoute>
              <ReignsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diagnostic/:eraId"
          element={
            <ProtectedRoute>
              <DiagnosticPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/theory"
          element={
            <ProtectedRoute>
              <TheoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/date-memory"
          element={
            <ProtectedRoute>
              <DateMemoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/endless"
          element={
            <ProtectedRoute>
              <EndlessPage />
            </ProtectedRoute>
          }
        />
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Bottom Navigation */}
      {onboardingComplete && <BottomNav />}
    </BrowserRouter>
  );
};

const BottomNav: React.FC = () => {
  const { pathname } = useLocation();
  
  const navItems = [
    { path: '/', icon: '🏠', label: 'Главная' },
    { path: '/theory', icon: '📖', label: 'Теория' },
    { path: '/review', icon: '🔄', label: 'Повтор' },
    { path: '/mistakes', icon: '📝', label: 'Ошибки' },
    { path: '/profile', icon: '👤', label: 'Профиль' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-100 safe-bottom z-40 dark:bg-surface-850 dark:border-surface-700/50">
      <div className="max-w-lg mx-auto flex">
        {navItems.map(item => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex flex-col items-center py-2 px-3 transition-colors
                ${isActive ? 'text-primary-500' : 'text-surface-400 hover:text-surface-600'}
              `}
            >
              <span className="text-xl mb-0.5">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default App;