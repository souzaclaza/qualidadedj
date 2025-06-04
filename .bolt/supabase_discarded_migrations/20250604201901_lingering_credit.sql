/*
  # Create admin user and profile

  1. New Tables
    - Creates admin user in auth.users if not exists
    - Creates admin profile in public.profiles if not exists
    
  2. Security
    - Enables RLS on profiles table
    - Adds appropriate access policies
    - Sets up foreign key relationship with auth.users
    
  3. Indexes
    - Adds performance indexes for common queries
*/

-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  permissions text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read for authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (uid() = id)
  WITH CHECK (uid() = id);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Create admin user
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

-- Create admin profile
INSERT INTO public.profiles (
  id,
  name,
  role,
  permissions
)
SELECT
  u.id,
  'Administrador',
  'admin',
  ARRAY['all']
FROM auth.users u
WHERE u.email = 'admin@empresa.com.br'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = u.id
  );