-- Row Level Security для services, leads, profiles.

alter table services enable row level security;
alter table leads enable row level security;
alter table profiles enable row level security;

-- services: активные услуги читает кто угодно; изменяет только администратор.
create policy "services_public_read_active" on services
  for select
  using (is_active = true);

create policy "services_admin_read_all" on services
  for select
  using (is_admin(auth.uid()));

create policy "services_admin_write" on services
  for all
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- leads: публичного чтения и записи нет — заявки создаются только через
-- серверный маршрут с service-role ключом, который обходит RLS.
create policy "leads_admin_read" on leads
  for select
  using (is_admin(auth.uid()));

create policy "leads_admin_update" on leads
  for update
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- profiles: пользователь видит свой профиль, администратор — все профили.
create policy "profiles_self_read" on profiles
  for select
  using (auth.uid() = id);

create policy "profiles_admin_read" on profiles
  for select
  using (is_admin(auth.uid()));
