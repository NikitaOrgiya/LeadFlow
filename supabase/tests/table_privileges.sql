-- Проверочный SQL-файл: только чтение системных каталогов Postgres,
-- ничего не изменяет и не выдаёт. Выполните в SQL Editor Supabase после
-- применения миграций 0001-0006, чтобы убедиться, что табличные права и
-- RLS настроены так, как ожидается.

-- 1. Табличные права anon/authenticated на публичных таблицах.
-- Ожидаемый результат:
--   services | anon          | SELECT
--   services | authenticated | SELECT
--   profiles | authenticated | SELECT
--   leads    | authenticated | SELECT
--   leads    | authenticated | UPDATE
-- (никаких строк для anon по leads/profiles, никаких INSERT/DELETE/TRUNCATE)
select
  table_name,
  grantee,
  privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('services', 'leads', 'profiles')
  and grantee in ('anon', 'authenticated')
order by table_name, grantee, privilege_type;

-- 2. RLS включён на всех публичных таблицах проекта, включая техническую
-- таблицу счётчиков заявок. Ожидаемый результат: rls_enabled = true
-- для каждой строки.
select
  relname as table_name,
  relrowsecurity as rls_enabled
from pg_class
where relnamespace = 'public'::regnamespace
  and relname in (
    'services',
    'leads',
    'profiles',
    'lead_number_counters'
  )
order by relname;
