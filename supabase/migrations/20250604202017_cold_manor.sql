/*
  # Create admin user function

  1. Changes
    - Creates a function to safely create an admin user
    - Uses Supabase auth.admin API instead of direct table manipulation
    - Handles existing user case gracefully
    
  2. Security
    - Password is hashed by Supabase auth system
    - Uses proper auth.users table constraints
    - Maintains RLS policies
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