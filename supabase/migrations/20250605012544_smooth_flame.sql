/*
  # Admin User and Security Setup

  1. Changes
    - Creates admin user through auth.create_user
    - Sets up admin profile with full permissions
    - Adds necessary RLS policies
    - Creates performance indexes

  2. Security
    - Uses auth.create_user for secure user creation
    - Implements proper RLS policies
    - Adds security context for function execution
*/

-- Create the function to handle admin user creation
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
DECLARE
  _user_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO _user_id
  FROM auth.users
  WHERE email = 'admin@empresa.com.br';

  -- Only create if user doesn't exist
  IF _user_id IS NULL THEN
    -- Create user through auth API
    _user_id := auth.create_user(
      jsonb_build_object(
        'email', 'admin@empresa.com.br',
        'password', 'Admin@123',
        'email_confirmed_at', now(),
        'role', 'authenticated'
      )
    );

    -- Insert profile with admin role
    INSERT INTO public.profiles (id, name, role, permissions)
    VALUES (
      _user_id,
      'Administrador',
      'admin',
      ARRAY['all']
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function
SELECT create_admin_user();

-- Drop the function after use
DROP FUNCTION create_admin_user();

-- Enable RLS on profiles table if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Add policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can read own profile'
  ) THEN
    CREATE POLICY "Users can read own profile"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can read all profiles'
  ) THEN
    CREATE POLICY "Users can read all profiles"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Add indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND indexname = 'idx_profiles_role'
  ) THEN
    CREATE INDEX idx_profiles_role ON profiles(role);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND indexname = 'idx_profiles_id'
  ) THEN
    CREATE INDEX idx_profiles_id ON profiles(id);
  END IF;
END $$;