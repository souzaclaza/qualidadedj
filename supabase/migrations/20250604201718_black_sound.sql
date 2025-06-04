/*
  # Update profiles table security policies

  1. Security
    - Enable RLS on profiles table
    - Create comprehensive read/write policies
    - Add service role access
    - Add indexes for performance

  2. Changes
    - Update foreign key constraint
    - Add performance indexes
*/

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

CREATE POLICY "Service role can manage all profiles"
  ON profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_profiles_name ON profiles(name);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Update foreign key
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey CASCADE;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_id_fkey 
  FOREIGN KEY (id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;