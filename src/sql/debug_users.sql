
-- 1. Check if ANY users exist in Auth table
select count(*) as auth_users_count from auth.users;

-- 2. Check if a user with your email exists (replace with actual if needed)
select id, email, created_at from auth.users where email = 'alvarog0218@gmail.com';

-- 3. Check profiles count
select count(*) as profiles_count from public.profiles;

-- 4. Try manual insertion again with explicit error reporting
do $$
begin
  insert into public.profiles (id, email, full_name, created_at, updated_at)
  select 
    id, 
    email, 
    raw_user_meta_data->>'full_name', 
    created_at, 
    last_sign_in_at 
  from auth.users
  on conflict (id) do nothing;
end $$;

-- 5. Force update role again (after potential insert)
update public.profiles
set 
  role = 'admin',
  subscription_status = 'active',
  subscription_tier = 'premium',
  is_active = true
where email = 'alvarog0218@gmail.com';

-- 6. Final verification - show results
select email, role, subscription_status from public.profiles;
