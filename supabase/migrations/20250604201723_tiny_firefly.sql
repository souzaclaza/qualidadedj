/*
  # Create initial admin user and profile

  1. Changes
    - Create admin user in auth.users
    - Create corresponding profile in profiles table
*/

-- Create admin user
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'admin@empresa.com.br'
  ) THEN
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
    );
  END IF;
END $$;

-- Create admin profile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles p
    INNER JOIN auth.users u ON u.id = p.id
    WHERE u.email = 'admin@empresa.com.br'
  ) THEN
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
    WHERE email = 'admin@empresa.com.br';
  END IF;
END $$;