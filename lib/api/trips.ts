export type TripStatus = 'Planning' | 'Upcoming' | 'Completed';
export type ItineraryCategory = 'flight' | 'hotel' | 'car' | 'activity' | 'meal' | 'extra';

export type Trip = {
  id: string;
  title: string | null;
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
  title?: string;
  source?: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  budget?: string;
  interests: string[];
  travelers?: string;
  description?: string;
};

import { request } from './client';

export async function listTrips() {
  return request<Trip[]>('/api/trips', { method: 'GET', auth: true });
}

export async function getTrip(id: string) {
  return request<Trip | null>(`/api/trips/${id}`, { method: 'GET', auth: true });
}

export async function listItineraryItems(tripId: string) {
  return request<ItineraryItem[]>(`/api/trips/${tripId}/itinerary`, { method: 'GET', auth: true });
}

export async function createTrip(input: CreateTripInput) {
  return request<Trip | null>('/api/trips', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({
      title: input.title?.trim() || undefined,
      source: input.source?.trim() || undefined,
      destination: input.destination.trim(),
      start_date: input.startDate || undefined,
      end_date: input.endDate || undefined,
      budget: input.budget || undefined,
      interests: input.interests,
      travelers: input.travelers?.trim() || 'Just me',
      description: input.description?.trim() || undefined,
    }),
  });
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
