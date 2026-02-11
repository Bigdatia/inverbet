
-- 1. FORCE insert Admin profile
insert into public.profiles (id, email, full_name, created_at, updated_at)
select 
  id, 
  email, 
  raw_user_meta_data->>'full_name', 
  created_at, 
  last_sign_in_at 
from auth.users
where email = 'alvarog0218@gmail.com'
on conflict (id) do nothing;

-- 2. Update Admin to ACTIVE and role ADMIN
update public.profiles
set 
  role = 'admin',
  subscription_status = 'active',
  subscription_tier = 'premium',
  is_active = true
where email = 'alvarog0218@gmail.com';

-- 3. FORCE insert Tester profile
insert into public.profiles (id, email, full_name, created_at, updated_at)
select 
  id, 
  email, 
  raw_user_meta_data->>'full_name', 
  created_at, 
  last_sign_in_at 
from auth.users
where email = 'Test@inverbet.com'
on conflict (id) do nothing;

-- 4. Update Tester to ACTIVE
update public.profiles
set 
  role = 'user',
  subscription_status = 'active',
  subscription_tier = 'premium',
  is_active = true
where email = 'Test@inverbet.com';

-- 5. VERIFY - Show both profiles
select email, role, subscription_status from public.profiles
where email in ('alvarog0218@gmail.com', 'Test@inverbet.com');
