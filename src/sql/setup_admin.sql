
-- Add role column to profiles if it doesn't exist
alter table public.profiles 
add column if not exists role text default 'user' check (role in ('user', 'admin'));

-- Add subscription fields to profiles
alter table public.profiles 
add column if not exists subscription_status text default 'inactive' check (subscription_status in ('active', 'inactive', 'canceled'));

alter table public.profiles 
add column if not exists subscription_end_date timestamp with time zone;

-- Update RLS policies for profiles

-- Allow admins to see all profiles
create policy "Enable select for admins" on public.profiles 
for select using (
  auth.uid() in (
    select id from public.profiles where role = 'admin'
  )
);

-- Allow admins to update all profiles
create policy "Enable update for admins" on public.profiles 
for update using (
  auth.uid() in (
    select id from public.profiles where role = 'admin'
  )
);

-- RLS policies for registrations table (from previous step, ensuring admins can view/update)

-- Allow admins to select all registrations
create policy "Enable select for admins" on public.registrations 
for select using (
  auth.uid() in (
    select id from public.profiles where role = 'admin'
  )
);

-- Allow admins to update registrations (to approve/reject)
create policy "Enable update for admins" on public.registrations 
for update using (
  auth.uid() in (
    select id from public.profiles where role = 'admin'
  )
);
