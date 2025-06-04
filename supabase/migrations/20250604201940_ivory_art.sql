/*
  # Create profiles table and admin user

  1. New Tables
    - `profiles`: Stores user profile information including role and permissions
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `role` (text)
      - `permissions` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on profiles table
    - Add policies for read access and profile updates
    - Create indexes for performance

  3. Initial Data
    - Create admin user with full permissions
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL,
  permissions text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Create admin user and profile
DO $$ 
DECLARE
  admin_id uuid;
BEGIN
  -- Insert admin user if not exists
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin
  )
  VALUES (
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
    false
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO admin_id;

  -- Insert admin profile if user was created
  IF admin_id IS NOT NULL THEN
    INSERT INTO profiles (id, name, role, permissions)
    VALUES (admin_id, 'Administrador', 'admin', ARRAY['all']);
  END IF;
END $$;