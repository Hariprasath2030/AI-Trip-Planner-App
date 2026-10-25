import { supabase } from './supabase';

export type TripStatus = 'Planning' | 'Upcoming' | 'Completed';
export type ItineraryCategory = 'flight' | 'hotel' | 'car' | 'activity' | 'meal' | 'extra';

export type Trip = {
  id: string;
  destination: string;
  source: string | null;
  start_date: string | null;
  end_date: string | null;
  budget: string | null;
  interests: string[];
  travelers: string;
  description: string | null;
  cover_image_path: string | null;
  status: TripStatus;
  created_at: string;
  updated_at: string;
};

export type ItineraryItem = {
  id: string;
  trip_id: string;
  day_number: number;
  title: string;
  category: ItineraryCategory;
  start_time: string | null;
  description: string | null;
  metadata: Record<string, string>;
  created_at: string;
  updated_at: string;
};

export type CreateTripInput = {
  source?: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  budget?: string;
  interests: string[];
  travelers?: string;
  description?: string;
};

const TRIP_FIELDS = 'id, destination, source, start_date, end_date, budget, interests, travelers, description, cover_image_path, status, created_at, updated_at';

export async function listTrips(): Promise<{ data: Trip[]; error: string | null }> {
  const { data, error } = await supabase.from('trips').select(TRIP_FIELDS).order('created_at', { ascending: false });
  return { data: (data ?? []) as Trip[], error: error?.message ?? null };
}

export async function getTrip(id: string): Promise<{ data: Trip | null; error: string | null }> {
  const { data, error } = await supabase.from('trips').select(TRIP_FIELDS).eq('id', id).maybeSingle();
  return { data: data as Trip | null, error: error?.message ?? null };
}

export async function listItineraryItems(tripId: string): Promise<{ data: ItineraryItem[]; error: string | null }> {
  const { data, error } = await supabase.from('trip_itinerary_items').select('*').eq('trip_id', tripId).order('day_number').order('created_at');
  return { data: (data ?? []) as ItineraryItem[], error: error?.message ?? null };
}

export async function createTrip(input: CreateTripInput): Promise<{ data: Trip | null; error: string | null }> {
  const { data, error } = await supabase.from('trips').insert({
    source: input.source?.trim() || null,
    destination: input.destination.trim(),
    start_date: input.startDate || null,
    end_date: input.endDate || null,
    budget: input.budget || null,
    interests: input.interests,
    travelers: input.travelers?.trim() || 'Just me',
    description: input.description?.trim() || null,
    status: 'Planning',
  }).select(TRIP_FIELDS).maybeSingle();
  return { data: data as Trip | null, error: error?.message ?? null };
}

export function formatTripDates(trip: Pick<Trip, 'start_date' | 'end_date'>): string {
  if (!trip.start_date || !trip.end_date) return 'Dates to be decided';
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${new Date(`${trip.start_date}T12:00:00`).toLocaleDateString('en-US', options)} – ${new Date(`${trip.end_date}T12:00:00`).toLocaleDateString('en-US', options)}`;
}

export function getTripDays(trip: Pick<Trip, 'start_date' | 'end_date'>): number {
  if (!trip.start_date || !trip.end_date) return 0;
  const start = new Date(`${trip.start_date}T12:00:00`).getTime();
  const end = new Date(`${trip.end_date}T12:00:00`).getTime();
  return Math.max(1, Math.round((end - start) / 86400000) + 1);
}
