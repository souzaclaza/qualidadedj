/*
  # Fix Profiles Table and RLS Configuration

  1. Changes
    - Enable RLS on profiles table
    - Add RLS policies for profiles table:
      - Allow authenticated users to read their own profile
      - Allow authenticated users to read all profiles (needed for admin functions)
    - Add missing indexes

  2. Security
    - Enable RLS on profiles table
    - Add policies for secure access control
*/

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Add policy for users to read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Add policy for users to read all profiles (needed for admin functions)
CREATE POLICY "Users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Add index on role for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role
  ON profiles(role);

-- Add index on id for better join performance
CREATE INDEX IF NOT EXISTS idx_profiles_id
  ON profiles(id);