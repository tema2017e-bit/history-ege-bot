#!/bin/bash
# Установка Telegram MTProxy на VDS
# Запуск: bash setup_mtproxy.sh

set -e

SECRET=$(openssl rand -hex 16)

echo "=== Установка MTProxy ==="

# Вариант 1: Через Docker (рекомендуемый)
if command -v docker &> /dev/null; then
  echo "Установка через Docker..."
  docker pull telegrammessenger/proxy:latest
  
  # Останавливаем старый контейнер
  docker stop mtproxy 2>/dev/null || true
  docker rm mtproxy 2>/dev/null || true
  
  # Запускаем MTProxy
  docker run -d \
    --restart=always \
    --name=mtproxy \
    -p 443:443 \
    telegrammessenger/proxy:latest
  
  echo ""
  echo "=== MTProxy запущен! ==="
  echo "IP: $(curl -s ifconfig.me || curl -s icanhazip.com || hostname -I | awk '{print $1}')"
  echo "Порт: 443"
  echo "Secret: $SECRET"
  echo ""
  echo "Ссылка для Telegram: tg://proxy?server=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || hostname -I | awk '{print $1}')&port=443&secret=$SECRET"
  echo ""
  echo "Проверка работы: docker logs mtproxy"
  exit 0
fi

# Вариант 2: Ручная установка если Docker недоступен
echo "Docker не найден, устанавливаю вручную..."

# Установка зависимостей
apt-get update -y
apt-get install -y git build-essential libssl-dev zlib1g-dev

# Клонирование репозитория
git clone https://github.com/TelegramMessenger/MTProxy /root/mtproxy
cd /root/mtproxy

# Сборка
make

# Создание секретного ключа
echo "$SECRET" > /root/mtproxy/secret.txt

# Создание systemd сервиса
cat > /etc/systemd/system/mtproxy.service << 'EOF'
[Unit]
Description=MTProxy
After=network.target

[Service]
Type=simple
WorkingDirectory=/root/mtproxy
ExecStart=/root/mtproxy/objs/bin/mtproto-proxy -u root -p 8888 -H 443 -S $(cat /root/mtproxy/secret.txt) --allow-chatlist 0
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable mtproxy
systemctl start mtproxy

echo ""
echo "=== MTProxy запущен! ==="
IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || hostname -I | awk '{print $1}')
echo "IP: $IP"
echo "Порт: 443"
echo "Secret: $SECRET"
echo ""
echo "Ссылка: tg://proxy?server=$IP&port=443&secret=$SECRET"
echo ""
echo "Проверка статуса: systemctl status mtproxy"