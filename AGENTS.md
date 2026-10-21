# AGENTS.md — AI Trip Planner

> **Purpose:** This file gives any AI agent (including new sessions) the full project context, rules, and memory so we don't waste tokens re-explaining the project every time.

---

## Project Overview

**App Name:** AI Trip Planner
**Type:** Mobile app (iOS + Android) with web support
**Framework:** React Native with Expo (Expo Router for navigation)
**Language:** TypeScript
**Backend:** Supabase (PostgreSQL database, Auth, Edge Functions, Storage)
**Package Manager:** npm

### What the App Does
An AI-powered trip planning app that helps users:
- Generate personalized trip itineraries using AI
- Discover curated destinations
- Navigate their trips with step-by-step guidance
- Save and manage trip plans

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.74.5 + Expo SDK 51 |
| Navigation | Expo Router (file-based routing) |
| Language | TypeScript 5.3 |
| Icons | lucide-react-native |
| Backend | Supabase (pre-provisioned) |
| State | React hooks (expand as needed) |

### Environment Variables
All client-facing env vars must use the `EXPO_PUBLIC_` prefix (Expo requirement).
- `EXPO_PUBLIC_SUPABASE_URL` — Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key

---

## Project Structure

```
ai-trip-planner/
├── app/                        # Expo Router screens (file-based routing)
│   ├── _layout.tsx             # Root layout (AuthProvider + AuthGate + Stack)
│   ├── (tabs)/                 # Tab navigation group
│   │   ├── _layout.tsx         # Tabs layout (Home, Discover, Trips, Profile)
│   │   ├── index.tsx           # Home screen (uses useAuth for user data)
│   │   ├── discover.tsx        # Discover destinations screen
│   │   ├── trips.tsx           # My Trips list screen
│   │   └── profile.tsx         # User profile screen (real user data + sign out)
│   ├── sign-in.tsx             # Sign In screen (email/password + Google OAuth)
│   ├── sign-up.tsx             # Sign Up screen (email/password + Google OAuth)
│   ├── trip/
│   │   └── [id].tsx            # Trip detail screen (day-by-day itinerary)
│   └── create-trip.tsx         # Create trip modal (4-step wizard)
├── lib/
│   ├── supabase.ts             # Supabase client (with SecureStore adapter)
│   └── auth.tsx                # AuthProvider context + useAuth hook
├── assets/                     # App icons, splash images (add here)
├── components/                 # Reusable UI components (create as needed)
├── supabase/                   # Supabase migrations & edge functions
├── app.json                    # Expo config
├── babel.config.js             # Babel config (babel-preset-expo)
├── tsconfig.json               # TypeScript config
├── package.json
└── .env                        # Environment variables (EXPO_PUBLIC_ prefix)
```

---

## Agent Rules

### 1. Code Style
- **Always use TypeScript** — every file should be `.ts` or `.tsx`
- **Type everything explicitly** — no implicit `any`, give all function params types
- **Follow existing patterns** — match the style in `app/` files
- **Import everything you use** — no missing imports (icons, components, types)
- **No unnecessary comments** — only comment non-obvious logic
- **Keep files focused** — one clear purpose per file

### 2. Navigation
- Use **Expo Router** (file-based routing in `app/` directory)
- New screens = new files in `app/` (e.g., `app/trips.tsx` → route `/trips`)
- Nested routes use folders (e.g., `app/trip/[id].tsx` → route `/trip/:id`)

### 3. Styling
- Use **StyleSheet** (React Native built-in) for now
- Color system:
  - Primary: `#0EA5E9` (sky blue)
  - Primary dark: `#0284C7`
  - Background: `#F8FAFC`
  - Surface: `#FFFFFF`
  - Text primary: `#0F172A`
  - Text secondary: `#64748B`
  - Accent light: `#E0F2FE`
- 8px spacing system (8, 16, 24, 32, 40...)
- Always ensure readable contrast on all backgrounds

### 4. Supabase Rules
- **Always enable RLS** on every new table
- Write **4 separate policies** (SELECT, INSERT, UPDATE, DELETE) — never `FOR ALL`
- Use `auth.uid()` for ownership checks — never `current_user`
- Use `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` env vars
- Create Supabase client in `lib/supabase.ts`
- For DDL: use `apply_migration` MCP tool
- For DML/queries: use `execute_sql` MCP tool
- **Never use Supabase CLI** — use MCP tools only

### 5. Auth
- Auth is set up using Supabase email/password + Google OAuth
- `lib/auth.tsx` provides `AuthProvider` context and `useAuth()` hook
- `lib/supabase.ts` creates the Supabase client with SecureStore session persistence
- Root layout (`app/_layout.tsx`) wraps everything in `AuthProvider` and uses `AuthGate`
- AuthGate redirects to `/sign-in` when no session, or `/(tabs)` when authenticated
- Sign In screen: `app/sign-in.tsx` — email/password + Google OAuth
- Sign Up screen: `app/sign-up.tsx` — email/password + Google OAuth
- A `profiles` table stores extended user info (full_name, avatar_url)
- A database trigger (`handle_new_user`) auto-creates a profile on signup
- Profile RLS: users can only read/update/delete their own profile
- `useAuth()` exposes: session, user, profile, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, refreshProfile

### 6. Dependencies
- **Always check package.json** before using a library
- Only add dependencies when actually needed
- After adding to package.json, run `npm install`

### 7. Error Handling
- Check API/backend results before using them
- Show visible error states in the UI (not silent failures)
- Handle empty/loading states explicitly

---

## Project Memory

> Update this section as the project evolves. This saves tokens in new sessions.

### Current State (2026-10-21)
- [x] Basic Expo project initialized (Expo SDK 51, React Native 0.74.5)
- [x] Expo Router set up with file-based routing
- [x] Full tab navigation structure: Home, Discover, Trips, Profile
- [x] Home screen with hero card, quick actions, recent trips, popular destinations
- [x] Discover screen with category filters, destination cards, favorites
- [x] Trips screen with filter tabs, trip cards, empty state
- [x] Profile screen with stats, settings menu, real user data, working sign out
- [x] Trip detail screen (trip/[id]) with day-by-day itinerary timeline
- [x] Create Trip modal (create-trip) with 4-step wizard (destination, dates, budget, interests)
- [x] Supabase env vars configured (EXPO_PUBLIC_ prefix)
- [x] AGENTS.md created with rules and memory
- [x] expo-haptics installed (not yet wired up)
- [x] Supabase client connected (lib/supabase.ts with SecureStore adapter)
- [x] Auth context set up (lib/auth.tsx with AuthProvider + useAuth hook)
- [x] Sign In screen with email/password + Google OAuth (Dribbble-inspired UI)
- [x] Sign Up screen with email/password + Google OAuth (Dribbble-inspired UI)
- [x] Auth gate routing in root layout (redirects based on session state)
- [x] profiles table created with RLS + auto-creation trigger on signup
- [x] Profile screen shows real user data from profiles table
- [x] Home screen greeting shows real user name + avatar initial
- [ ] No trips table created yet
- [ ] No AI integration yet
- [ ] Trips use hardcoded sample data (not yet connected to Supabase)
- [ ] Create Trip form doesn't persist data yet
- [ ] Google OAuth requires provider configuration in Supabase dashboard

### Planned Features (Roadmap)
1. **Trip Generation** — AI-powered itinerary creation based on user inputs (destination, dates, budget, interests)
2. **Trip Management** — Save, view, edit, delete trip plans
3. **Destination Discovery** — Browse curated destinations
4. **User Accounts** — Auth to save personal trips
5. **Trip Navigation** — Day-by-day itinerary view during travel
6. **Maps Integration** — Visual route planning

### Decisions Made
- Using Expo Router over React Navigation (file-based, better DX)
- Using lucide-react-native for icons
- StyleSheet for styling (can migrate to NativeWind later if needed)
- Supabase for all backend needs (database, auth, functions)
- Sky blue (#0EA5E9) as primary brand color
- Auth: email/password + Google OAuth via Supabase
- Session storage: expo-secure-store on native, localStorage on web
- Profile auto-creation: database trigger on auth.users insert (SECURITY DEFINER)
- Auth context: React Context API with useAuth() hook
- Sign In/Sign Up UI: Dribbble-inspired card-based layout with sky-blue theme

### Environment
- Supabase project ID: `0ec90b57d6e95fcbda19832f`
- Supabase URL: available in `.env` as `EXPO_PUBLIC_SUPABASE_URL`
- Supabase anon key: available in `.env` as `EXPO_PUBLIC_SUPABASE_ANON_KEY`
