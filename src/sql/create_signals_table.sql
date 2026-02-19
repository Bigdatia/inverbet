-- Create signals table
create table public.signals (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sport text not null,
  league text not null,
  match text not null,
  type text not null check (type in ('prematch', 'live')),
  market text not null,
  odds numeric not null,
  stake integer not null default 1,
  status text default 'pending' check (status in ('pending', 'won', 'lost', 'void')),
  analysis text,
  is_premium boolean default false,
  confidence text default 'medium' check (confidence in ('low', 'medium', 'high'))
);

-- Enable RLS
alter table public.signals enable row level security;

-- Policies
-- Everyone can read signals (filtering by premium status handled in frontend/backend logic if needed, 
-- but generally we let clients read all and blur UI for free users)
create policy "Signals are viewable by everyone"
  on public.signals for select
  using (true);

-- Only admins can insert/update/delete
create policy "Admins can manage signals"
  on public.signals for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
