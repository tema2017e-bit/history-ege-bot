import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ru.historyege.app',
  appName: 'ЕГЭ История Даты',
  webDir: 'dist',
  server: {
    // Разрешаем переход на VK OAuth и обратно
    allowNavigation: [
      'oauth.vk.com',
      'login.vk.com',
      'id.vk.com'
    ],
  },
  android: {
    // Позволяет открывать ссылки в браузере системы, а не внутри WebView
    allowMixedContent: true,
  },
};

export default config;
