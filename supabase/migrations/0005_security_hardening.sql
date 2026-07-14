-- Security hardening: закрывает техническую таблицу счётчиков от прямого
-- доступа, ограничивает EXECUTE на SECURITY DEFINER функциях только теми
-- ролями, которым он действительно нужен, и явно привязывает
-- административные RLS-политики к роли authenticated.
--
-- Ничего в уже применённых миграциях (0001-0004) не меняется — все правки
-- сделаны через ALTER/REVOKE/GRANT/DROP POLICY + CREATE POLICY.

-- 1. lead_number_counters: техническая таблица, к которой не должно быть
-- прямого доступа ни у anon, ни у authenticated — только у service_role
-- (используется исключительно внутри generate_lead_number()).
alter table public.lead_number_counters enable row level security;

revoke all on table public.lead_number_counters from anon, authenticated;
-- Публичных политик сознательно не создаём: RLS включён, политик нет,
-- значит для anon/authenticated таблица недоступна ни на чтение, ни на
-- запись. service_role обходит RLS и продолжает работать как раньше.

-- 2. generate_lead_number(): пересоздаём с search_path = '' и полностью
-- квалифицированным именем таблицы, затем закрываем EXECUTE от anon и
-- authenticated — вызывать функцию должен только сервер через service_role.
create or replace function public.generate_lead_number()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_year int := extract(year from now())::int;
  next_value int;
begin
  insert into public.lead_number_counters (year, last_value)
  values (current_year, 1)
  on conflict (year) do update set last_value = public.lead_number_counters.last_value + 1
  returning last_value into next_value;

  return 'LF-' || current_year || '-' || lpad(next_value::text, 4, '0');
end;
$$;

revoke execute on function public.generate_lead_number() from public, anon, authenticated;
grant execute on function public.generate_lead_number() to service_role;

-- 3. is_admin(uuid): та же схема с search_path = '' и полной квалификацией
-- таблицы profiles. authenticated получает доступ (функция вызывается из
-- RLS-политик, которые применяются к запросам обычных вошедших пользователей,
-- и должна вернуть false, а не упасть с ошибкой прав). anon доступа не
-- получает — все политики, использующие is_admin(), ниже явно ограничены
-- ролью authenticated, поэтому для anon эта функция вообще не вызывается.
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = uid and role = 'admin'
  );
$$;

revoke execute on function public.is_admin(uuid) from public, anon, authenticated;
grant execute on function public.is_admin(uuid) to authenticated, service_role;

-- 4. Пересоздаём административные политики с явным TO authenticated.
-- Без этого Postgres пытается вычислить is_admin() и для запросов anon,
-- что после revoke выше упадёт с "permission denied for function" вместо
-- того, чтобы просто не подойти под политику.

drop policy if exists "services_admin_read_all" on services;
create policy "services_admin_read_all" on services
  for select
  to authenticated
  using (is_admin(auth.uid()));

drop policy if exists "services_admin_write" on services;
create policy "services_admin_write" on services
  for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

drop policy if exists "leads_admin_read" on leads;
create policy "leads_admin_read" on leads
  for select
  to authenticated
  using (is_admin(auth.uid()));

drop policy if exists "leads_admin_update" on leads;
create policy "leads_admin_update" on leads
  for update
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

drop policy if exists "profiles_self_read" on profiles;
create policy "profiles_self_read" on profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_admin_read" on profiles;
create policy "profiles_admin_read" on profiles
  for select
  to authenticated
  using (is_admin(auth.uid()));

-- services_public_read_active остаётся без изменений: она не вызывает
-- is_admin() и должна оставаться доступной анониму.
