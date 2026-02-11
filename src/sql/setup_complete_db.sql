
-- 1. Create PROFILES table if it doesn't exist
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  email text,
  
  -- Admin fields
  role text default 'user' check (role in ('user', 'admin')),
  subscription_status text default 'inactive' check (subscription_status in ('active', 'inactive', 'canceled')),
  subscription_tier text default 'free' check (subscription_tier in ('free', 'premium')),
  subscription_start_date timestamp with time zone,
  subscription_end_date timestamp with time zone,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint username_length check (char_length(username) >= 3)
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Basic Policies
create policy "Public profiles are viewable by everyone." on public.profiles
for select using (true);

create policy "Users can insert their own profile." on public.profiles
for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
for update using (auth.uid() = id);

-- 4. Admin Policies for Profiles
create policy "Enable select for admins" on public.profiles 
for select using (
  auth.uid() in (
    select id from public.profiles where role = 'admin'
  )
);

create policy "Enable update for admins" on public.profiles 
for update using (
  auth.uid() in (
    select id from public.profiles where role = 'admin'
  )
);

-- 5. Admin Policies for Registrations (Ensure Registrations table exists first)
create table if not exists public.registrations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text not null,
  email text not null,
  id_document text not null,
  payment_method text not null check (payment_method in ('bancolombia', 'paypal')),
  payment_proof_url text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected'))
);

alter table public.registrations enable row level security;

create policy "Enable insert for all users" on public.registrations for insert with check (true);

create policy "Enable select for admins on registrations" on public.registrations 
for select using (
  auth.uid() in (
    select id from public.profiles where role = 'admin'
  )
);

create policy "Enable update for admins on registrations" on public.registrations 
for update using (
  auth.uid() in (
    select id from public.profiles where role = 'admin'
  )
);

-- 6. Setup Profile Creation Trigger (Crucial for new users)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
