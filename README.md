# LeadFlow

![CI](https://github.com/NikitaOrgiya/LeadFlow/actions/workflows/ci.yml/badge.svg)

Демонстрационный портфельный MVP корпоративного сайта digital-компании: каталог услуг, калькулятор предварительной стоимости, приём заявок с сохранением в Supabase и уведомлением менеджера в Telegram, закрытая административная панель.

> ⚠️ Это учебный/портфельный проект. Юридические страницы демонстрационные, оплата и часть бизнес-процессов не реализованы — подробности в разделе [«Известные ограничения»](#известные-ограничения).

![LeadFlow — главная страница](docs/screenshots/home.png)

## Содержание

- [Бизнес-задача](#бизнес-задача)
- [Реализованные функции](#реализованные-функции)
- [Технологический стек](#технологический-стек)
- [Архитектура](#архитектура)
- [Структура проекта](#структура-проекта)
- [Локальный запуск](#локальный-запуск)
- [Настройка Supabase](#настройка-supabase)
- [Применение SQL-миграций](#применение-sql-миграций)
- [Создание администратора](#создание-администратора)
- [Настройка Telegram-бота](#настройка-telegram-бота)
- [Переменные окружения](#переменные-окружения)
- [Запуск в режиме разработки](#запуск-в-режиме-разработки)
- [Тестирование](#тестирование)
- [Статус проверок](#статус-проверок)
- [Безопасность](#безопасность)
- [Проверка безопасности](#проверка-безопасности)
- [Production build](#production-build)
- [Деплой на Vercel](#деплой-на-vercel)
- [Известные ограничения](#известные-ограничения)
- [Возможные улучшения](#возможные-улучшения)
- [Скриншоты](#скриншоты)

## Бизнес-задача

Малому и среднему бизнесу нужны сайты, Telegram-боты, внутренние кабинеты, мини-CRM и автоматизация процессов, но сложно оценить бюджет и не потерять заявку. LeadFlow — сайт-визитка digital-студии, который презентует услуги, даёт посетителю предварительный расчёт стоимости и гарантированно доводит заявку до менеджера: с валидацией на сервере, сохранением в базе и уведомлением в Telegram.

## Реализованные функции

- Адаптивный лендинг: услуги, преимущества, этапы работы, FAQ (проверено на 360/768/1024/1440 px).
- Калькулятор стоимости с мгновенным пересчётом диапазона на клиенте.
- Форма заявки (React Hook Form + Zod) с honeypot- и time-based защитой от спама.
- Серверный маршрут `POST /api/leads`: общий `try/catch`, повторная валидация, нормализация телефона, **пересчёт цены на сервере** (клиентским значениям не доверяем), атомарная генерация номера заявки в базе, сохранение в Supabase.
- Уведомление менеджера в Telegram с таймаутом 5 секунд; сбой или зависание Telegram не приводит к потере уже сохранённой заявки.
- Страница успешной отправки с номером заявки и диапазоном стоимости.
- Административная панель на Supabase Auth: дашборд, поиск/фильтры/пагинация по заявкам, карточка заявки с изменением статуса.
- Row Level Security на всех публичных таблицах, включая техническую таблицу счётчиков номеров заявок; проверка роли `admin` без рекурсивных RLS-политик; права SQL-функций ограничены минимально необходимыми ролями.
- SEO-метаданные, `robots.txt`, `sitemap.xml`.
- 7 e2e-тестов на Playwright и 34 unit-теста на Vitest (см. [«Тестирование»](#тестирование)).
- CI на GitHub Actions: lint, typecheck, unit-тесты, build на каждый push/PR.

## Технологический стек

| Категория | Технологии |
|---|---|
| Фреймворк | Next.js (App Router), React, TypeScript (strict) |
| Стили/UI | Tailwind CSS v4, компоненты в стиле shadcn/ui, Lucide Icons |
| Формы/валидация | React Hook Form, Zod |
| Данные | Supabase PostgreSQL, Supabase Auth, `@supabase/ssr` |
| Уведомления | Telegram Bot API |
| Тесты | Vitest (unit), Playwright (e2e), ESLint, `tsc --noEmit` |
| CI | GitHub Actions |
| Деплой | Vercel |

Пакет `shadcn/ui` **не устанавливался через свою CLI** — в окружении разработки хост `ui.shadcn.com` недоступен по сетевой политике. Вместо этого примитивы (`components/ui/*`) собраны вручную по тем же принципам (Radix UI + `class-variance-authority` + Tailwind), включая `components.json`, так что при наличии доступа `npx shadcn add <component>` продолжит работать штатно.

## Архитектура

```text
Пользователь
    ↓
Next.js-интерфейс (лендинг, калькулятор — React state, без обращений к БД)
    ↓
POST /api/leads (весь обработчик обёрнут в try/catch)
    ↓
Серверная валидация Zod + honeypot/time-check + пересчёт цены
    ↓
Supabase PostgreSQL (service-role, минуя RLS)
    ↓
Telegram Bot API (best-effort, таймаут 5с, ошибка не теряет заявку)
    ↓
Уведомление менеджеру
```

```text
Администратор
    ↓
Supabase Auth (email + пароль, без публичной регистрации)
    ↓
proxy.ts обновляет cookie сессии → requireAdmin() проверяет сессию и роль
    ↓
Закрытая панель (RLS дополнительно проверяет is_admin() на каждый запрос,
                  сама функция вызываема только authenticated/service_role)
    ↓
Чтение и изменение заявок (обновление статуса — через server action)
```

Ключевые архитектурные решения:

- Публичная форма никогда не пишет в базу напрямую — только через `POST /api/leads`, который использует `SUPABASE_SERVICE_ROLE_KEY` (серверный модуль `lib/supabase/admin.ts`, помечен `import "server-only"`).
- Сервер не доверяет диапазону цены от клиента: `lib/pricing/calculate-price.ts` — единственный источник истины, вызывается и в браузере (для мгновенного UI), и в API-маршруте (для авторитетного пересчёта). Покрыт unit-тестами.
- Каталог услуг и цены живут в `lib/pricing/pricing-config.ts` (один массив, без дублирования по компонентам) и зеркалируются в `supabase/seed.sql`; поэтому главная страница полностью статична и не зависит от доступности Supabase.
- Публичный номер заявки (`LF-2026-0001`) генерируется атомарно в базе (`generate_lead_number()`), а не через `COUNT(*)`. Вызывать функцию может только `service_role`.
- Роль администратора проверяется через таблицу `profiles`, а RLS-рекурсия исключена SQL-функцией `is_admin()` с `SECURITY DEFINER`. Функция доступна `authenticated`/`service_role`, но не `anon` — административные RLS-политики явно ограничены `TO authenticated`, поэтому анонимные запросы вообще не пытаются её вызвать.

## Структура проекта

```text
app/
  page.tsx                  — главная страница
  layout.tsx, globals.css   — корневой layout, тема Tailwind
  privacy/, consent/        — демонстрационные юридические страницы
  success/                  — страница успешной отправки заявки
  admin/
    login/                  — вход (без публичной регистрации)
    page.tsx                — дашборд
    leads/page.tsx           — таблица заявок
    leads/[id]/page.tsx       — карточка заявки
  api/leads/route.ts        — POST /api/leads
components/
  layout/                   — header, footer, общий каркас страницы
  landing/                  — секции лендинга, калькулятор, форма заявки
  admin/                    — дашборд, таблица, карточка, статус
  ui/                       — базовые примитивы (в духе shadcn/ui)
lib/
  supabase/                 — client.ts / server.ts / admin.ts / middleware.ts
  validation/lead.ts        — общая Zod-схема формы и API
  pricing/                  — конфигурация услуг/опций и расчёт цены
  telegram/                 — отправка уведомлений (таймаут 5с)
  auth/require-admin.ts     — серверная проверка сессии и роли
  actions/leads.ts          — server action обновления статуса
  utils/                    — env, телефон, валюта, дата, статусы, ошибки/логи
types/database.ts           — типы таблиц Supabase
supabase/
  migrations/                — SQL-миграции (enum, таблицы, RLS, функции, hardening)
  seed.sql                   — начальные данные по услугам
  make_admin.sql              — шаблон назначения роли admin
tests/
  unit/                      — Vitest: расчёт цены, телефон, Zod-схема
  e2e/                        — Playwright-тесты
.github/workflows/ci.yml     — GitHub Actions CI
proxy.ts                     — обновление сессии Supabase (Next.js 16 Proxy)
.env.example
```

## Локальный запуск

Требования: Node.js 20+, аккаунт Supabase, Telegram-бот (для уведомлений).

```bash
git clone <repo-url>
cd LeadFlow
npm install
cp .env.example .env.local   # заполните значениями из разделов ниже
npm run dev
```

Откройте http://localhost:3000.

## Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com).
2. В **Project Settings → API** скопируйте `Project URL`, `anon public` ключ и `service_role` ключ (секретный, только на сервер).
3. Заполните ими `.env.local` (см. [переменные окружения](#переменные-окружения)).

## Применение SQL-миграций

Файлы лежат в `supabase/migrations/` в порядке применения (`0001` → `0005`).

**Вариант A — через Supabase CLI:**

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

**Вариант B — вручную:** откройте **SQL Editor** в Supabase Dashboard и выполните содержимое файлов по порядку: `0001_init.sql`, `0002_lead_numbering.sql`, `0003_admin_check.sql`, `0004_rls.sql`, `0005_security_hardening.sql`, затем `supabase/seed.sql` (шесть услуг: `landing`, `corporate-site`, `telegram-bot`, `mini-crm`, `automation`, `ai-assistant`).

`0005_security_hardening.sql` — самостоятельная миграция, не изменяющая уже применённые файлы: включает RLS на технической таблице счётчиков заявок, отзывает лишние права на SQL-функциях и пересоздаёт административные RLS-политики с явным `TO authenticated`. Если у вас уже развёрнут проект с миграциями `0001-0004`, достаточно применить только `0005`.

## Создание администратора

Публичной регистрации в проекте нет — администратора создаём вручную:

1. **Authentication → Users → Add user** в Supabase Dashboard — задайте email и пароль.
2. В **SQL Editor** выполните запрос из `supabase/make_admin.sql`, подставив email:

   ```sql
   insert into profiles (id, full_name, role)
   select id, 'Администратор LeadFlow', 'admin'
   from auth.users
   where email = 'admin@example.com'
   on conflict (id) do update set role = 'admin';
   ```

3. Войдите на `/admin/login` тем же email и паролем.

Пароль администратора нигде не хранится в репозитории.

## Настройка Telegram-бота

1. Создайте бота через [@BotFather](https://t.me/BotFather), получите `TELEGRAM_BOT_TOKEN`.
2. Узнайте `chat_id`, куда слать уведомления (личный чат, группа или канал, где бот состоит участником) — например, через `https://api.telegram.org/bot<token>/getUpdates` после отправки боту любого сообщения.
3. Заполните `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` в `.env.local`.

Сообщения отправляются в обычном текстовом режиме (без `parse_mode`), поэтому пользовательский ввод физически не может сломать разметку Telegram. Запрос к Telegram API ограничен таймаутом 5 секунд — зависший Telegram не задерживает ответ пользователю.

## Переменные окружения

См. `.env.example`. Секреты (`SUPABASE_SERVICE_ROLE_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) не имеют префикса `NEXT_PUBLIC_` и используются только в серверном коде. При отсутствии обязательной переменной приложение выбрасывает понятную ошибку (`lib/utils/env.ts`), а не падает с неясным исключением.

```text
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

## Запуск в режиме разработки

```bash
npm run dev
```

## Тестирование

```bash
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test          # Vitest — unit-тесты
npm run test:watch    # Vitest в watch-режиме
npm run test:e2e      # Playwright — e2e (поднимает npm run dev автоматически)
```

Перед первым запуском Playwright установите браузер (не входит в `npm install`):

```bash
npx playwright install --with-deps chromium
```

**Что реально работает без Supabase/Telegram:**

- `npm run test` (34 unit-теста: расчёт цены, нормализация телефона, Zod-схема заявки) — полностью автономны, внешних сервисов не требуют.
- `tests/e2e/public-lead-flow.spec.ts` — мокает ответ `POST /api/leads` через `page.route`, реального Supabase не требует.
- `tests/e2e/admin-auth.spec.ts` — проверяет редиректы неавторизованных пользователей с `/admin`, `/admin/leads`, `/admin/leads/[id]`. Supabase-запрос (`auth.getUser()`) реально уходит в сеть, но при отсутствии сессии корректно возвращает «не авторизован» даже с фиктивными ключами в `.env.local` — реальный проект не нужен.
- `tests/e2e/admin-lead-management.spec.ts` — проверяет **только клиентскую валидацию** формы входа (некорректный email/пароль, сообщение `error=forbidden`). Полный сценарий входа администратора, поиска/фильтрации и изменения статуса заявки в этом наборе **не покрыт** — он требует настоящий Supabase-проект с применёнными миграциями и созданным администратором, и в репозитории пока отсутствует.

Честно: команда `npm run test:e2e` была прогнана против локального dev-сервера с фиктивными (не настоящими) значениями Supabase/Telegram в `.env.local` — все 7 тестов проходят именно в этом режиме. Против реального Supabase-проекта e2e-набор не запускался.

## Статус проверок

Команды и результат последнего прогона (локально, с фиктивными env-значениями, соответствующими `.github/workflows/ci.yml`):

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

| Команда | Результат |
|---|---|
| `npm run lint` | ✅ passed |
| `npm run typecheck` | ✅ passed |
| `npm run test` | ✅ passed (34/34) |
| `npm run build` | ✅ passed |
| `npm run test:e2e` | ✅ passed (7/7, локально; в CI не запускается — см. ниже) |

`lint`, `typecheck`, `test` и `build` выполняются в GitHub Actions на каждый push/PR в `main` (бейдж вверху README). `test:e2e` в обязательный CI-job **не включён** — тесты поднимают полноценный dev-сервер и требуют установки браузера, а часть сценариев (см. выше) в перспективе потребует настоящий Supabase-проект. Пока это осознанно оставлено локальной командой.

## Безопасность

- Публичная форма пишет в базу **только** через серверный маршрут `POST /api/leads` — прямая запись из браузера архитектурно невозможна (клиент не имеет service-role ключа).
- `SUPABASE_SERVICE_ROLE_KEY` используется только в `lib/supabase/admin.ts` (`import "server-only"`) и никогда не попадает в клиентский бандл — проверено сборкой (см. [«Проверка безопасности»](#проверка-безопасности)).
- Стоимость (`estimatedMin`/`estimatedMax` и все опции) пересчитывается сервером в `POST /api/leads`; клиентские значения в базу не записываются.
- Административный доступ защищён Supabase Auth + проверкой роли `admin` через таблицу `profiles` (`requireAdmin()` на каждой защищённой странице, `proxy.ts` обновляет сессию).
- Row Level Security включён на `services`, `leads`, `profiles` **и** на технической таблице `lead_number_counters` — прямого доступа `anon`/`authenticated` к счётчику нет.
- SQL-функции `generate_lead_number()` и `is_admin()` — `SECURITY DEFINER` с `search_path = ''` и полностью квалифицированными именами таблиц; `EXECUTE` явно отозван у `PUBLIC`/`anon` и выдан только тем ролям, которым он нужен (`service_role`, и `authenticated` — только для `is_admin()`).
- Административные RLS-политики явно указывают `TO authenticated`, чтобы анонимные запросы не пытались вызвать `is_admin()` и не падали с ошибкой прав.
- Серверные ошибки логируются без секретов, паролей и stack trace (`lib/utils/errors.ts::logServerError`) — в лог попадают только название события, безопасное сообщение, номер заявки (если уже создана) и время.
- Ошибка отправки в Telegram не приводит к потере уже сохранённой заявки; запрос ограничен таймаутом 5 секунд.

## Проверка безопасности

Ручные проверки, которые стоит выполнить после применения `0005_security_hardening.sql` к вашему Supabase-проекту (замените `<anon-key>`/`<url>` на свои значения):

```bash
# anon не читает заявки (должен вернуться пустой список/403, а не данные)
curl "https://<project>.supabase.co/rest/v1/leads?select=*" \
  -H "apikey: <anon-key>" -H "Authorization: Bearer <anon-key>"

# anon не может вызвать функцию генерации номера
curl -X POST "https://<project>.supabase.co/rest/v1/rpc/generate_lead_number" \
  -H "apikey: <anon-key>" -H "Authorization: Bearer <anon-key>"
# ожидается ошибка прав (function ... does not exist / permission denied)

# anon не читает техническую таблицу счётчиков
curl "https://<project>.supabase.co/rest/v1/lead_number_counters?select=*" \
  -H "apikey: <anon-key>" -H "Authorization: Bearer <anon-key>"
```

Дополнительно вручную в браузере/Supabase Dashboard:

- пользователь без роли `admin` в `profiles` не открывает `/admin` (редирект на `/admin/login?error=forbidden`);
- обычный `authenticated`-пользователь не читает чужие заявки и не назначает себе роль `admin` (нет публичной политики `UPDATE`/`INSERT` на `profiles`);
- в `Project Settings → Database → Roles` / `Database Linter` Supabase не должно быть предупреждений вида «RLS disabled» или «function has no search_path» для таблиц/функций этого проекта;
- в собранном клиентском бандле (`npm run build`, затем поиск по `.next/static`) отсутствуют строки `SUPABASE_SERVICE_ROLE_KEY`, `TELEGRAM_BOT_TOKEN` и их значения.

Эти проверки требуют реального Supabase-проекта и не входят в автоматический CI.

## Production build

```bash
npm run build
npm run start
```

## Деплой на Vercel

1. Импортируйте репозиторий в Vercel.
2. Добавьте переменные окружения из `.env.example` в **Project Settings → Environment Variables** (для Production и Preview).
3. `NEXT_PUBLIC_SITE_URL` укажите как реальный домен деплоя.
4. Запустите деплой — команда сборки по умолчанию (`next build`) не требует изменений.
5. Примените SQL-миграции (включая `0005_security_hardening.sql`) к продакшн-проекту Supabase и назначьте администратора до первого входа в `/admin`.

## Известные ограничения

Проект — демонстрационный портфельный MVP. Сознательно не реализовано:

- Калькулятор даёт **предварительную**, а не окончательную оценку.
- Нет полноценной CRM, назначения ответственных менеджеров и истории изменения статуса заявки.
- Нет пользовательской регистрации (только один способ создания администратора — вручную).
- Нет внешней аналитики (в код заложено место для последующего подключения).
- Нет промышленного rate limiting — только honeypot и проверка времени заполнения формы.
- Нет CAPTCHA.
- Юридические страницы (`/privacy`, `/consent`) демонстрационные и требуют юридической проверки перед реальным коммерческим использованием.
- Telegram-уведомления зависят от доступности внешнего Telegram Bot API; используются только для одностороннего уведомления, без обратной связи и email-дублирования.
- Нет email-рассылки и онлайн-оплаты.
- E2e-тест `admin-lead-management.spec.ts` не покрывает вход администратора, поиск/фильтрацию и смену статуса заявки — только клиентскую валидацию формы входа (см. [«Тестирование»](#тестирование)).
- `npm run test:e2e` не включён в обязательный CI-job.

## Возможные улучшения

- Email-уведомления дополнительно к Telegram.
- История работы с заявкой и заметки менеджера.
- Назначение ответственного менеджера, экспорт заявок в CSV.
- UTM-метки и аналитика источников трафика.
- Интеграция с внешней CRM и календарём.
- Промышленный rate limiting и CAPTCHA.
- Мультиязычный интерфейс, тёмная тема.
- Полноценный e2e-сценарий входа администратора против тестового Supabase-проекта в CI.

## Скриншоты

| Файл | Содержимое |
|---|---|
| `docs/screenshots/home.png` | Главная страница |
| `docs/screenshots/calculator.png` | Калькулятор стоимости |
| `docs/screenshots/mobile-home.png` | Мобильная версия главной страницы |
| `docs/screenshots/admin-dashboard.png` | Дашборд администратора |
| `docs/screenshots/admin-lead-detail.png` | Карточка заявки |
| `docs/screenshots/telegram-notification.png` | **Отсутствует** — снимок реального уведомления в Telegram не создавался автоматически, так как требует настоящего бота и чата. Владельцу репозитория: отправьте тестовую заявку с настроенным ботом и добавьте скриншот сюда вручную. |
