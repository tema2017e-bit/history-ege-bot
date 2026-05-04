// Telegram Bot для Vercel (вебхук)
// Управляется через Vercel KV для хранения данных

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_SECRET = process.env.ADMIN_API_SECRET || 'admin-secret-2024';
const ADMIN_ID = 1794125580;
const MINI_APP_URL = process.env.MINI_APP_URL || 'https://history-ege.vercel.app';
const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

// ==================== KV ХРАНИЛИЩЕ ====================

async function kvGet(key) {
  if (!KV_REST_API_URL) return null;
  try {
    const res = await fetch(`${KV_REST_API_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
    });
    const data = await res.json();
    return data.result ? JSON.parse(data.result) : null;
  } catch {
    return null;
  }
}

async function kvSet(key, value) {
  if (!KV_REST_API_URL) return;
  try {
    await fetch(`${KV_REST_API_URL}/set/${key}`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${KV_REST_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(value)),
    });
  } catch (e) {
    console.error('KV set error:', e.message);
  }
}

// ==================== ПОЛЬЗОВАТЕЛИ ====================

async function loadUsers() {
  const data = await kvGet('users');
  return data || {};
}

async function saveUsers(users) {
  await kvSet('users', users);
}

async function registerUser(msg) {
  const chatId = msg.chat.id;
  const users = await loadUsers();
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
  await saveUsers(users);
}

// ==================== ОТПРАВКА СООБЩЕНИЙ TELEGRAM ====================

async function sendMessage(chatId, text, extra = {}) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const body = {
    chat_id: chatId,
    text,
    parse_mode: extra.parse_mode || 'Markdown',
    ...(extra.reply_markup ? { reply_markup: extra.reply_markup } : {}),
  };
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

// ==================== ОБРАБОТКА КОМАНД ====================

async function handleStart(msg) {
  const chatId = msg.chat.id;
  const firstName = msg.from?.first_name || 'друг';
  await registerUser(msg);

  return sendMessage(
    chatId,
    `🎓 *Привет, ${firstName}!*\n\nЭто приложение для подготовки к ЕГЭ по истории России.\n\n📚 *Что внутри:*\n• 60+ уроков по всем эпохам\n• Интерактивные тесты и задания\n• Отслеживание прогресса\n• Система повторений\n• Статистика и достижения\n\nНажми кнопку ниже, чтобы начать! 👇`,
    {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: '🚀 Запустить Mini App', web_app: { url: MINI_APP_URL } }],
        ],
      }),
    }
  );
}

async function handleApp(msg) {
  const chatId = msg.chat.id;
  await registerUser(msg);
  
  return sendMessage(chatId, 'Нажми кнопку, чтобы открыть приложение:', {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: '📱 Открыть Mini App', web_app: { url: MINI_APP_URL } }],
      ],
    }),
  });
}

async function handleHelp(msg) {
  const chatId = msg.chat.id;
  await registerUser(msg);
  
  return sendMessage(
    chatId,
    `*📖 Помощь*\n\n` +
    `• */start* — открыть главное меню\n` +
    `• */app* — запустить Mini App\n` +
    `• */help* — эта подсказка\n\n` +
    `*По вопросам:* @tema2017_ege`
  );
}

async function handleAdmin(msg) {
  const chatId = msg.chat.id;
  if (chatId !== ADMIN_ID) {
    return sendMessage(chatId, '⛔ Доступ запрещён.');
  }

  const text = msg.text || '';
  const args = text.split(' ').slice(1);
  const command = args[0];

  if (!command) {
    return sendMessage(chatId,
      `*🛠 Админ-панель*\n\n` +
      `*/admin stats* — статистика\n` +
      `*/admin unlock <chatId>* — разблокировать все эпохи\n` +
      `*/admin lock <chatId>* — забрать разблокировку\n` +
      `*/admin broadcast <текст>* — разослать сообщение\n` +
      `*/admin users* — список пользователей`
    );
  }

  const users = await loadUsers();

  // ===== СТАТИСТИКА =====
  if (command === 'stats') {
    const total = Object.keys(users).length;
    const unlocked = Object.values(users).filter(u => u.unlockedAll).length;
    const today = new Date().toDateString();
    const activeToday = Object.values(users).filter(u => {
      const d = new Date(u.lastActivity).toDateString();
      return d === today;
    }).length;

    return sendMessage(chatId,
      `*📊 Статистика*\n\n` +
      `👥 Всего пользователей: *${total}*\n` +
      `🌟 С разблокировкой: *${unlocked}*\n` +
      `⚡ Активных сегодня: *${activeToday}*`
    );
  }

  // ===== СПИСОК ПОЛЬЗОВАТЕЛЕЙ =====
  if (command === 'users') {
    const entries = Object.entries(users);
    if (entries.length === 0) {
      return sendMessage(chatId, '❌ Нет зарегистрированных пользователей.');
    }

    const list = entries.slice(0, 20).map(([id, u]) => {
      const name = [u.firstName, u.lastName].filter(Boolean).join(' ') || '—';
      const username = u.username ? `@${u.username}` : '—';
      const unlocked = u.unlockedAll ? ' ✅' : '';
      return `• \`${id}\` ${name} (${username})${unlocked}`;
    }).join('\n');

    const total = entries.length;
    const more = total > 20 ? `\n...и ещё ${total - 20}` : '';

    return sendMessage(chatId, `*👥 Пользователи (${total}):*\n\n${list}${more}`);
  }

  // ===== РАЗБЛОКИРОВАТЬ =====
  if (command === 'unlock') {
    const targetId = parseInt(args[1]);
    if (!targetId) {
      return sendMessage(chatId, '❌ Укажи chatId: \`/admin unlock 123456789\`');
    }

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
    await saveUsers(users);

    await sendMessage(chatId, `✅ Эпохи разблокированы для \`${targetId}\``);

    try {
      await sendMessage(targetId,
        `🎉 *Все эпохи разблокированы!*\n\nТебе открыты все уроки и материалы. Нажми кнопку ниже, чтобы начать:`,
        {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [{ text: '🚀 Открыть Mini App', web_app: { url: MINI_APP_URL } }],
            ],
          }),
        }
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

    if (users[targetId]) {
      users[targetId].unlockedAll = false;
      await saveUsers(users);
    }
    return sendMessage(chatId, `✅ Разблокировка отозвана для \`${targetId}\``);
  }

  // ===== РАССЫЛКА =====
  if (command === 'broadcast') {
    const broadcastText = args.slice(1).join(' ');
    if (!broadcastText) {
      return sendMessage(chatId, '❌ Укажи текст: \`/admin broadcast Привет всем!\`');
    }

    const chatIds = Object.keys(users).map(Number);
    if (chatIds.length === 0) {
      return sendMessage(chatId, '❌ Нет пользователей для рассылки.');
    }

    await sendMessage(chatId, `📨 Начинаю рассылку *${chatIds.length}* пользователям...`);

    let sent = 0;
    let failed = 0;

    for (const id of chatIds) {
      try {
        await sendMessage(id, broadcastText);
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

  return sendMessage(chatId, '❌ Неизвестная команда.');
}

async function handleMessage(msg) {
  const chatId = msg.chat.id;
  await registerUser(msg);
  return sendMessage(
    chatId,
    'Используй /start чтобы открыть приложение, или /help для подсказки.'
  );
}

// ==================== ОСНОВНОЙ ХЕНДЛЕР ====================

export default async function handler(req, res) {
  // Только POST
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, message: 'Bot webhook is active' });
  }

  const update = req.body;

  // Проверка токена
  if (!TELEGRAM_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN not set');
    return res.status(500).json({ error: 'Bot token not configured' });
  }

  try {
    // Обработка сообщений
    if (update.message) {
      const msg = update.message;
      const text = msg.text || '';

      if (text === '/start' || text.startsWith('/start ')) {
        await handleStart(msg);
      } else if (text === '/app') {
        await handleApp(msg);
      } else if (text === '/help') {
        await handleHelp(msg);
      } else if (text.startsWith('/admin')) {
        await handleAdmin(msg);
      } else if (text.startsWith('/')) {
        // Неизвестная команда
        await sendMessage(msg.chat.id, 'Неизвестная команда. Используй /help');
      } else {
        await handleMessage(msg);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}