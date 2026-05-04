const HEART_RECOVERY_INTERVAL = 30 * 60 * 1000; // 30 минут

export function getTimeUntilNextHeart(hearts: number, maxHearts: number, lastRecoveryAt: number | null): number {
  if (hearts >= maxHearts) return 0;
  const lastAt = lastRecoveryAt || Date.now();
  const nextAt = lastAt + HEART_RECOVERY_INTERVAL;
  return Math.max(0, nextAt - Date.now());
}

export function formatHeartTimer(hearts: number, maxHearts: number, lastRecoveryAt: number | null): string {
  const ms = getTimeUntilNextHeart(hearts, maxHearts, lastRecoveryAt);
  if (ms <= 0) return '00:00';
  const totalSec = Math.ceil(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
