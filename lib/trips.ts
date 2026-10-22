import { supabase } from './supabase';

export type TripStatus = 'Planning' | 'Upcoming' | 'Completed';

export type Trip = {
  id: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  budget: string | null;
  interests: string[];
  status: TripStatus;
  created_at: string;
  updated_at: string;
};

export type CreateTripInput = {
  destination: string;
  startDate?: string;
  endDate?: string;
  budget?: string;
  interests: string[];
};

export async function listTrips(): Promise<{ data: Trip[]; error: string | null }> {
  const { data, error } = await supabase
    .from('trips')
    .select('id, destination, start_date, end_date, budget, interests, status, created_at, updated_at')
    .order('created_at', { ascending: false });

  return {
    data: (data ?? []) as Trip[],
    error: error?.message ?? null,
  };
}

export async function createTrip(input: CreateTripInput): Promise<{ data: Trip | null; error: string | null }> {
  const { data, error } = await supabase
    .from('trips')
    .insert({
      destination: input.destination,
      start_date: input.startDate || null,
      end_date: input.endDate || null,
      budget: input.budget || null,
      interests: input.interests,
      status: 'Planning',
    })
    .select('id, destination, start_date, end_date, budget, interests, status, created_at, updated_at')
    .maybeSingle();

  return {
    data: data as Trip | null,
    error: error?.message ?? null,
  };
}

export function formatTripDates(trip: Pick<Trip, 'start_date' | 'end_date'>): string {
  if (!trip.start_date || !trip.end_date) return 'Dates to be decided';
  const start = new Date(`${trip.start_date}T12:00:00`);
  const end = new Date(`${trip.end_date}T12:00:00`);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} – ${end.toLocaleDateString('en-US', options)}`;
}

export function getTripDays(trip: Pick<Trip, 'start_date' | 'end_date'>): number {
  if (!trip.start_date || !trip.end_date) return 0;
  const start = new Date(`${trip.start_date}T12:00:00`).getTime();
  const end = new Date(`${trip.end_date}T12:00:00`).getTime();
  return Math.max(1, Math.round((end - start) / 86400000) + 1);
}
