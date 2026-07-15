-- Минимальные табличные права для anon/authenticated.
--
-- PostgreSQL сначала проверяет табличные GRANT-права роли и только потом
-- применяет RLS-политики. Миграции 0001-0005 создают корректные RLS-
-- политики, но ни разу не выдают базовый GRANT SELECT/UPDATE ролям
-- anon/authenticated — без него RLS не имеет значения, роль не может
-- обратиться к таблице вообще (permission denied for table ...), даже если
-- политика разрешила бы нужные строки. Эта миграция закрывает разрыв:
-- выдаёт ровно тот минимум прав, при котором RLS-политики из 0004/0005
-- становятся реальным (а не единственным на бумаге) ограничителем.
--
-- Идемпотентна: GRANT/REVOKE — декларативные операции, повторный запуск
-- приводит к тому же результату. Не отключает RLS, не выдаёт INSERT/
-- DELETE/TRUNCATE/TRIGGER/REFERENCES, не открывает leads анониму, не
-- трогает lead_number_counters и права функций из 0005, не меняет
-- структуру таблиц.

begin;

-- Разрешаем публичным API-ролям обращаться к схеме.
grant usage on schema public to anon, authenticated;

-- Услуги:
-- посетители и вошедшие пользователи могут читать таблицу,
-- а RLS ограничивает публичное чтение активными услугами.
revoke all
on table public.services
from anon, authenticated;

grant select
on table public.services
to anon, authenticated;

-- Заявки:
-- анонимный доступ полностью запрещён.
-- authenticated получает техническое право SELECT/UPDATE,
-- но реальные строки доступны только администраторам через RLS.
revoke all
on table public.leads
from anon, authenticated;

grant select, update
on table public.leads
to authenticated;

-- Профили:
-- анонимный доступ запрещён.
-- authenticated может выполнить SELECT,
-- а RLS разрешает собственный профиль либо административное чтение.
revoke all
on table public.profiles
from anon, authenticated;

grant select
on table public.profiles
to authenticated;

commit;
