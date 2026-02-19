-- Reemplaza 'tu-email@ejemplo.com' con el email del usuario que deseas eliminar

-- Primero eliminamos de auth.users, lo cual debería eliminar en cascada de public.profiles
DELETE FROM auth.users WHERE email = 'tu-email@ejemplo.com';
