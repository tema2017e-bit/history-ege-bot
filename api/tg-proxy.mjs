// Прокси для Telegram API (обходит блокировки)
// Бот на VPS шлёт запросы сюда, Vercel проксирует на api.telegram.org

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!TELEGRAM_TOKEN) {
    return res.status(500).json({ ok: false, error: 'TELEGRAM_BOT_TOKEN not set' });
  }

  const { method, params } = req.body;

  if (!method) {
    return res.status(400).json({ ok: false, error: 'method required' });
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/${method}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params || {}),
      signal: AbortSignal.timeout(8000), // 8s timeout (Vercel limit is 10s)
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error(`❌ TG proxy error [${req.body?.method}]:`, err.message);
    return res.status(200).json({ ok: false, error: err.message });
  }
}