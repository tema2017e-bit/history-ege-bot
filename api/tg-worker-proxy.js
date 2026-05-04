/**
 * Cloudflare Worker — прокси для Telegram Bot API
 * 
 * Деплой: 
 * 1. Зайти на https://dash.cloudflare.com
 * 2. Создать Worker
 * 3. Вставить этот код
 * 4. Сохранить и получить URL вида: https://tg-proxy-xxx.workers.dev
 */

// Белый список разрешённых методов Telegram API
const ALLOWED_METHODS = [
  'getMe', 'sendMessage', 'editMessageText', 'deleteMessage',
  'answerCallbackQuery', 'answerInlineQuery',
  'getChat', 'getChatMember', 'getChatAdministrators',
  'setWebhook', 'deleteWebhook', 'getWebhookInfo',
  'sendPhoto', 'sendDocument', 'sendInvoice', 'answerPreCheckoutQuery',
  'createInvoiceLink',
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname; // например /botTOKEN/sendMessage
    
    // Проверяем, что путь начинается с /bot
    if (!path.startsWith('/bot')) {
      return new Response('Not found', { status: 404 });
    }
    
    // Извлекаем токен и метод
    const parts = path.split('/');
    // parts[0] = "", parts[1] = "botTOKEN", parts[2] = "sendMessage"
    const botToken = parts[1]; // bot123456:ABC-DEF1234
    const method = parts[2];
    
    if (!method) {
      return new Response('Method required', { status: 400 });
    }
    
    // Проксируем запрос к реальному Telegram API
    const telegramUrl = `https://api.telegram.org/${botToken}/${method}`;
    
    try {
      const response = await fetch(telegramUrl, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: request.method === 'POST' ? request.body : undefined,
      });
      
      const data = await response.json();
      
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};