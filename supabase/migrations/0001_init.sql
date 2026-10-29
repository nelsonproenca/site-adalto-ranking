-- Presenteadores (pessoas que fizeram pontos em alguma live)
create table if not exists presenters (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  normalized_name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Registros diários de pontos feitos por um presenteador em uma live
create table if not exists live_entries (
  id uuid primary key default gen_random_uuid(),
  presenter_id uuid not null references presenters (id) on delete cascade,
  live_date date not null,
  points integer not null check (points >= 0),
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists live_entries_live_date_idx on live_entries (live_date);
create index if not exists live_entries_presenter_id_idx on live_entries (presenter_id);
