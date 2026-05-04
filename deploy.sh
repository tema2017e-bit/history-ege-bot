#!/bin/bash
# =============================================
# Deploy script for History EGE Bot
# Использование:
#   chmod +x deploy.sh
#   ./deploy.sh
# =============================================

set -e

echo "🚀 History EGE Bot — Deploy Script"
echo "=================================="

# Проверка наличия .env
if [ ! -f .env ]; then
  echo "❌ Файл .env не найден!"
  echo "Скопируйте .env.production.example в .env и заполните:"
  echo "  cp .env.production.example .env"
  exit 1
fi

# Загружаем переменные для проверки
source .env 2>/dev/null || true

if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ "$TELEGRAM_BOT_TOKEN" = "ваш_токен_бота_от_BotFather" ]; then
  echo "⚠️ TELEGRAM_BOT_TOKEN не настроен!"
  echo "Получите токен у @BotFather и укажите в .env"
  exit 1
fi

# Шаг 1: Сборка и запуск контейнеров
echo ""
echo "📦 Шаг 1/4: Сборка Docker-образов..."
docker-compose build

echo ""
echo "🚀 Шаг 2/4: Запуск контейнеров..."
docker-compose up -d

echo ""
echo "⏳ Шаг 3/4: Ожидание запуска БД..."
sleep 5

# Шаг 2: Миграция БД
echo ""
echo "🗄️  Шаг 4/4: Запуск миграции БД..."
docker-compose exec -T bot node src/migrate.js

echo ""
echo "✅ Деплой завершён!"
echo "=================================="
echo "📡 Бот: http://localhost:3000"
echo "🩺 Health: http://localhost:3000/health"
echo ""
echo "📋 Полезные команды:"
echo "  docker-compose logs -f    # Логи бота"
echo "  docker-compose logs -f db # Логи БД"
echo "  docker-compose down       # Остановить"
echo "  docker-compose restart    # Перезапустить"