/*
# Add a separate trip title

1. Modified Tables
- `trips.title` (text) — the user's short name for a trip, separate from its destination.

2. Security
- Existing owner-scoped RLS policies remain unchanged.
- Existing authenticated table grants continue to cover this new field.

3. Important Notes
- Existing trips are preserved and receive a readable title based on their destination.
- New trips may store a custom title from the new-trip form.
*/

ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS title text;
UPDATE public.trips SET title = destination WHERE title IS NULL;
