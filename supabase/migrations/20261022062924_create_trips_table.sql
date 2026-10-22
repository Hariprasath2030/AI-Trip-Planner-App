/*
# Create owner-scoped trips table

1. New Tables
- `trips`
  - `id` (uuid, primary key) — unique trip identifier
  - `user_id` (uuid, not null) — authenticated owner, defaulted from the current session
  - `destination` (text, not null) — destination entered by the traveler
  - `start_date` (date, nullable) — first travel date
  - `end_date` (date, nullable) — last travel date
  - `budget` (text, nullable) — selected spending range
  - `interests` (text array, not null) — selected travel interests
  - `status` (text, not null) — Planning, Upcoming, or Completed
  - `created_at` (timestamptz) — creation time
  - `updated_at` (timestamptz) — latest update time

2. Security
- Enable RLS on `trips`.
- Authenticated users can select, insert, update, and delete only their own trips.
- The owner is assigned by `auth.uid()` by default so clients cannot omit or spoof ownership.

3. Important Notes
- This table stores the planning inputs first; generated itinerary content can be added later without changing ownership rules.
- Policies are split by CRUD operation to keep access explicit.
*/

CREATE TABLE IF NOT EXISTS public.trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  destination text NOT NULL,
  start_date date,
  end_date date,
  budget text,
  interests text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'Planning' CHECK (status IN ('Planning', 'Upcoming', 'Completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS trips_user_id_created_at_idx ON public.trips (user_id, created_at DESC);

DROP POLICY IF EXISTS "select_own_trips" ON public.trips;
CREATE POLICY "select_own_trips" ON public.trips FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_trips" ON public.trips;
CREATE POLICY "insert_own_trips" ON public.trips FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_trips" ON public.trips;
CREATE POLICY "update_own_trips" ON public.trips FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_trips" ON public.trips;
CREATE POLICY "delete_own_trips" ON public.trips FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
