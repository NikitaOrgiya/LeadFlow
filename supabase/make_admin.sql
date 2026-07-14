-- Шаблон назначения роли администратора.
-- 1. Создайте пользователя в Supabase Dashboard → Authentication → Users
--    (Add user → email + пароль). Публичной регистрации в проекте нет.
-- 2. Замените email ниже и выполните запрос в SQL Editor вашего проекта.

insert into profiles (id, full_name, role)
select id, 'Администратор LeadFlow', 'admin'
from auth.users
where email = 'admin@example.com'
on conflict (id) do update set role = 'admin', full_name = excluded.full_name;
