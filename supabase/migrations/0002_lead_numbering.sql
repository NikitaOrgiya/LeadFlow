-- Атомарная генерация публичного номера заявки вида LF-2026-0001.
-- Счётчик хранится в отдельной таблице по годам — не полагаемся на COUNT(*)
-- из leads, так как это ненадёжно при удалении строк и гонках.

create table lead_number_counters (
  year integer primary key,
  last_value integer not null default 0
);

create function generate_lead_number() returns text as $$
declare
  current_year int := extract(year from now())::int;
  next_value int;
begin
  insert into lead_number_counters (year, last_value)
  values (current_year, 1)
  on conflict (year) do update set last_value = lead_number_counters.last_value + 1
  returning last_value into next_value;

  return 'LF-' || current_year || '-' || lpad(next_value::text, 4, '0');
end;
$$ language plpgsql security definer set search_path = public;
