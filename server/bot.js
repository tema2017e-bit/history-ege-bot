/**
 * Бот для подготовки к ЕГЭ по истории
 * Production-версия: Express + PostgreSQL + Webhook + ЮKassa
 * 
 * Запуск: npm start
 * Миграция БД: npm run migrate
 */

require('dotenv').config();

const express = require('express');
const crypto = require('crypto');
const fetch = require('node-fetch');

// CORS middleware — чтобы Mini App мог обращаться к API бота
const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin || '*';
  // Разрешаем Vercel frontend и любые Telegram Mini App
  res.setHeader('Access-Control-Allow-Origin', origin === 'null' ? '*' : origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
};

const db = require('./src/db');

// ======================== КОНФИГУРАЦИЯ ========================

const config = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  BOT_USERNAME: process.env.BOT_USERNAME || 'history_ege_bot',
  MINI_APP_URL: process.env.MINI_APP_URL || 'https://history-ege.vercel.app',
  ADMIN_ID: parseInt(process.env.ADMIN_ID || '0'),
  ADMIN_API_SECRET: process.env.ADMIN_API_SECRET || 'admin-secret-2024',
  API_PORT: parseInt(process.env.API_PORT || '3000'),
  
  // ЮKassa
  YUKASSA_SHOP_ID: process.env.YUKASSA_SHOP_ID || '',
  YUKASSA_SECRET_KEY: process.env.YUKASSA_SECRET_KEY || '',
  
  // Цены (в рублях)
  PRICE_MONTHLY: 99, // подписка на 1 месяц
  PRICE_UNLOCK: 199, // разблокировка всех эпох навсегда
  
  // Внешний URL для вебхуков (для ЮKassa)
  EXTERNAL_URL: process.env.EXTERNAL_URL || '',
  
  // SOCKS5 прокси для Telegram API (обходит блокировки в Москве)
  // По умолчанию: host.docker.internal:1080 (SOCKS5 на хосте VDS)
  SOCKS_PROXY: process.env.SOCKS_PROXY || 'socks5://host.docker.internal:1080',
};

// ======================== TELEGRAM API ========================

// Используем Cloudflare Worker как прокси для Telegram API (обходит блокировки)
const TELEGRAM_API = `https://tg-proxy.tompulpie.workers.dev/bot${config.TELEGRAM_TOKEN}`;

async function tgCall(method, params = {}) {
  try {
    const url = `${TELEGRAM_API}/${method}`;
    
    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params || {}),
    };
    

    const res = await fetch(url, fetchOptions);
    const data = await res.json();
    if (!data.ok) {
      console.error(`❌ Telegram API error [${method}]:`, data.description);
    }
    return data;
  } catch (err) {
    console.error(`❌ Telegram API fetch error [${method}]:`, err.message);
    return { ok: false };
  }
}

async function sendMessage(chatId, text, extra = {}) {
  return tgCall('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: extra.parse_mode || 'Markdown',
    ...(extra.reply_markup ? { reply_markup: extra.reply_markup } : {}),
  });
}

async function editMessageText(chatId, messageId, text, extra = {}) {
  return tgCall('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: extra.parse_mode || 'Markdown',
    ...(extra.reply_markup ? { reply_markup: extra.reply_markup } : {}),
  });
}

// ======================== ПОЛУЧЕНИЕ ОБНОВЛЕНИЙ ========================

async function getUpdates(offset = 0) {
  const result = await tgCall('getUpdates', {
    offset,
    timeout: 300,
    allowed_updates: ['message', 'callback_query'],
  });
  if (result.ok) {
    return result.result || [];
  }
  return [];
}

async function deleteWebhook() {
  const result = await tgCall('deleteWebhook');
  if (result.ok) {
    console.log('✅ Webhook удалён, переключаюсь на polling');
  }
  return result;
}

// ======================== POLLING ========================

let pollingOffset = 0;
let pollingActive = false;

async function startPolling() {
  if (pollingActive) return;
  pollingActive = true;
  console.log('🔄 Polling запущен...');
  
  while (pollingActive) {
    try {
      const updates = await getUpdates(pollingOffset);
      for (const update of updates) {
        pollingOffset = update.update_id + 1;
        processUpdate(update).catch(err => {
          console.error('❌ processUpdate error:', err.message);
        });
      }
    } catch (err) {
      console.error('❌ Polling error:', err.message);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

function stopPolling() {
  pollingActive = false;
  console.log('🛑 Polling остановлен');
}

// ======================== КНОПКИ ========================

function mainKeyboard(url) {
  return JSON.stringify({
    inline_keyboard: [
      [{ text: '🚀 Запустить Mini App', web_app: { url: url || config.MINI_APP_URL } }],
    ],
  });
}

function payKeyboard(paymentUrl) {
  return JSON.stringify({
    inline_keyboard: [
      [{ text: '💳 Оплатить 99₽/мес', url: paymentUrl }],
      [{ text: '◀️ Назад', callback_data: 'back_main' }],
    ],
  });
}

function mainMenuKeyboard() {
  return JSON.stringify({
    inline_keyboard: [
      [{ text: '🚀 Запустить Mini App', web_app: { url: config.MINI_APP_URL } }],
      [{ text: '💎 99₽/мес — Все эпохи', callback_data: 'buy_access' }],
      [{ text: '📖 Помощь', callback_data: 'help' }],
    ],
  });
}

// ======================== ЮKASSA ========================

async function createPayment(chatId, amount, description) {
  if (!config.YUKASSA_SHOP_ID || !config.YUKASSA_SECRET_KEY) {
    console.warn('⚠️ ЮKassa не настроена');
    return null;
  }

  const idempotenceKey = crypto.randomUUID();
  const auth = Buffer.from(
    `${config.YUKASSA_SHOP_ID}:${config.YUKASSA_SECRET_KEY}`
  ).toString('base64');

  const callbackUrl = config.EXTERNAL_URL
    ? `${config.EXTERNAL_URL}/api/yookassa/callback`
    : '';

  try {
    const res = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Idempotence-Key': idempotenceKey,
      },
      body: JSON.stringify({
        amount: {
          value: amount.toFixed(2),
          currency: 'RUB',
        },
        capture: true,
        confirmation: {
          type: 'redirect',
          return_url: config.MINI_APP_URL,
        },
        description: description || `Разблокировка всех эпох (chat: ${chatId})`,
        metadata: {
          chat_id: String(chatId),
          type: 'unlock_all',
        },
        ...(callbackUrl ? { notification_url: callbackUrl } : {}),
      }),
    });

    const payment = await res.json();

    if (payment.id) {
      // Сохраняем платёж в БД
      await db.createPayment(chatId, payment.id, amount, 'pending');
      return payment;
    } else {
      console.error('❌ ЮKassa error:', payment);
      return null;
    }
  } catch (err) {
    console.error('❌ ЮKassa create payment error:', err.message);
    return null;
  }
}

async function getPaymentStatus(paymentId) {
  if (!config.YUKASSA_SHOP_ID || !config.YUKASSA_SECRET_KEY) return null;
  
  const auth = Buffer.from(
    `${config.YUKASSA_SHOP_ID}:${config.YUKASSA_SECRET_KEY}`
  ).toString('base64');

  try {
    const res = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });
    return await res.json();
  } catch (err) {
    console.error('❌ ЮKassa get payment error:', err.message);
    return null;
  }
}

// ======================== ОБРАБОТКА КОМАНД ========================

async function handleStart(msg) {
  const chatId = msg.chat.id;
  const firstName = msg.from?.first_name || '';
  const lastName = msg.from?.last_name || '';
  const username = msg.from?.username || '';

  // Регистрируем пользователя
  await db.createUser(chatId, firstName, lastName, username);

  // Приветствие
  await sendMessage(
    chatId,
    `🎓 *Привет, ${firstName || 'друг'}!*\n\nЭто приложение для подготовки к ЕГЭ по истории России.\n\n📚 *Что внутри:*\n• 60+ уроков по всем эпохам\n• Интерактивные тесты и задания\n• Отслеживание прогресса\n• Система повторений\n• Статистика и достижения\n\n💎 *Тарифы:*\n▫️ *99₽/мес* — подписка на 1 месяц (все эпохи)\n▫️ *199₽* — полный доступ навсегда\n\nНажми кнопку ниже, чтобы начать! 👇`,
    { reply_markup: mainMenuKeyboard() }
  );
}

async function handleHelp(chatId) {
  const text = 
    `*📖 Помощь*\n\n` +
    `• */start* — открыть главное меню\n` +
    `• */help* — эта подсказка\n\n` +
    `*Что делать:*\n` +
    `1. Нажми "🚀 Запустить Mini App"\n` +
    `2. Выбери эпоху для изучения\n` +
    `3. Изучай даты и выполняй задания\n\n` +
    `*💎 Тарифы:*\n` +
    `▫️ *99₽/мес* — подписка на 1 месяц (все эпохи)\n` +
    `▫️ *199₽* — полный доступ навсегда\n\n` +
    `Нажми /buy или кнопку "💎 99₽/мес — Все эпохи".\n\n` +
    `*По вопросам:* @tema2017_ege`;

  await sendMessage(chatId, text);
}

async function handleBuy(chatId) {
  const user = await db.getUser(chatId);
  
  if (user && user.unlocked_all) {
    await sendMessage(
      chatId,
      '✅ *У вас уже есть полный доступ!*\n\nВсе эпохи разблокированы. Наслаждайтесь обучением! 🎓',
      { reply_markup: mainKeyboard() }
    );
    return;
  }

  // Создаём платёж
  const payment = await createPayment(
    chatId,
    config.PRICE_UNLOCK,
    'Разблокировка всех эпох истории России'
  );

  if (!payment) {
    await sendMessage(
      chatId,
      '❌ *Извините, оплата временно недоступна.*\n\nПожалуйста, попробуйте позже или свяжитесь с @tema2017_ege',
    );
    return;
  }

  const paymentUrl = payment.confirmation?.confirmation_url;
  if (!paymentUrl) {
    await sendMessage(
      chatId,
      '❌ *Ошибка создания платежа.* Попробуйте позже.',
    );
    return;
  }

  await sendMessage(
    chatId,
    `💎 *Оформление подписки*\n\n` +
    `▫️ *99₽/мес* — подписка на 1 месяц\n` +
    `▫️ *199₽* — полный доступ навсегда\n\n` +
    `После оплаты вам откроются все эпохи:\n` +
    `✅ Древняя Русь — XX век\n` +
    `✅ 60+ уроков и 250+ дат\n` +
    `✅ Все тесты и задания\n\n` +
    `*ID платежа:* \`${payment.id}\`\n\n` +
    `После оплаты нажми "✅ Я оплатил" для проверки.`,
    { reply_markup: payKeyboard(paymentUrl) }
  );
}

async function handleCheckPayment(chatId, paymentId) {
  // Сначала проверяем в БД
  const payment = await db.getPayment(paymentId);
  
  if (!payment) {
    await sendMessage(chatId, '❌ Платёж не найден. Попробуйте оплатить снова: /buy');
    return;
  }

  // Если уже подтверждён
  if (payment.status === 'succeeded') {
    await db.setUnlocked(chatId, true);
    await sendMessage(
      chatId,
      '✅ *Оплата подтверждена!*\n\nВсе эпохи разблокированы! 🎉\nНажми кнопку ниже, чтобы начать:',
      { reply_markup: mainKeyboard() }
    );
    return;
  }

  // Проверяем статус в ЮKassa
  const yooPayment = await getPaymentStatus(paymentId);
  
  if (yooPayment && yooPayment.status === 'succeeded') {
    await db.updatePaymentStatus(paymentId, 'succeeded');
    await db.setUnlocked(chatId, true);
    
    await sendMessage(
      chatId,
      '✅ *Оплата подтверждена! СПАСИБО!* 🎉\n\nВсе эпохи разблокированы.\nНажми кнопку ниже, чтобы начать обучение:',
      { reply_markup: mainKeyboard() }
    );
    
    // Уведомление админу
    if (config.ADMIN_ID) {
      const user = await db.getUser(chatId);
      const name = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || '—';
      const username = user?.username ? `@${user?.username}` : '—';
      
      await sendMessage(
        config.ADMIN_ID,
        `💰 *Новая оплата!*\n\nПользователь: ${name} (${username})\nChat ID: \`${chatId}\`\nСумма: ${payment.amount}₽\nПлатёж: \`${paymentId}\``
      );
    }
  } else {
    const status = yooPayment?.status || 'неизвестно';
    await sendMessage(
      chatId,
      `⏳ *Платёж ещё не подтверждён.*\n\nСтатус: \`${status}\`\n\nЕсли вы уже оплатили, попробуйте проверить через минуту.\nЕсли проблема не решается — напишите @tema2017_ege\n\nID платежа: \`${paymentId}\``
    );
  }
}

// ======================== АДМИН-ПАНЕЛЬ ========================

async function handleAdmin(msg) {
  const chatId = msg.chat.id;
  if (chatId !== config.ADMIN_ID) {
    return sendMessage(chatId, '⛔ Доступ запрещён.');
  }

  const text = msg.text || '';
  const args = text.split(' ').slice(1);
  const command = args[0];

  const helpText = 
    `*🛠 Админ-панель*\n\n` +
    `*/admin stats* — статистика\n` +
    `*/admin unlock <chatId>* — разблокировать все эпохи\n` +
    `*/admin lock <chatId>* — забрать разблокировку\n` +
    `*/admin broadcast <текст>* — разослать сообщение\n` +
    `*/admin users* — список пользователей\n` +
    `*/admin webhook* — переустановить webhook\n` +
    `*/admin check <paymentId>* — проверить платёж\n` +
    `*/admin testpay <chatId>* — имитировать оплату (для теста)`;

  if (!command) {
    return sendMessage(chatId, helpText);
  }

  // ===== СТАТИСТИКА =====
  if (command === 'stats') {
    const stats = await db.getStats();
    return sendMessage(chatId,
      `*📊 Статистика*\n\n` +
      `👥 Всего пользователей: *${stats.total}*\n` +
      `🌟 С разблокировкой: *${stats.unlocked}*\n` +
      `⚡ Активных сегодня: *${stats.active_today}*`
    );
  }

  // ===== СПИСОК ПОЛЬЗОВАТЕЛЕЙ =====
  if (command === 'users') {
    const users = await db.getAllUsers();
    if (users.length === 0) {
      return sendMessage(chatId, '❌ Нет зарегистрированных пользователей.');
    }

    const list = users.slice(0, 20).map(u => {
      const name = [u.first_name, u.last_name].filter(Boolean).join(' ') || '—';
      const username = u.username ? `@${u.username}` : '—';
      const unlocked = u.unlocked_all ? ' ✅' : '';
      const activity = u.last_activity 
        ? new Date(u.last_activity).toLocaleDateString('ru-RU') 
        : '—';
      return `• \`${u.chat_id}\` ${name} (${username})${unlocked} [${activity}]`;
    }).join('\n');

    return sendMessage(chatId, 
      `*👥 Пользователи (${users.length}):*\n\n${list}`
    );
  }

  // ===== РАЗБЛОКИРОВАТЬ =====
  if (command === 'unlock') {
    const targetId = parseInt(args[1]);
    if (!targetId) {
      return sendMessage(chatId, '❌ Укажи chatId: \`/admin unlock 123456789\`');
    }

    await db.createUser(targetId, '', '', '');
    await db.setUnlocked(targetId, true);
    await sendMessage(chatId, `✅ Эпохи разблокированы для \`${targetId}\``);

    try {
      await sendMessage(targetId,
        `🎉 *Все эпохи разблокированы!*\n\nТебе открыты все уроки и материалы. Нажми кнопку ниже, чтобы начать:`,
        { reply_markup: mainKeyboard() }
      );
    } catch {
      await sendMessage(chatId, `⚠️ Не удалось уведомить пользователя \`${targetId}\``);
    }
    return;
  }

  // ===== ЗАБРАТЬ РАЗБЛОКИРОВКУ =====
  if (command === 'lock') {
    const targetId = parseInt(args[1]);
    if (!targetId) {
      return sendMessage(chatId, '❌ Укажи chatId: \`/admin lock 123456789\`');
    }
    await db.setUnlocked(targetId, false);
    return sendMessage(chatId, `✅ Разблокировка отозвана для \`${targetId}\``);
  }

  // ===== РАССЫЛКА =====
  if (command === 'broadcast') {
    const broadcastText = args.slice(1).join(' ');
    if (!broadcastText) {
      return sendMessage(chatId, '❌ Укажи текст: \`/admin broadcast Привет всем!\`');
    }

    const users = await db.getAllUsers();
    if (users.length === 0) {
      return sendMessage(chatId, '❌ Нет пользователей для рассылки.');
    }

    await sendMessage(chatId, `📨 Начинаю рассылку *${users.length}* пользователям...`);

    let sent = 0;
    let failed = 0;

    for (const user of users) {
      try {
        await sendMessage(user.chat_id, broadcastText);
        sent++;
        if (sent % 10 === 0) {
          await new Promise(r => setTimeout(r, 100));
        }
      } catch {
        failed++;
      }
    }

    return sendMessage(chatId,
      `✅ Рассылка завершена!\n📨 Отправлено: *${sent}*\n❌ Ошибок: *${failed}*`
    );
  }

  // ===== ПЕРЕУСТАНОВИТЬ WEBHOOK =====
  if (command === 'webhook') {
    const result = await setWebhook();
    return sendMessage(chatId, result.ok 
      ? '✅ Webhook переустановлен' 
      : `❌ Ошибка: ${result.description}`
    );
  }

  // ===== ПРОВЕРИТЬ ПЛАТЁЖ =====
  if (command === 'check') {
    const paymentId = args[1];
    if (!paymentId) {
      return sendMessage(chatId, '❌ Укажи paymentId');
    }

    const payment = await db.getPayment(paymentId);
    if (payment) {
      const yooPayment = await getPaymentStatus(paymentId);
      return sendMessage(chatId,
        `*🔍 Платёж*\n\n` +
        `ID: \`${payment.payment_id}\`\n` +
        `Chat ID: \`${payment.chat_id}\`\n` +
        `Сумма: ${payment.amount}₽\n` +
        `Статус в БД: \`${payment.status}\`\n` +
        `Статус в ЮKassa: \`${yooPayment?.status || 'ошибка'}\``
      );
    } else {
      return sendMessage(chatId, '❌ Платёж не найден в БД.');
    }
  }

  // ===== ТЕСТОВАЯ ОПЛАТА =====
  if (command === 'testpay') {
    const targetId = parseInt(args[1]);
    if (!targetId) {
      return sendMessage(chatId, '❌ Укажи chatId: \`/admin testpay 123456789\`');
    }

    await db.createUser(targetId, '', '', '');
    await db.createPayment(targetId, `test_${Date.now()}`, 199, 'succeeded');
    await db.setUnlocked(targetId, true);

    await sendMessage(chatId, `✅ Тестовая оплата для \`${targetId}\` выполнена`);

    try {
      await sendMessage(targetId,
        `🎉 *Полный доступ активирован!*\n\nВсе эпохи разблокированы. Нажми кнопку ниже, чтобы начать:`,
        { reply_markup: mainKeyboard() }
      );
    } catch {
      await sendMessage(chatId, `⚠️ Не удалось уведомить пользователя \`${targetId}\``);
    }
    return;
  }

  return sendMessage(chatId, '❌ Неизвестная команда.');
}

// ======================== ОБРАБОТКА СООБЩЕНИЙ ========================

async function processUpdate(update) {
  try {
    // Callback query
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id;
      const messageId = cb.message.message_id;
      const data = cb.data || '';

      // Подтверждаем получение callback
      await tgCall('answerCallbackQuery', { callback_query_id: cb.id });

      if (data === 'back_main') {
        await editMessageText(chatId, messageId, 
          '🚀 *Главное меню*\n\nВыберите действие:',
          { reply_markup: mainMenuKeyboard() }
        );
      } else if (data === 'buy_access') {
        await editMessageText(chatId, messageId, '⏳ Создаю платёж...');
        await handleBuy(chatId);
      } else if (data === 'help') {
        await editMessageText(chatId, messageId, '⏳ Загружаю...');
        // Сначала отправляем новое сообщение с помощью
        await sendMessage(chatId,
          `*📖 Помощь*\n\n` +
          `Нажми "🚀 Запустить Mini App", чтобы открыть приложение.\n\n` +
          `В приложении ты найдёшь:\n` +
          `• Все эпохи истории России\n` +
          `• Уроки и тесты\n` +
          `• Статистику прогресса\n\n` +
          `💎 Купить полный доступ: /buy`
        );
      }
      return;
    }

    // Обычное сообщение
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const text = (msg.text || '').trim();
      const from = msg.from;
      
      // Регистрируем/обновляем пользователя при любом сообщении
      if (from) {
        await db.createUser(
          chatId, 
          from.first_name || '', 
          from.last_name || '', 
          from.username || ''
        );
      }

      // === Команды ===
      if (text === '/start' || text.startsWith('/start ')) {
        await handleStart(msg);
      } else if (text === '/help') {
        await handleHelp(chatId);
      } else if (text === '/buy' || text === '/pay') {
        await handleBuy(chatId);
      } else if (text.startsWith('/check ')) {
        const paymentId = text.split(' ')[1];
        if (paymentId) {
          await handleCheckPayment(chatId, paymentId);
        } else {
          await sendMessage(chatId, '❌ Укажи ID платежа: \`/check payment_id\`');
        }
      } else if (text.startsWith('/admin')) {
        await handleAdmin(msg);
      } else if (text.startsWith('/')) {
        await sendMessage(chatId, 
          '❌ Неизвестная команда. Используй /start или /help'
        );
      } else {
        // Любое сообщение — показываем меню
        await sendMessage(chatId,
          '🚀 *Главное меню*\n\nИспользуй команды:\n' +
          '/start — начать\n/help — помощь\n/buy — купить доступ',
          { reply_markup: mainKeyboard() }
        );
      }
    }
  } catch (err) {
    console.error('❌ processUpdate error:', err.message);
  }
}

// ======================== EXPRESS СЕРВЕР ========================

const app = express();

// Парсинг JSON (кроме вебхуков Telegram — они приходят в text/plain)
app.use('/api', corsMiddleware);
app.use('/api', express.json());
app.use('/webhook', express.text({ type: 'text/plain' }));
app.use('/health', corsMiddleware);
app.use('/', corsMiddleware);

// ===== API для Mini App =====

// Проверка статуса пользователя (для Mini App)
app.get('/api/check-access', corsMiddleware, async (req, res) => {
  const chatId = parseInt(req.query.chat_id);
  const secret = req.query.secret;

  if (!chatId) {
    return res.json({ ok: false, error: 'chat_id required' });
  }

  // Проверка секрета (необязательно, но желательно)
  if (secret && secret !== config.ADMIN_API_SECRET) {
    return res.json({ ok: false, error: 'invalid secret' });
  }

  try {
    const user = await db.getUser(chatId);
    return res.json({
      ok: true,
      unlocked: user ? user.unlocked_all : false,
      user: user ? {
        chat_id: user.chat_id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        first_seen: user.first_seen,
        last_activity: user.last_activity,
        unlocked_all: user.unlocked_all,
      } : null,
    });
  } catch (err) {
    return res.json({ ok: false, error: err.message });
  }
});

// Разблокировка через API (для интеграции с Mini App)
app.post('/api/unlock', express.json(), async (req, res) => {
  const { chat_id, secret } = req.body;

  if (secret !== config.ADMIN_API_SECRET) {
    return res.status(403).json({ ok: false, error: 'invalid secret' });
  }

  if (!chat_id) {
    return res.json({ ok: false, error: 'chat_id required' });
  }

  try {
    await db.createUser(chat_id, '', '', '');
    await db.setUnlocked(chat_id, true);
    return res.json({ ok: true });
  } catch (err) {
    return res.json({ ok: false, error: err.message });
  }
});

// Статистика для админ-панели Mini App
app.get('/api/stats', async (req, res) => {
  const secret = req.query.secret;
  if (secret !== config.ADMIN_API_SECRET) {
    return res.status(403).json({ ok: false, error: 'invalid secret' });
  }

  try {
    const stats = await db.getStats();
    return res.json({ ok: true, ...stats });
  } catch (err) {
    return res.json({ ok: false, error: err.message });
  }
});

// ===== Webhook от ЮKassa =====

app.post('/api/yookassa/callback', async (req, res) => {
  try {
    const { object, event } = req.body;
    
    if (!object || !object.id) {
      return res.status(400).json({ error: 'invalid payload' });
    }

    const paymentId = object.id;
    const status = object.status;
    const metadata = object.metadata || {};
    const chatId = parseInt(metadata.chat_id || '0');

    console.log(`🔔 ЮKassa callback: ${paymentId} -> ${status}`);

    if (status === 'succeeded' && chatId) {
      // Обновляем статус платежа
      await db.updatePaymentStatus(paymentId, 'succeeded');
      
      // Разблокируем пользователя
      await db.setUnlocked(chatId, true);

      // Уведомление пользователю
      await sendMessage(chatId,
        '✅ *Оплата прошла успешно! СПАСИБО!* 🎉\n\nВсе эпохи разблокированы.\nНажми кнопку ниже, чтобы начать:',
        { reply_markup: mainKeyboard() }
      );

      // Уведомление админу
      if (config.ADMIN_ID) {
        const user = await db.getUser(chatId);
        const name = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || '—';
        const username = user?.username ? `@${user?.username}` : '—';
        
        await sendMessage(
          config.ADMIN_ID,
          `💰 *Новая оплата (авто)!*\n\nПользователь: ${name} (${username})\nChat ID: \`${chatId}\`\nСумма: ${object.amount?.value || '?'}₽\nПлатёж: \`${paymentId}\``
        );
      }
    } else if (status === 'canceled') {
      await db.updatePaymentStatus(paymentId, 'canceled');
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('❌ ЮKassa callback error:', err.message);
    res.status(200).json({ ok: true }); // Always return 200 to ЮKassa
  }
});

// ===== Прокси для Telegram API (обходит блокировки) =====
// Используется, когда TG_API_URL = http://localhost:3000/tg-proxy
// Принимает POST с JSON { method, params } и отправляет запрос к api.telegram.org

app.post('/tg-proxy', async (req, res) => {
  try {
    const { method, params } = req.body;
    
    if (!method) {
      return res.status(400).json({ ok: false, error: 'method required' });
    }
    
    if (!config.TELEGRAM_TOKEN) {
      return res.status(500).json({ ok: false, error: 'TELEGRAM_BOT_TOKEN not configured' });
    }

    const url = `https://api.telegram.org/bot${config.TELEGRAM_TOKEN}/${method}`;
    
    const apiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params || {}),
      // Таймаут 30 секунд для long polling
      signal: AbortSignal.timeout(35000),
    });

    const data = await apiRes.json();
    res.json(data);
  } catch (err) {
    console.error('❌ TG proxy error:', err.message);
    res.json({ ok: false, error: err.message });
  }
});

// ===== Webhook от Telegram (не используется, оставлен для совместимости) =====

app.post('/webhook', async (req, res) => {
  res.status(200).json({ ok: true });
});

// ===== Health check =====

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '2.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    bot: config.BOT_USERNAME,
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'History EGE Bot',
    version: '2.0.0',
    endpoints: {
      webhook: 'POST /webhook',
      checkAccess: 'GET /api/check-access',
      unlock: 'POST /api/unlock',
      stats: 'GET /api/stats',
      yookassa: 'POST /api/yookassa/callback',
      health: 'GET /health',
    },
  });
});

// ======================== ЗАПУСК ========================

async function start() {
  const port = config.API_PORT || 3000;
  
  app.listen(port, '0.0.0.0', async () => {
    console.log(`\n🤖 History EGE Bot v2.0.0`);
    console.log(`📡 Сервер запущен на порту ${port}`);
    console.log(`🆔 Бот: @${config.BOT_USERNAME}`);
    console.log(`🔗 Mini App: ${config.MINI_APP_URL}`);
    console.log(`💰 ЮKassa: ${config.YUKASSA_SHOP_ID ? 'настроена' : 'НЕ настроена'}`);
    console.log(`💾 PostgreSQL: ${process.env.DATABASE_URL ? 'есть' : 'НЕТ'}`);
    
    // Удаляем webhook и переключаемся на polling
    if (config.TELEGRAM_TOKEN) {
      await deleteWebhook();
      startPolling();
    }
  });
}

// Обработка сигналов завершения
process.on('SIGTERM', () => {
  console.log('🛑 Получен SIGTERM, завершаю работу...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Получен SIGINT, завершаю работу...');
  process.exit(0);
});

start().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});