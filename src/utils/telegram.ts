export interface TgUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

/**
 * Хук, определяющий, запущено ли приложение внутри Telegram
 */
export function useTelegram(): boolean {
  const tg = (window as any).Telegram?.WebApp;
  return !!tg && !!tg.initDataUnsafe;
}

/**
 * Получить initData для верификации на сервере (Telegram WebApp)
 */
export function getTelegramInitData(): string | null {
  const tg = (window as any).Telegram?.WebApp;
  return tg?.initData || null;
}

/**
 * Закрыть Mini App
 */
export function closeTelegramApp(): void {
  const tg = (window as any).Telegram?.WebApp;
  if (tg) tg.close();
}

/**
 * Показать всплывающее окно в Telegram
 */
export function showTelegramAlert(message: string): void {
  const tg = (window as any).Telegram?.WebApp;
  if (tg) tg.showAlert(message);
}

/**
 * Показать окно подтверждения в Telegram
 */
export function showTelegramConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.showConfirm(message, (confirmed: boolean) => resolve(confirmed));
    } else {
      resolve(true);
    }
  });
}