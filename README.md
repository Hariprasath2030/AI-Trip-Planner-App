# AI Trip Planner

A polished Expo mobile and web app for turning travel ideas into personal trip plans. The current experience includes a colorful AI-inspired home dashboard, destination discovery, owner-only saved trips, profile settings, and Supabase authentication.

## Features

- Email/password sign up and sign in with Supabase Auth
- Google sign-in entry point through Supabase OAuth
- Automatic profile creation for new accounts
- Private, user-owned trip plans stored in Supabase Postgres
- Home dashboard with search prompt, recent plans, destination inspiration, and quick actions
- Four-step trip creator for destination, dates, budget, and interests
- Trips tab with filters for upcoming, planning, and completed trips
- Responsive Expo Router tabs for Home, Discover, Trips, and Profile
- Reusable dashboard and trip card components

## Install and run

1. Install Node.js 18 or newer.
2. Install project packages:

```bash
npm install
```

3. Confirm the project environment contains these Expo public values:

```text
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the Expo project:

```bash
npm start
```

Then choose the web preview, an Android emulator, or an iOS simulator from the Expo developer menu.

## Supabase setup

The project already uses Supabase for authentication and persistent data.

- `profiles` is created automatically when a user signs up.
- `trips` stores each user’s destination, dates, budget, interests, status, and timestamps.
- Row Level Security is enabled on both tables.
- Authenticated users can only read and change their own profile and trips.
- Google sign-in must be enabled in the Supabase Authentication provider settings before it can be used successfully.

The database migrations are applied through the Supabase migration workflow. Do not use the Supabase CLI for this project.

## Project structure

```text
app/
├── _layout.tsx              Root navigation and auth gate
├── sign-in.tsx              Email/password and Google sign-in
├── sign-up.tsx              Account creation
├── create-trip.tsx          Four-step trip creation flow
├── (tabs)/
│   ├── _layout.tsx          Home, Discover, Trips, Profile tabs
│   ├── index.tsx            Home dashboard data loading
│   ├── discover.tsx         Destination discovery
│   ├── trips.tsx            Saved trips list and filters
│   └── profile.tsx          Profile and sign out
└── trip/[id].tsx            Trip detail route

components/
├── home-dashboard.tsx       Home sections and destination cards
└── trip-card.tsx            Shared saved-trip card

lib/
├── auth.tsx                 Auth provider and profile access
├── supabase.ts              Supabase client and session storage
└── trips.ts                 Trip types, queries, formatting helpers

supabase/migrations/
├── 20261021093448_create_profiles_table.sql
└── create_trips_table       Applied trips table migration
```

## Design direction

The interface uses a bright sky-blue primary color, warm supporting accents, soft cards, rounded controls, readable contrast, and an intentional 8px spacing rhythm. The home screen is organized around the reference layout: greeting, AI search prompt, destination previews, saved plans, and simple bottom navigation.

## Useful checks

```bash
npx tsc --noEmit
npx expo export --platform web
```
## Deployment commands for expo

npm install --global eas-cli
eas init --id a853d0d6-a1e0-4bdf-b8c9-b701c42d6533