// API эндпоинт для проверки статуса подписки
// GET /api/unlock-status?userId=123 — проверить статус (прокси на API бота)
// POST /api/unlock-status — установить статус (только с секретным ключом)

const ADMIN_SECRET = process.env.ADMIN_API_SECRET || 'admin-secret-2024';

// URL API бота (VDS/Render)
const BOT_API_URL = process.env.BOT_API_URL || 'https://history-ege-bot.onrender.com';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET — проверка статуса через API бота
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }

    try {
      // Прокси-запрос к API бота на VDS/Render
      const botRes = await fetch(
        `${BOT_API_URL}/api/check-access?chat_id=${userId}&secret=${ADMIN_SECRET}`,
        { signal: AbortSignal.timeout(5000) }
      );
      
      if (!botRes.ok) {
        // Если бот недоступен — падаем с ошибкой
        return res.status(502).json({ 
          error: 'Bot API unavailable', 
          userId: parseInt(userId),
          unlockedAll: false 
        });
      }

      const data = await botRes.json();
      
      return res.status(200).json({ 
        userId: parseInt(userId), 
        unlockedAll: data.unlocked === true 
      });
    } catch (err) {
      console.error('Error checking access via bot API:', err.message);
      return res.status(502).json({ 
        error: 'Bot API request failed',
        userId: parseInt(userId),
        unlockedAll: false 
      });
    }
  }

  // POST — установка статуса (только с секретным ключом)
  // Прокси-запрос к API бота на VDS/Render
  if (req.method === 'POST') {
    const { userId, action, secret } = req.body;

    if (secret !== ADMIN_SECRET) {
      return res.status(403).json({ error: 'Invalid secret' });
    }

    if (!userId || !['unlock', 'lock'].includes(action)) {
      return res.status(400).json({ error: 'Invalid params. Need: userId, action (unlock|lock), secret' });
    }

    try {
      // Прокси-запрос к API бота для разблокировки
      const botRes = await fetch(`${BOT_API_URL}/api/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: parseInt(userId),
          secret: ADMIN_SECRET,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (!botRes.ok) {
        return res.status(502).json({ 
          error: 'Bot API unavailable',
          userId,
          unlockedAll: action === 'unlock'
        });
      }

      const data = await botRes.json();
      
      return res.status(200).json({ 
        success: data.ok === true, 
        userId, 
        unlockedAll: action === 'unlock' 
      });
    } catch (err) {
      console.error('Error setting unlock via bot API:', err.message);
      return res.status(502).json({ 
        error: 'Bot API request failed',
        userId,
        unlockedAll: action === 'unlock'
      });
    }
  }

  // Любой другой метод
  return res.status(405).json({ error: 'Method not allowed' });
}