create table if not exists public.submissions (
  id bigint generated always as identity primary key,
  participant_id uuid not null unique,
  class_code text not null,
  condition text not null check (condition in ('transparency','relationships','achievement')),
  initial_rating integer not null check (initial_rating between 1 and 5),
  ratings jsonb not null,
  reflection text default '',
  created_at timestamptz not null default now()
);

create index if not exists submissions_class_code_idx on public.submissions(class_code);
create index if not exists submissions_condition_idx on public.submissions(condition);

-- The browser must never access this table directly. All reads/writes go through
-- Next.js server routes using the Supabase service-role key.
alter table public.submissions enable row level security;

-- No anon/authenticated policies are intentionally created.
