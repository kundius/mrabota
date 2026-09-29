# Деплой на VPS (Ubuntu/Debian)

Приложение собирается в режиме Next.js `standalone`: сервер запускается файлом
`.next/standalone/server.js` (не `next start`), а обратный прокси — nginx.

## Важные особенности

1. **standalone-сервер не читает `.env`.** Переменные нужно передать процессу
   (в systemd — `EnvironmentFile`).
2. **standalone меняет рабочий каталог** на `.next/standalone`, поэтому
   относительный путь `DATABASE_URL="file:./dev.db"` указывал бы внутрь сборки.
   На сервере используйте **абсолютный** путь: `file:/var/lib/mrabota/mrabota.db`.
3. **Загруженные картинки** хранятся вне сборки и подключаются симлинком
   `public/uploads → /var/lib/mrabota/uploads`.
4. `better-sqlite3` — нативный модуль; он собирается при `npm ci`.

## 1. Подготовка сервера

```bash
sudo apt update
sudo apt install -y nginx sqlite3
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

sudo useradd --system --create-home --shell /usr/sbin/nologin mrabota
sudo mkdir -p /var/www/mrabota /var/lib/mrabota/uploads /var/backups/mrabota
sudo chown -R mrabota:mrabota /var/www/mrabota /var/lib/mrabota /var/backups/mrabota
```

## 2. Код и переменные окружения

```bash
sudo -u mrabota git clone <URL_РЕПОЗИТОРИЯ> /var/www/mrabota
cd /var/www/mrabota
sudo -u mrabota cp .env.example .env
sudo -u mrabota nano .env
```

Заполните:

```
DATABASE_URL="file:/var/lib/mrabota/mrabota.db"
SESSION_SECRET="<openssl rand -hex 32>"
SITE_URL="https://example.ru"
```

## 3. Первый деплой

```bash
sudo -u mrabota bash deploy/deploy.sh
```

Скрипт выполняет: `git pull` → `npm ci` → `prisma generate` → `npm run build`,
копирует `static`/`public` в standalone, применяет миграции и сид.

## 4. Пароль администратора

```bash
cd /var/www/mrabota
sudo -u mrabota npm run admin:password -- --password '<надёжный_пароль>' --login admin
```

## 5. systemd

```bash
sudo cp deploy/mrabota.service /etc/systemd/system/mrabota.service
sudo systemctl daemon-reload
sudo systemctl enable --now mrabota
sudo systemctl status mrabota
```

## 6. nginx и HTTPS

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/mrabota
sudo ln -s /etc/nginx/sites-available/mrabota /etc/nginx/sites-enabled/mrabota
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.ru -d www.example.ru
```

## 7. Резервное копирование

```bash
sudo chmod +x /var/www/mrabota/deploy/backup.sh
sudo crontab -e
# 0 3 * * * /var/www/mrabota/deploy/backup.sh >> /var/log/mrabota-backup.log 2>&1
```

Бэкап делается через `sqlite3 .backup` (безопасно на работающей базе) в
`/var/backups/mrabota`, старые копии удаляются через 14 дней.

## 8. Обновление версии

```bash
cd /var/www/mrabota
sudo -u mrabota bash deploy/deploy.sh
```

## 9. Восстановление из бэкапа

```bash
sudo systemctl stop mrabota
sudo cp /var/backups/mrabota/mrabota-ГГГГ-ММ-ДД_ЧЧ-ММ-СС.db /var/lib/mrabota/mrabota.db
sudo chown mrabota:mrabota /var/lib/mrabota/mrabota.db
sudo systemctl start mrabota
```

## Чек-лист после деплоя

- [ ] `/` отдаёт список опубликованных вакансий.
- [ ] Страница вакансии открывается, форма заявки сохраняет заявку.
- [ ] Письмо на `contactEmail` приходит (при заполненном SMTP).
- [ ] Вход в `/admin` работает, смена пароля и сброс по e-mail.
- [ ] `https://<домен>/sitemap.xml` и `/robots.txt` доступны.
- [ ] Счётчик Яндекс.Метрики задан в настройках, визиты фиксируются.
- [ ] Cron-бэкап выполняется, файл появляется в `/var/backups/mrabota`.
