// API эндпоинт для управления разблокировкой эпох
// GET /api/unlock-status?userId=123 — проверить статус
// POST /api/unlock-status — установить статус (только с секретным ключом)

import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join('/tmp', 'unlock-status.json');
const ADMIN_SECRET = process.env.ADMIN_API_SECRET || 'admin-secret-2024';

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading data file:', e.message);
  }
  return {};
}

function saveData(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error saving data file:', e.message);
  }
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET — проверка статуса
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }

    const data = loadData();
    const unlockedAll = data[userId]?.unlockedAll === true;

    return res.status(200).json({ userId: parseInt(userId), unlockedAll });
  }

  // POST — установка статуса (только с секретным ключом)
  if (req.method === 'POST') {
    const { userId, action, secret } = req.body;

    if (secret !== ADMIN_SECRET) {
      return res.status(403).json({ error: 'Invalid secret' });
    }

    if (!userId || !['unlock', 'lock'].includes(action)) {
      return res.status(400).json({ error: 'Invalid params. Need: userId, action (unlock|lock), secret' });
    }

    const data = loadData();
    
    if (action === 'unlock') {
      data[userId] = { ...data[userId], unlockedAll: true, updatedAt: new Date().toISOString() };
    } else if (action === 'lock') {
      data[userId] = { ...data[userId], unlockedAll: false, updatedAt: new Date().toISOString() };
    }

    saveData(data);

    return res.status(200).json({ 
      success: true, 
      userId, 
      unlockedAll: action === 'unlock' 
    });
  }

  // Любой другой метод
  return res.status(405).json({ error: 'Method not allowed' });
}