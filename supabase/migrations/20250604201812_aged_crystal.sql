/*
  # Create admin user and profile

  1. New Data
    - Creates admin user in auth.users table
    - Creates corresponding admin profile in profiles table
    
  2. Security
    - Uses secure password hashing
    - Sets up proper role and permissions
*/

-- Create admin user if not exists
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  instance_id
)
SELECT 
  gen_random_uuid(),
  'admin@empresa.com.br',
  crypt('Admin@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '00000000-0000-0000-0000-000000000000'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users 
  WHERE email = 'admin@empresa.com.br'
);

-- Create admin profile if not exists
INSERT INTO public.profiles (
  id,
  name,
  role,
  permissions,
  created_at,
  updated_at
)
SELECT
  u.id,
  'Administrador',
  'admin',
  ARRAY['all'],
  now(),
  now()
FROM auth.users u
WHERE u.email = 'admin@empresa.com.br'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = u.id
  );