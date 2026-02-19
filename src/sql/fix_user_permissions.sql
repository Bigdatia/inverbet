-- Reemplaza 'tu-email@ejemplo.com' con el email de tu usuario administrador
-- Si solo tienes un usuario, este script actualizará a todos los usuarios a admin/premium

UPDATE public.profiles
SET 
  role = 'admin',
  subscription_tier = 'premium',
  subscription_status = 'active',
  is_active = true
WHERE email = 'tu-email@ejemplo.com'; -- O borra esta línea WHERE para actualizar a TODOS
