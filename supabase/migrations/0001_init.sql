-- LeadFlow: базовая схема — enum, таблицы, триггер updated_at.

create extension if not exists pgcrypto;

create type lead_status as enum ('new', 'contacted', 'in_progress', 'completed', 'rejected');

create table services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  base_price integer not null check (base_price >= 0),
  duration_label text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  public_number text unique not null,
  name text not null,
  phone text not null,
  email text,
  company text,
  service_id uuid references services(id),
  service_name text not null,
  message text,
  selected_options jsonb not null default '[]',
  estimated_min integer check (estimated_min is null or estimated_min >= 0),
  estimated_max integer check (estimated_max is null or estimated_max >= 0),
  status lead_status not null default 'new',
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_status_idx on leads (status);
create index leads_created_at_idx on leads (created_at desc);
create index leads_public_number_idx on leads (public_number);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Единая функция обновления updated_at для всех таблиц ниже.
create function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger services_set_updated_at
  before update on services
  for each row execute function set_updated_at();

create trigger leads_set_updated_at
  before update on leads
  for each row execute function set_updated_at();

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();
