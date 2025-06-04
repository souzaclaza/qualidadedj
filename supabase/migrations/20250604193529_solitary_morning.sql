-- Create initial admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@empresa.com.br',
  crypt('Admin@123', gen_salt('bf')),
  now(),
  now(),
  now()
) ON CONFLICT DO NOTHING;

-- Create admin profile
INSERT INTO public.profiles (
  id,
  name,
  role,
  permissions
) 
SELECT 
  id,
  'Administrador',
  'admin',
  ARRAY['all']
FROM auth.users 
WHERE email = 'admin@empresa.com.br'
ON CONFLICT DO NOTHING;