-- 1. Verifica si existe la función handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, subscription_tier, subscription_status, is_active)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'user',
    'free',
    'inactive',
    true
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Asegura que el trigger esté activo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Verifica si tu usuario se creó en auth.users pero no en profiles
-- Si devuelve una fila, significa que el trigger falló anteriormente
SELECT * FROM auth.users WHERE email = 'alvarog0218@gmail.com';

-- 4. INSERT manual de emergencia si el usuario existe en auth pero no en profiles
INSERT INTO public.profiles (id, email, full_name, role, subscription_tier, subscription_status, is_active)
SELECT id, email, raw_user_meta_data->>'full_name', 'admin', 'premium', 'active', true
FROM auth.users
WHERE email = 'alvarog0218@gmail.com'
AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.users.id);
