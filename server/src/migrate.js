/**
 * Миграция базы данных PostgreSQL
 * Запуск: npm run migrate
 */

require('dotenv').config();
const { Pool } = require('pg');

async function migrate() {
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/history_ege';
  
  console.log('🚀 Запуск миграции...');
  console.log(`📦 БД: ${databaseUrl.replace(/\/\/.*@/, '//***:***@')}`);
  
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false,
  });

  try {
    // Таблица пользователей
    console.log('📋 Создание таблицы users...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        chat_id BIGINT PRIMARY KEY,
        first_name VARCHAR(255) DEFAULT '',
        last_name VARCHAR(255) DEFAULT '',
        username VARCHAR(255) DEFAULT '',
        first_seen TIMESTAMP DEFAULT NOW(),
        last_activity TIMESTAMP DEFAULT NOW(),
        unlocked_all BOOLEAN DEFAULT false,
        unlocked_eras JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Таблица users готова');

    // Добавляем колонку unlocked_eras если её нет (для существующих БД)
    console.log('📋 Проверка колонки unlocked_eras...');
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS unlocked_eras JSONB DEFAULT '[]'::jsonb;
    `);
    console.log('✅ Колонка unlocked_eras готова');

    // Таблица платежей
    console.log('📋 Создание таблицы payments...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        chat_id BIGINT NOT NULL REFERENCES users(chat_id) ON DELETE CASCADE,
        payment_id VARCHAR(255) UNIQUE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'RUB',
        status VARCHAR(50) DEFAULT 'pending',
        description TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Таблица payments готова');

    // Таблица логов
    console.log('📋 Создание таблицы bot_logs...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bot_logs (
        id SERIAL PRIMARY KEY,
        chat_id BIGINT,
        command VARCHAR(50),
        details JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Таблица bot_logs готова');

    // Создание индексов
    console.log('📋 Создание индексов...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_last_activity ON users(last_activity);
      CREATE INDEX IF NOT EXISTS idx_payments_chat_id ON payments(chat_id);
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
      CREATE INDEX IF NOT EXISTS idx_bot_logs_chat_id ON bot_logs(chat_id);
      CREATE INDEX IF NOT EXISTS idx_bot_logs_created_at ON bot_logs(created_at);
    `);
    console.log('✅ Индексы созданы');

    console.log('\n🎉 Миграция завершена успешно!');
    console.log('Таблицы: users, payments, bot_logs');
    
  } catch (error) {
    console.error('❌ Ошибка миграции:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();