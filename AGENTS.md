<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# mrabota — сайт вакансий (Ногинск)

## Стек и версии
- Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS v4 (`@tailwindcss/postcss`), Prisma 7 + SQLite (better-sqlite3), **shadcn/ui (Base UI)**, lucide-react, TipTap (rich-editor).
- База: dev — `file:./dev.db` отсюда же; прод — absolute path в `DATABASE_URL` (см. Деплой).
- Типы БД: `src/generated/prisma` (generator `prisma-client`); импорт `db` из `@/lib/db`.

## Ключевые отличия Next 16 (НЕ из обучающих данных)
- Middleware НЕТ: защита `/admin` — в `src/proxy.ts` (matcher + redirect не-сессий на `/admin/login`).
- `params`/`searchParams` — Promise: в компонентах `await params`; типы `{ params: Promise<{...}> }`.
- `useActionState` (вместо useFormState) для форм; server actions как `action={...}`.
- Client-превью и `editor` в TipTap: `useEditor` + `useEditorState`, tooltip — Base UI. `rich-editor.tsx` использует `useEditor` даже на сервере — см. `application-form` (рендерит input напрямую, honeypot).
- Кнопки/ссылки: shadcn `Button` через `render={<Link .../>}`/`render={<a .../>}` (Не `asChild` — в этом стеке `render`).

## Структура
```
src/app/(site)/            — публичная часть
  page.tsx                 — список вакансий (published, order asc)
  vacancy/[slug]/          — одна вакансия (metadata, JSON-LD, форма слева/справа)
  privacy, consent, [...pageslug] — статичные страницы из БД
src/app/admin/             — админка (layout: requireAdmin; навигация)
  vacancies/ applications/ pages/ settings/ login/ password/...
src/components/            — общие
  ui/                      — shadcn-примитивы (Base UI): button, input, textarea,
                             label, checkbox, card, badge, alert, table, separator
  application-form phone-input vacancy-card logo logo-mobile...
src/lib/                   — db.ts auth.ts cn.ts utils.ts cn.ts logo, actions/ (server),
                             settings, mail, constants
src/lib/actions/           — server actions: auth, applications, vacancies, settings, pages
```

## Соглашения и логика
- Публичные страницы читают из БД → `export const dynamic = "force-dynamic"` (или `force-dynamic` в layout/странице). Иначе build отдаст статику без свежих данных.
- Паттерна посадки:
  - Shadcn-кнопки/инпуты везде: `Button`, `Input`, `Textarea`, `Label`, `Checkbox`, `Card`, `Badge`, `Alert`, `Table` из `@/components/ui/*`. НЕ писать голые `<button>`/`<input>` в стилях brand/zinc вручную — только если это tooltip-примитив Base UI.
  - Сетка: `Container`, `Grid`, `Section`.
- Формы — server actions, результат `{ ok, errors, message }` + zod. `useActionState`.
- Логика application-form: заявка всегда пишется в БД; письмо — только если SMTP настроен И заполнен `contactEmail`; honeypot-поле `website` (невидимо) → фейковый успех; `Application.ip` из `x-forwarded-for`/`x-real-ip`.
- SMTP: `smtpSecure === "on"` → secure; письмо с fallback `from`.
- Login: логин/пароль (bcrypt), сессии в куках (jose), `requireAdmin()`/`getSession()`. Сброс пароля — через email (SMTP) с токеном; формы под `useActionState`.

## shadcn/ui (на чём стоим)
- Инициализация: `npx shadcn@latest init` → проект использует **Base UI** (`@base-ui/react`), пакет `cn` (`tailwind-merge`+clsx через `@/lib/cn` реэкспорт), `class-variance-authority`, `@import "shadcn/tailwind.css"`/`tw-animate-css` в globals.css, `.dark` вариант.
- `cn` — единый: `src/lib/cn.ts` реэкспортирует `cn` из `@/lib/utils`, а `utils.ts` — из пакета `cn`. **Не импортировать clsx/tailwind-merge отдельно.**
- Цвета бренда `brand-*` (x6xx) заданы в `globals.css` `@theme`; темная тема `.dark` в том же файле; контроли `--primary/--ring/--border` уже замаплены на brand-палитру (кнопки `bg-brand-600`, фокус-кольцо). При добавлении компонентов не переопределять `--primary` на чёрный.
- Добавление: `npx shadcn@latest add "имена"` — компоненты ложатся в `src/components/ui/*` сами, `components.json` уже настроен (style base / Base UI). После — переезжать формы/списки на них, удаляя хвосты от старых inline-стилей.
- Хуки: `useActionState`/`useActionState` контекст, подтверждения удаления — `confirm()` в клиентских компонентах (`_components/delete-...`).

## Частые ручные правки-паттерны
- rich-content/материал: отступы между тегами и блоком описания, `.rich-content` в `globals.css` — margin-схема `* + *` (селектор соседа применяет отступ только к последующим; заодно убирает первого/последнего).
- Карточка вакансии: адрес отдельной строкой под тегами (salary/schedule) с иконкой MapPin, кнопка «Подробнее» на новой строке; `mt-auto` + `pt-2`→`gap` настройка отступов.
- Стили форм на серых панелях: если панель `bg-zinc-50` — полям ставить `bg-white` (иначе прозрачные `Input` не видны).
- После удаления кнопок/CTA проверять не мёртвые `import` (лint ловит).

## Деплой (standalone server)
- `next.config.ts`: `output: "standalone"`, `serverExternalPackages: ["better-sqlite3"]`, `experimental.proxy` не нужен — маршрутизация `/admin` в `proxy.ts`.
- Запуск прод: `node .next/standalone/server.js` (НЕ `next start` — не поддерживает standalone), с абсолютным `DATABASE_URL="file:/home/kundius/.mrabota/db.sqlite"` (или env), `SITE_URL`, `SESSION_SECRET`, SMTP.
- `.next/standalone` нужно дополнительно забрать `.next/static` → `.next/standalone/.next/static` (`cp -r`) и `public/` (или связать); иначе медиа/стили не подтянутся. Для дебага локально: `DATABASE_URL="file:./dev.db" node server.js` из папки mrabota (путь при этом = cwd-относительный от standalone dir? — проверять).
- На сервере рядом systemd unit + nginx; симлинки uploads (см. deploy/).
- Прод-БД: `DATABASE_URL` абсолютный; миграции через `npx prisma migrate deploy` при сборке.

## Проверки перед завершением
1. `npm run lint`
2. `npm run typecheck`
3. `npx next build`
4. (при изменении публичных/админ страниц) смоук: запустить standalone со static, `curl` `/` `/admin/login` `/vacancy/<slug>` `/sitemap.xml` — 200; `/admin/*` — redirect 307 на `/admin/login`.

## Текущее состояние (что сделано / осталось)
- [x] Внедрён shadcn (Base UI), переведены публичные формы (заявка, телефон), карточка вакансии, страница вакансии (Badge/Button), 404, админ-формы (login/reset/vacancy/settings/pages через Input/Label/Button/Alert), списки (Table/Badge/Button) и навигация.
- [x] Панель «Оставить заявку» — серая (`bg-zinc-50`) с тонкой обводкой (`border-zinc-200`), поля белые.
- [x] Шапка-логотип: на телефоне «Вакансии»/«Ногинск» две строки без разделителя, чуть меньше иконки; на sm+ одна строка с точкой.
- [x] DSL: динамические SEO-метаданные, force-dynamic.
- Осталось (по желанию): rich-editor тулбар перевести на UI-кнопки (не срочно), проверить светлую тему в `.dark`, окончательная документация в deploy/, seed/fixtures.
