
-- 1. Create a secure function to check admin status (bypasses RLS)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 2. Drop existing problematic policies to start clean
drop policy if exists "Enable select for admins" on public.profiles;
drop policy if exists "Enable update for admins" on public.profiles;
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Users can update own profile." on public.profiles;

-- 3. Re-create robust policies

-- Policy A: Everyone can view their own profile (Essential for app logic)
create policy "Users can view own profile" on public.profiles
for select using (auth.uid() = id);

-- Policy B: Admins can view ALL profiles (Uses secure function)
create policy "Admins can view all profiles" on public.profiles
for select using (public.is_admin());

-- Policy C: Users can update their own profile
create policy "Users can update own profile" on public.profiles
for update using (auth.uid() = id);

-- Policy D: Admins can update ALL profiles
create policy "Admins can update all profiles" on public.profiles
for update using (public.is_admin());

-- Policy E: Users can insert their own profile
create policy "Users can insert own profile" on public.profiles
for insert with check (auth.uid() = id);

-- 4. Verify Admin Status for current user
select email, role, public.is_admin() as is_admin_check from public.profiles where email = 'alvarog0218@gmail.com';
