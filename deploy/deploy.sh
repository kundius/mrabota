#!/usr/bin/env bash
set -euo pipefail

# Сборка и деплой standalone-версии сайта.
# Запускать из корня проекта (или подправить APP_DIR/DATA_DIR).

APP_DIR="${APP_DIR:-/var/www/mrabota}"
DATA_DIR="${DATA_DIR:-/var/lib/mrabota}"

cd "$APP_DIR"

echo "==> Обновление кода"
git pull --ff-only

echo "==> Установка зависимостей"
npm ci

echo "==> Генерация Prisma Client"
npx prisma generate

echo "==> Сборка"
npm run build

echo "==> Подготовка standalone"
rm -rf .next/standalone/.next/static
cp -r .next/static .next/standalone/.next/static

rm -rf .next/standalone/public
cp -r public .next/standalone/public

# Загруженные картинки хранятся вне сборки
mkdir -p "$DATA_DIR/uploads"
rm -rf .next/standalone/public/uploads
ln -sfn "$DATA_DIR/uploads" .next/standalone/public/uploads

echo "==> Миграции БД"
set -a
# shellcheck disable=SC1091
. ./.env
set +a
npx prisma migrate deploy
npm run db:seed

echo "==> Перезапуск сервиса"
sudo systemctl restart mrabota

echo "==> Готово"
