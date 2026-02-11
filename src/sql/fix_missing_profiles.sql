
-- 1. Sync missing profiles from auth.users
-- This is necessary if you signed up *before* the trigger was created.

insert into public.profiles (id, email, full_name, created_at, updated_at)
select 
  id, 
  email, 
  raw_user_meta_data->>'full_name', 
  created_at, 
  last_sign_in_at 
from auth.users
where id not in (select id from public.profiles);

-- 2. NOW update the Admin Role
update public.profiles
set 
  role = 'admin',
  subscription_status = 'active',
  subscription_tier = 'premium',
  is_active = true
where email = 'alvarog0218@gmail.com';

-- 3. Update the Tester User (if exists)
update public.profiles
set 
  role = 'user',
  subscription_status = 'active',
  subscription_tier = 'premium',
  is_active = true
where email = 'Test@inverbet.com';

-- 4. Verify
select email, role, subscription_status from public.profiles;
