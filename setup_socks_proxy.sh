#!/bin/bash
# Настройка SOCKS5 прокси на VDS для бота
# Telegram API заблокирован в Москве, нужно прокси для бота
# Запуск: bash setup_socks_proxy.sh

set -e

echo "=== Установка Dante (SOCKS5 прокси) ==="
apt-get update -y
apt-get install -y dante-server

echo "=== Настройка Dante ==="
cat > /etc/danted.conf << 'EOF'
logoutput: /var/log/danted.log
internal: 127.0.0.1 port = 1080
external: eth0
method: none
clientmethod: none
user.privileged: root
user.notprivileged: nobody

client pass {
    from: 127.0.0.0/8 to: 0.0.0.0/0
    log: error
}

socks pass {
    from: 127.0.0.0/8 to: 0.0.0.0/0
    log: error
    protocol: tcp udp
}
EOF

echo "=== Запуск Dante ==="
systemctl restart danted 2>/dev/null || danted -D 2>/dev/null || true

# Проверка
sleep 1
if ss -tlnp | grep -q 1080; then
    echo "✓ SOCKS5 прокси запущен на 127.0.0.1:1080"
else
    echo "✗ Ошибка запуска SOCKS5"
    cat /var/log/danted.log 2>/dev/null || true
    exit 1
fi

echo ""
echo "=== Проверка работы через прокси ==="
curl -x socks5://127.0.0.1:1080 -s https://api.telegram.org/bot/getMe || echo "Telegram API недоступен (это нормально, нет токена)"

echo ""
echo "=== Настройка автозапуска ==="
cat > /etc/systemd/system/socks-proxy.service << 'EOF'
[Unit]
Description=SOCKS5 Proxy (Dante)
After=network.target

[Service]
Type=simple
ExecStart=/usr/sbin/danted -f /etc/danted.conf
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable socks-proxy.service
systemctl restart socks-proxy.service

echo ""
echo "=== Готово! ==="
echo "SOCKS5 прокси работает на 127.0.0.1:1080"
echo ""
echo "Теперь нужно обновить bot.js чтобы он ходил через этот прокси."
echo "Для этого устанавливаем пакет socks-proxy-agent:"
echo "  cd /root/history-ege-bot && npm install socks-proxy-agent"
echo ""
echo "И в bot.js добавляем в начало:"
echo '  const { SocksProxyAgent } = require("socks-proxy-agent");'
echo '  const agent = new SocksProxyAgent("socks5://127.0.0.1:1080");'
echo '  // передавать agent в fetch/axios'