#!/bin/bash
# Настройка сервера для History EGE Bot
# Запуск: bash setup_server.sh

set -e

echo "=== Установка Node.js 20 ==="
export NVM_DIR="$HOME/.nvm"
if [ ! -d "$NVM_DIR" ]; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20

echo "=== Установка PM2 ==="
npm install -g pm2

echo "=== Установка зависимостей ==="
cd /root/history-ege-bot
npm install

echo "=== Запуск бота ==="
pm2 stop history-ege-bot 2>/dev/null || true
pm2 delete history-ege-bot 2>/dev/null || true
pm2 start server/bot.js --name history-ege-bot
pm2 save
pm2 startup

echo ""
echo "=== Готово! ==="
echo "Проверка статуса:"
pm2 list