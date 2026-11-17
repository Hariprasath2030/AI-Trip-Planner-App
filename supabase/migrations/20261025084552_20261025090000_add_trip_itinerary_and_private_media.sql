/*
# Add structured trip details and private media storage

1. New Tables
- `trip_itinerary_items`
  - `id` (uuid) — itinerary item identifier.
  - `trip_id` (uuid) — parent trip, deleted with the trip.
  - `day_number` (integer) — day position in the trip.
  - `title` (text) — activity or booking title.
  - `category` (text) — flight, hotel, car, activity, meal, or extra.
  - `start_time` (text) — optional display time.
  - `description` (text) — optional notes.
  - `metadata` (jsonb) — optional booking details such as confirmation codes.
  - `created_at` and `updated_at` (timestamptz) — record timestamps.

2. Modified Tables
- `trips` gains `source`, `description`, `travelers`, and `cover_image_path` for the new-trip form and trip header.

3. Storage
- Adds a private `trip-media` bucket for user-owned trip images.
- Files must be stored under the signed-in user's UUID folder.

4. Security
- Restricts `profiles` and `trips` Data API grants to authenticated users.
- Keeps four owner-scoped policies for each new table operation.
- Adds owner-scoped storage object policies for the private bucket.
- Revokes direct RPC execution of the profile creation trigger.

5. Important Notes
- Existing trip and profile data is preserved.
- Itinerary rows inherit ownership through their parent trip.
- No public file URLs are created; private files require an authenticated session.
*/

ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS source text;
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS travelers text NOT NULL DEFAULT 'Just me';
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS cover_image_path text;

CREATE TABLE IF NOT EXISTS public.trip_itinerary_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  day_number integer NOT NULL DEFAULT 1 CHECK (day_number > 0),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'activity' CHECK (category IN ('flight', 'hotel', 'car', 'activity', 'meal', 'extra')),
  start_time text,
  description text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_itinerary_items ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS trip_itinerary_items_trip_day_idx ON public.trip_itinerary_items (trip_id, day_number, created_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
REVOKE ALL ON public.profiles FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trips TO authenticated;
REVOKE ALL ON public.trips FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trip_itinerary_items TO authenticated;
REVOKE ALL ON public.trip_itinerary_items FROM anon;

DROP POLICY IF EXISTS "select_own_trip_itinerary_items" ON public.trip_itinerary_items;
CREATE POLICY "select_own_trip_itinerary_items" ON public.trip_itinerary_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_itinerary_items.trip_id AND trips.user_id = auth.uid()));
DROP POLICY IF EXISTS "insert_own_trip_itinerary_items" ON public.trip_itinerary_items;
CREATE POLICY "insert_own_trip_itinerary_items" ON public.trip_itinerary_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_itinerary_items.trip_id AND trips.user_id = auth.uid()));
DROP POLICY IF EXISTS "update_own_trip_itinerary_items" ON public.trip_itinerary_items;
CREATE POLICY "update_own_trip_itinerary_items" ON public.trip_itinerary_items FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_itinerary_items.trip_id AND trips.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_itinerary_items.trip_id AND trips.user_id = auth.uid()));
DROP POLICY IF EXISTS "delete_own_trip_itinerary_items" ON public.trip_itinerary_items;
CREATE POLICY "delete_own_trip_itinerary_items" ON public.trip_itinerary_items FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_itinerary_items.trip_id AND trips.user_id = auth.uid()));

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('trip-media', 'trip-media', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = 5242880, allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

DROP POLICY IF EXISTS "trip_media_select_own" ON storage.objects;
CREATE POLICY "trip_media_select_own" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'trip-media' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "trip_media_insert_own" ON storage.objects;
CREATE POLICY "trip_media_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'trip-media' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "trip_media_update_own" ON storage.objects;
CREATE POLICY "trip_media_update_own" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'trip-media' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'trip-media' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "trip_media_delete_own" ON storage.objects;
CREATE POLICY "trip_media_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'trip-media' AND (storage.foldername(name))[1] = auth.uid()::text);

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
