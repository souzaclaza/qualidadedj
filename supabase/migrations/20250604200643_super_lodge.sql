DO $$ 
BEGIN
  -- Create admin user if not exists
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
    );
  END IF;
END $$;

DO $$
BEGIN
  -- Create admin profile if not exists
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles p
    INNER JOIN auth.users u ON u.id = p.id
    WHERE u.email = 'admin@empresa.com.br'
  ) THEN
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
    WHERE email = 'admin@empresa.com.br';
  END IF;
END $$;