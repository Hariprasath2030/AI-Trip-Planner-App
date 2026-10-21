/*
# Create profiles table with auto-creation trigger

## Overview
Creates a `profiles` table that stores extended user information (full name, avatar URL)
beyond what Supabase Auth holds. A database trigger automatically inserts a profile row
whenever a new user signs up via Supabase Auth, so the frontend never needs to manually
create a profile — it just reads and updates it.

## New Tables
- `profiles`
  - `id` (uuid, primary key) — matches the user's ID in `auth.users`
  - `email` (text, not null) — the user's email from auth
  - `full_name` (text, nullable) — display name, set during sign-up or later
  - `avatar_url` (text, nullable) — profile picture URL
  - `created_at` (timestamptz) — when the profile was created
  - `updated_at` (timestamptz) — when the profile was last modified

## Functions
- `handle_new_user()` — trigger function that inserts a profile row for a new auth user,
  pulling `email` and `full_name` from the user's metadata (set during sign-up).

## Triggers
- `on_auth_user_created` — fires AFTER INSERT on `auth.users`, calls `handle_new_user()`.

## Security (RLS)
- RLS enabled on `profiles`.
- SELECT: authenticated users can read only their own profile.
- INSERT: blocked at the RLS level (profiles are created by the trigger using SECURITY DEFINER).
- UPDATE: authenticated users can update only their own profile.
- DELETE: authenticated users can delete only their own profile.

## Notes
1. The trigger function uses `SECURITY DEFINER` so it can insert into `profiles` even though
   the calling role (anon/authenticated) does not have INSERT permission.
2. `full_name` is extracted from `raw_user_meta_data`, which the frontend sets during `signUp()`.
3. Email confirmation is OFF by default — no additional config needed.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
