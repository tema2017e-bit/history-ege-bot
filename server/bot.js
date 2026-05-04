const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MINI_APP_URL = process.env.MINI_APP_URL || 'https://history-ege.vercel.app';
const ADMIN_ID = 1794125580;
const USERS_FILE = path.join(__dirname, 'users.json');
const ADMIN_API_SECRET = process.env.ADMIN_API_SECRET || 'admin-secret-2024';
const API_URL = process.env.API_URL || 'https://history-ege.vercel.app';

if (!TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN не указан в .env');
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

// ==================== ХРАНИЛИЩЕ ПОЛЬЗОВАТЕЛЕЙ ====================

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Ошибка загрузки users.json:', e.message);
  }
  return {};
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function registerUser(chatId, msg) {
  const users = loadUsers();
  if (!users[chatId]) {
    users[chatId] = {
      firstSeen: new Date().toISOString(),
      firstName: msg.from?.first_name || '',
      lastName: msg.from?.last_name || '',
      username: msg.from?.username || '',
      lastActivity: new Date().toISOString(),
      unlockedAll: false,
    };
  } else {
    users[chatId].lastActivity = new Date().toISOString();
    users[chatId].firstName = msg.from?.first_name || users[chatId].firstName;
    users[chatId].lastName = msg.from?.last_name || users[chatId].lastName;
    users[chatId].username = msg.from?.username || users[chatId].username;
  }
  saveUsers(users);
}

// ==================== КОМАНДЫ ====================

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'друг';
  registerUser(chatId, msg);

  bot.sendMessage(
    chatId,
    `🎓 *Привет, ${firstName}!*\n\nЭто приложение для подготовки к ЕГЭ по истории России.\n\n📚 *Что внутри:*\n• 60+ уроков по всем эпохам\n• Интерактивные тесты и задания\n• Отслеживание прогресса\n• Система повторений\n• Статистика и достижения\n\nНажми кнопку ниже, чтобы начать! 👇`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🚀 Запустить Mini App',
              web_app: { url: MINI_APP_URL }
            }
          ]
        ]
      }
    }
  );
});

// /app
bot.onText(/\/app/, (msg) => {
  const chatId = msg.chat.id;
  registerUser(chatId, msg);
  bot.sendMessage(
    chatId,
    'Нажми кнопку, чтобы открыть приложение:',
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '📱 Открыть Mini App',
              web_app: { url: MINI_APP_URL }
            }
          ]
        ]
      }
    }
  );
});

// /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  registerUser(chatId, msg);
  bot.sendMessage(
    chatId,
    `*📖 Помощь*\n\n` +
    `• */start* — открыть главное меню\n` +
    `• */app* — запустить Mini App\n` +
    `• */help* — эта подсказка\n\n` +
    `*По вопросам:* @tema2017_ege`,
    { parse_mode: 'Markdown' }
  );
});

// ==================== АДМИН-ПАНЕЛЬ ====================

bot.onText(/\/admin/, async (msg) => {
  const chatId = msg.chat.id;

  if (chatId !== ADMIN_ID) {
    return bot.sendMessage(chatId, '⛔ Доступ запрещён.');
  }

  const text = msg.text || '';
  const args = text.split(' ').slice(1); // ["unlock", "12345"] или ["stats"] или ["broadcast", "текст"]

  if (args.length === 0) {
    return bot.sendMessage(
      chatId,
      `*🛠 Админ-панель*\n\n` +
      `*/admin stats* — статистика\n` +
      `*/admin unlock <chatId>* — разблокировать все эпохи пользователю\n` +
      `*/admin lock <chatId>* — забрать разблокировку\n` +
      `*/admin broadcast <текст>* — разослать сообщение всем\n` +
      `*/admin users* — список пользователей`,
      { parse_mode: 'Markdown' }
    );
  }

  const command = args[0];

  // ===== СТАТИСТИКА =====
  if (command === 'stats') {
    const users = loadUsers();
    const total = Object.keys(users).length;
    const unlocked = Object.values(users).filter(u => u.unlockedAll).length;
    const today = new Date().toDateString();
    const activeToday = Object.values(users).filter(u => {
      const d = new Date(u.lastActivity).toDateString();
      return d === today;
    }).length;

    const msgText = 
      `*📊 Статистика*\n\n` +
      `👥 Всего пользователей: *${total}*\n` +
      `🌟 С разблокировкой: *${unlocked}*\n` +
      `⚡ Активных сегодня: *${activeToday}*`;

    return bot.sendMessage(chatId, msgText, { parse_mode: 'Markdown' });
  }

  // ===== СПИСОК ПОЛЬЗОВАТЕЛЕЙ =====
  if (command === 'users') {
    const users = loadUsers();
    const entries = Object.entries(users);
    if (entries.length === 0) {
      return bot.sendMessage(chatId, '❌ Нет зарегистрированных пользователей.');
    }

    // Показываем только первых 20, чтобы не превысить лимит
    const list = entries.slice(0, 20).map(([id, u]) => {
      const name = [u.firstName, u.lastName].filter(Boolean).join(' ') || '—';
      const username = u.username ? `@${u.username}` : '—';
      const unlocked = u.unlockedAll ? ' ✅' : '';
      return `• \`${id}\` ${name} (${username})${unlocked}`;
    }).join('\n');

    const total = entries.length;
    const more = total > 20 ? `\n...и ещё ${total - 20}` : '';

    return bot.sendMessage(
      chatId,
      `*👥 Пользователи (${total}):*\n\n${list}${more}`,
      { parse_mode: 'Markdown' }
    );
  }

  // ===== РАЗБЛОКИРОВАТЬ ВСЕ ЭПОХИ =====
  if (command === 'unlock') {
    const targetId = parseInt(args[1]);
    if (!targetId) {
      return bot.sendMessage(chatId, '❌ Укажи chatId: `/admin unlock 123456789`', { parse_mode: 'Markdown' });
    }

    // Сохраняем в локальный users.json
    const users = loadUsers();
    if (!users[targetId]) {
      users[targetId] = {
        firstSeen: new Date().toISOString(),
        firstName: '',
        lastName: '',
        username: '',
        lastActivity: new Date().toISOString(),
      };
    }
    users[targetId].unlockedAll = true;
    saveUsers(users);

    // Отправляем запрос на API, чтобы статус был доступен приложению
    try {
      await fetch(`${API_URL}/api/unlock-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetId,
          action: 'unlock',
          secret: ADMIN_API_SECRET
        })
      });
    } catch (e) {
      console.error('API unlock error:', e.message);
    }

    await bot.sendMessage(chatId, `✅ Эпохи разблокированы для \`${targetId}\``, { parse_mode: 'Markdown' });

    // Пробуем отправить пользователю уведомление
    try {
      await bot.sendMessage(
        targetId,
        `🎉 *Все эпохи разблокированы!*\n\nТебе открыты все уроки и материалы. Нажми кнопку ниже, чтобы начать:`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🚀 Открыть Mini App', web_app: { url: MINI_APP_URL } }]
            ]
          }
        }
      );
    } catch (e) {
      await bot.sendMessage(chatId, `⚠️ Не удалось уведомить пользователя \`${targetId}\` (возможно, не начинал диалог с ботом)`, { parse_mode: 'Markdown' });
    }

    return;
  }

  // ===== ЗАБРАТЬ РАЗБЛОКИРОВКУ =====
  if (command === 'lock') {
    const targetId = parseInt(args[1]);
    if (!targetId) {
      return bot.sendMessage(chatId, '❌ Укажи chatId: `/admin lock 123456789`', { parse_mode: 'Markdown' });
    }

    const users = loadUsers();
    if (users[targetId]) {
      users[targetId].unlockedAll = false;
      saveUsers(users);
    }

    // Отправляем запрос на API
    try {
      await fetch(`${API_URL}/api/unlock-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetId,
          action: 'lock',
          secret: ADMIN_API_SECRET
        })
      });
    } catch (e) {
      console.error('API lock error:', e.message);
    }

    return bot.sendMessage(chatId, `✅ Разблокировка отозвана для \`${targetId}\``, { parse_mode: 'Markdown' });
  }

  // ===== РАССЫЛКА =====
  if (command === 'broadcast') {
    const broadcastText = args.slice(1).join(' ');
    if (!broadcastText) {
      return bot.sendMessage(chatId, '❌ Укажи текст: `/admin broadcast Привет всем!`', { parse_mode: 'Markdown' });
    }

    const users = loadUsers();
    const chatIds = Object.keys(users).map(Number);
    
    if (chatIds.length === 0) {
      return bot.sendMessage(chatId, '❌ Нет пользователей для рассылки.');
    }

    await bot.sendMessage(chatId, `📨 Начинаю рассылку *${chatIds.length}* пользователям...`, { parse_mode: 'Markdown' });

    let sent = 0;
    let failed = 0;

    for (const id of chatIds) {
      try {
        await bot.sendMessage(id, broadcastText, { parse_mode: 'Markdown' });
        sent++;
        // Небольшая задержка, чтобы не превысить лимиты Telegram
        await new Promise(r => setTimeout(r, 50));
      } catch (e) {
        failed++;
      }
    }

    return bot.sendMessage(
      chatId,
      `✅ Рассылка завершена!\n📨 Отправлено: *${sent}*\n❌ Ошибок: *${failed}*`,
      { parse_mode: 'Markdown' }
    );
  }

  // Неизвестная команда
  return bot.sendMessage(
    chatId,
    `❌ Неизвестная команда. Используй:\n` +
    `• \`/admin stats\`\n` +
    `• \`/admin unlock <chatId>\`\n` +
    `• \`/admin lock <chatId>\`\n` +
    `• \`/admin broadcast <текст>\`\n` +
    `• \`/admin users\``,
    { parse_mode: 'Markdown' }
  );
});

// ==================== ЛЮБОЕ СООБЩЕНИЕ ====================

bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    const chatId = msg.chat.id;
    registerUser(chatId, msg);
    bot.sendMessage(
      chatId,
      'Используй /start чтобы открыть приложение, или /help для подсказки.',
      {
        reply_markup: {
          remove_keyboard: true
        }
      }
    );
  }
});

console.log(`🤖 Бот запущен! Админ ID: ${ADMIN_ID}`);

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('\n🛑 Бот остановлен (SIGINT)');
  bot.stopPolling();
});
process.once('SIGTERM', () => {
  console.log('\n🛑 Бот остановлен (SIGTERM)');
  bot.stopPolling();
});