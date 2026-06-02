create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  payload jsonb not null
);

grant usage on schema public to anon, authenticated;
grant select, insert on public.analyses to anon, authenticated;

alter table public.analyses enable row level security;

drop policy if exists "Analyses are publicly readable" on public.analyses;
drop policy if exists "Analyses can be inserted by anyone" on public.analyses;

create policy "Analyses are publicly readable"
  on public.analyses
  for select
  to anon, authenticated
  using (true);

create policy "Analyses can be inserted by anyone"
  on public.analyses
  for insert
  to anon, authenticated
  with check (true);

notify pgrst, 'reload schema';
