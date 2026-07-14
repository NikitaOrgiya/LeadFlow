-- Проверка роли администратора без рекурсивных RLS-политик.
-- SECURITY DEFINER выполняет запрос от имени владельца функции, минуя RLS
-- таблицы profiles, поэтому политики, использующие is_admin(), не вызывают
-- повторную проверку RLS на самой profiles.

create function is_admin(uid uuid) returns boolean as $$
  select exists (
    select 1 from profiles where id = uid and role = 'admin'
  );
$$ language sql security definer stable set search_path = public;
