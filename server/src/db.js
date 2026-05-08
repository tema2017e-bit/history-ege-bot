const { Pool } = require('pg');

let pool = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/history_ege',
      ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false } 
        : false,
    });
  }
  return pool;
}

async function query(text, params) {
  const client = await getPool().connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Вспомогательные функции для работы с users

async function getUser(chatId) {
  const result = await query(
    'SELECT * FROM users WHERE chat_id = $1',
    [chatId]
  );
  return result.rows[0] || null;
}

async function getAllUsers() {
  const result = await query('SELECT * FROM users ORDER BY first_seen DESC');
  return result.rows;
}

async function createUser(chatId, firstName, lastName, username) {
  const result = await query(
    `INSERT INTO users (chat_id, first_name, last_name, username, unlocked_all, unlocked_eras)
     VALUES ($1, $2, $3, $4, false, '[]'::jsonb)
     ON CONFLICT (chat_id) DO UPDATE SET
       last_activity = NOW(),
       first_name = COALESCE(NULLIF($2, ''), users.first_name),
       last_name = COALESCE(NULLIF($3, ''), users.last_name),
       username = COALESCE(NULLIF($4, ''), users.username)
     RETURNING *`,
    [chatId, firstName, lastName, username]
  );
  return result.rows[0];
}

async function updateLastActivity(chatId) {
  await query(
    'UPDATE users SET last_activity = NOW() WHERE chat_id = $1',
    [chatId]
  );
}

async function setUnlocked(chatId, value) {
  await query(
    'UPDATE users SET unlocked_all = $2 WHERE chat_id = $1',
    [chatId, value]
  );
}

// Работа с отдельными эпохами

async function getUnlockedEras(chatId) {
  const result = await query(
    'SELECT unlocked_eras FROM users WHERE chat_id = $1',
    [chatId]
  );
  if (!result.rows[0]) return [];
  return result.rows[0].unlocked_eras || [];
}

async function unlockEra(chatId, eraId) {
  await query(
    `UPDATE users 
     SET unlocked_eras = (
       CASE 
         WHEN unlocked_eras @> $2::jsonb THEN unlocked_eras
         ELSE unlocked_eras || $2::jsonb
       END
     ),
     updated_at = NOW()
     WHERE chat_id = $1`,
    [chatId, JSON.stringify([eraId])]
  );
}

async function lockEra(chatId, eraId) {
  await query(
    `UPDATE users 
     SET unlocked_eras = unlocked_eras - $2,
     updated_at = NOW()
     WHERE chat_id = $1`,
    [chatId, eraId]
  );
}

async function getStats() {
  const result = await query(`
    SELECT 
      COUNT(*)::int as total,
      COUNT(*) FILTER (WHERE unlocked_all = true)::int as unlocked,
      COUNT(*) FILTER (WHERE last_activity::date = CURRENT_DATE)::int as active_today
    FROM users
  `);
  return result.rows[0];
}

// Платежи

async function createPayment(chatId, paymentId, amount, status) {
  await query(
    `INSERT INTO payments (chat_id, payment_id, amount, status)
     VALUES ($1, $2, $3, $4)`,
    [chatId, paymentId, amount, status]
  );
}

async function updatePaymentStatus(paymentId, status) {
  await query(
    'UPDATE payments SET status = $2, updated_at = NOW() WHERE payment_id = $1',
    [paymentId, status]
  );
}

async function getPayment(paymentId) {
  const result = await query(
    'SELECT * FROM payments WHERE payment_id = $1',
    [paymentId]
  );
  return result.rows[0] || null;
}

async function getPaymentsByUser(chatId) {
  const result = await query(
    'SELECT * FROM payments WHERE chat_id = $1 ORDER BY created_at DESC',
    [chatId]
  );
  return result.rows;
}

module.exports = {
  query,
  getUser,
  getAllUsers,
  createUser,
  updateLastActivity,
  setUnlocked,
  getUnlockedEras,
  unlockEra,
  lockEra,
  getStats,
  createPayment,
  updatePaymentStatus,
  getPayment,
  getPaymentsByUser,
};