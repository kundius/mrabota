# mrabota — сайт вакансий (Ногинск)

Сайт-листинг вакансий с собственной админкой: публичный список вакансий, страница
вакансии с формой заявки, приём заявок в базу и на e-mail, SEO и Яндекс.Метрика.

## Стек

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4
- Prisma 7 + SQLite (`@prisma/adapter-better-sqlite3`)
- Аутентификация админки: bcryptjs + JWT-сессия в httpOnly cookie (`jose`)
- Валидация: zod
- WYSIWYG-редактор: TipTap
- Почта: nodemailer (SMTP)
- Метрика: Яндекс.Метрика с отслеживанием переходов SPA

## Локальная разработка

```bash
cp .env.example .env          # задайте SESSION_SECRET: openssl rand -hex 32
npm install
npx prisma migrate deploy     # создать схему БД
npm run db:seed               # настройки и юридические страницы
npm run admin:password -- --password <пароль> --login admin
npm run dev
```

- Сайт: http://localhost:3000
- Админка: http://localhost:3000/admin

## Скрипты

| Скрипт | Назначение |
| --- | --- |
| `npm run dev` | Запуск в режиме разработки |
| `npm run build` | Продакшен-сборка (standalone) |
| `npm run start` | Запуск собранного приложения (не для standalone на сервере) |
| `npm run lint` | ESLint |
| `npm run typecheck` | Проверка типов |
| `npm run db:migrate` | Применение миграций (`prisma migrate deploy`) |
| `npm run db:seed` | Идемпотентный сид настроек и страниц |
| `npm run admin:password` | Создание/сброс пароля администратора |

## Структура

```
src/app/(site)        публичные страницы: список, вакансия, политики
src/app/admin         админка: вакансии, заявки, настройки, страницы
src/app/admin/api     загрузка изображений
src/lib/actions       server actions (auth, vacancies, applications, settings, pages)
src/lib               db, auth, mail, settings, slug, session-token
src/components        UI-компоненты (шапка/подвал, карточка, форма, редактор)
prisma                схема, миграции, сид
deploy                systemd/nginx/backup и скрипт деплоя
```

## Админка

- Вакансии: создание, редактирование, черновик/публикация, порядок вывода.
- Заявки: просмотр поступивших заявок.
- Настройки: телефон, e-mail, SMTP, счётчик Метрики.
- Страницы: тексты политики конфиденциальности и согласия на обработку данных.

## Деплой

Пошаговая инструкция — [DEPLOY.md](./DEPLOY.md).
