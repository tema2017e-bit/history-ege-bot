export interface TgUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

/** URL бекенда с ботом */
const BOT_API_URL = import.meta.env.VITE_BOT_API_URL || 'https://history-ege-bot.onrender.com';

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

/**
 * Получить chat_id пользователя Telegram
 */
export function getChatId(): number | null {
  const tg = (window as any).Telegram?.WebApp;
  return tg?.initDataUnsafe?.user?.id || null;
}

/**
 * Получить данные пользователя из Telegram
 */
export function getTgUser(): TgUser | null {
  const tg = (window as any).Telegram?.WebApp;
  return tg?.initDataUnsafe?.user || null;
}

/**
 * Проверить, есть ли у пользователя полный доступ (unlocked_all)
 */
export async function checkAccess(chatId?: number): Promise<{
  ok: boolean;
  unlocked: boolean;
  user?: any;
  error?: string;
}> {
  const id = chatId || getChatId();
  if (!id) {
    return { ok: false, unlocked: false, error: 'No chat_id' };
  }

  try {
    const res = await fetch(
      `${BOT_API_URL}/api/check-access?chat_id=${id}`,
      { method: 'GET' }
    );
    return await res.json();
  } catch (err: any) {
    console.error('checkAccess error:', err.message);
    return { ok: false, unlocked: false, error: err.message };
  }
}

/**
 * Отправить пользователя на оплату — открывает диплинк с /buy в боте
 */
export function openBotBuy(): void {
  const tg = (window as any).Telegram?.WebApp;
  const botUsername = import.meta.env.VITE_BOT_USERNAME || 'history_ege_bot';
  if (tg) {
    tg.openTelegramLink(`https://t.me/${botUsername}?start=buy`);
  } else {
    window.open(`https://t.me/${botUsername}?start=buy`, '_blank');
  }
}

/**
 * Открыть бот (главное меню)
 */
export function openBot(): void {
  const tg = (window as any).Telegram?.WebApp;
  const botUsername = import.meta.env.VITE_BOT_USERNAME || 'history_ege_bot';
  if (tg) {
    tg.openTelegramLink(`https://t.me/${botUsername}?start=app`);
  } else {
    window.open(`https://t.me/${botUsername}?start=app`, '_blank');
  }
}

/**
 * Разблокировать пользователя через админ API (только для отладки)
 */
export async function adminUnlock(chatId: number, secret: string): Promise<boolean> {
  try {
    const res = await fetch(`${BOT_API_URL}/api/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, secret }),
    });
    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
}