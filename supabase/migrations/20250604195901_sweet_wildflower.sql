/*
  # Add Default Admin User

  1. Changes
    - Creates admin user with specified credentials
    - Sets up admin profile with full permissions
    - Ensures proper role and access configuration

  2. Security
    - Password is properly hashed
    - Admin role is configured with appropriate permissions
*/

-- Create admin user if not exists
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@empresa.com.br',
  crypt('Admin@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  now(),
  now(),
  null,
  null,
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Create admin profile
INSERT INTO public.profiles (
  id,
  name,
  role,
  permissions,
  created_at,
  updated_at
)
SELECT
  id,
  'Administrador',
  'admin',
  ARRAY['all'],
  now(),
  now()
FROM auth.users
WHERE email = 'admin@empresa.com.br'
ON CONFLICT (id) DO NOTHING;