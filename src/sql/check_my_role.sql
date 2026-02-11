
-- Check the role and details for the admin user
select id, email, role, subscription_status, is_active 
from public.profiles 
where email = 'alvarog0218@gmail.com';
