
-- Script to setup Admin and Tester roles
-- Usage: Run this in Supabase SQL Editor

-- 1. Ensure profiles table exists (idempotent)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  email text,
  role text default 'user' check (role in ('user', 'admin')),
  subscription_status text default 'inactive' check (subscription_status in ('active', 'inactive', 'canceled')),
  subscription_tier text default 'free' check (subscription_tier in ('free', 'premium')),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Clean up any duplicate profiles if they exist (optional safety step)
-- (No specific delete needed unless we know there are dupes, standard upsert is safer)

-- 3. UPGRADE ADMIN USER
-- This assumes the user 'alvarog0218@gmail.com' has already signed up via the App.
-- If not, this update will do nothing until the user is created.
update public.profiles
set 
  role = 'admin',
  subscription_status = 'active',
  subscription_tier = 'premium',
  is_active = true
where email = 'alvarog0218@gmail.com';

-- 4. SETUP TESTER USER (If manually created)
-- If 'Test@inverbet.com' has signed up, ensure they are standard user but active
update public.profiles
set 
  role = 'user',
  subscription_status = 'active', -- Activate subscription for testing
  subscription_tier = 'premium',  -- Give premium to test features
  is_active = true
where email = 'Test@inverbet.com';

-- 5. Verification Query
select email, role, subscription_status from public.profiles 
where email in ('alvarog0218@gmail.com', 'Test@inverbet.com');
