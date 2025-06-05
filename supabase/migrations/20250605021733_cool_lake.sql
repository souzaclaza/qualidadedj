/*
  # Fix duplicate policies

  This migration checks for existing policies before creating new ones to avoid
  the "policy already exists" error.
*/

-- Function to check if a policy exists
CREATE OR REPLACE FUNCTION policy_exists(
  p_table_name TEXT,
  p_policy_name TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = p_table_name 
    AND policyname = p_policy_name
  ) INTO v_exists;
  
  RETURN v_exists;
END;
$$ LANGUAGE plpgsql;

-- Add write policies for authenticated users to all tables
DO $$ 
DECLARE
  table_name TEXT;
BEGIN
  FOR table_name IN 
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename NOT IN ('schema_migrations')
  LOOP
    -- Add INSERT policy if it doesn't exist
    IF NOT policy_exists(table_name, 'Allow insert for authenticated users') THEN
      EXECUTE format('
        CREATE POLICY "Allow insert for authenticated users" 
        ON %I 
        FOR INSERT 
        TO authenticated 
        WITH CHECK (true)', 
        table_name
      );
    END IF;

    -- Add UPDATE policy if it doesn't exist
    IF NOT policy_exists(table_name, 'Allow update for authenticated users') THEN
      EXECUTE format('
        CREATE POLICY "Allow update for authenticated users" 
        ON %I 
        FOR UPDATE 
        TO authenticated 
        USING (true) 
        WITH CHECK (true)', 
        table_name
      );
    END IF;

    -- Add DELETE policy if it doesn't exist
    IF NOT policy_exists(table_name, 'Allow delete for authenticated users') THEN
      EXECUTE format('
        CREATE POLICY "Allow delete for authenticated users" 
        ON %I 
        FOR DELETE 
        TO authenticated 
        USING (true)', 
        table_name
      );
    END IF;
  END LOOP;
END $$;

-- Drop the helper function
DROP FUNCTION policy_exists;