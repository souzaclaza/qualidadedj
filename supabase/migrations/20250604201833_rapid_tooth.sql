/*
  # Create admin user and profile

  1. New Users
    - Creates admin user in auth.users if not exists
    - Creates admin profile in public.profiles if not exists
    
  2. Security
    - Sets up proper authentication role and permissions
    - Uses secure password hashing
    - Links profile to user via foreign key
*/

-- Create temporary function to handle admin user creation
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
DECLARE
  admin_id uuid;
BEGIN
  -- Insert admin user if not exists and get ID
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
  VALUES (
    gen_random_uuid(),
    'admin@empresa.com.br',
    crypt('Admin@123', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated',
    '00000000-0000-0000-0000-000000000000'
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO admin_id;

  -- If admin was created, create profile
  IF admin_id IS NOT NULL THEN
    INSERT INTO public.profiles (
      id,
      name,
      role,
      permissions,
      created_at,
      updated_at
    )
    VALUES (
      admin_id,
      'Administrador',
      'admin',
      ARRAY['all'],
      now(),
      now()
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute function
SELECT create_admin_user();

-- Clean up
DROP FUNCTION create_admin_user();