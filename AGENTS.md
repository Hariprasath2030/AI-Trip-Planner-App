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
├── app/                    # Expo Router screens (file-based routing)
│   ├── _layout.tsx         # Root layout (Stack navigator, global styles)
│   └── index.tsx           # Home screen
├── assets/                 # App icons, splash images (add here)
├── components/             # Reusable UI components (create as needed)
├── lib/                    # Utilities, Supabase client, helpers (create as needed)
├── supabase/               # Supabase migrations & edge functions
├── app.json                # Expo config
├── babel.config.js         # Babel config (babel-preset-expo)
├── tsconfig.json           # TypeScript config
├── package.json
└── .env                    # Environment variables (EXPO_PUBLIC_ prefix)
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
- Only add auth when explicitly requested
- Default to Supabase email/password
- Never use magic links or social providers unless asked

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
- [x] Home screen created with feature overview UI
- [x] Supabase env vars configured (EXPO_PUBLIC_ prefix)
- [x] AGENTS.md created with rules and memory
- [ ] Supabase client library not yet installed/connected
- [ ] No database tables created yet
- [ ] No authentication set up yet
- [ ] No AI integration yet
- [ ] No trip planning features implemented yet

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

### Environment
- Supabase project ID: `0ec90b57d6e95fcbda19832f`
- Supabase URL: available in `.env` as `EXPO_PUBLIC_SUPABASE_URL`
- Supabase anon key: available in `.env` as `EXPO_PUBLIC_SUPABASE_ANON_KEY`
