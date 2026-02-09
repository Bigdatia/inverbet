-- Create the registrations table
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

-- Enable RLS
alter table public.registrations enable row level security;

-- Allow anyone to insert (since they are not logged in yet)
create policy "Enable insert for all users" on public.registrations for insert with check (true);

-- Allow admins/service_role to select/update (or authenticated users if you want them to see their own status later)
create policy "Enable select for service_role" on public.registrations for select using (auth.role() = 'service_role');
create policy "Enable update for service_role" on public.registrations for update using (auth.role() = 'service_role');


-- Storage Bucket for Payment Proofs
insert into storage.buckets (id, name, public) 
values ('payment-proofs', 'payment-proofs', true)
on conflict (id) do nothing;

-- Allow public uploads to this bucket
create policy "Public Upload" on storage.objects for insert with check ( bucket_id = 'payment-proofs' );
create policy "Public Select" on storage.objects for select using ( bucket_id = 'payment-proofs' );
