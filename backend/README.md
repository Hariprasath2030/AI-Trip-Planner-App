# AI Trip Planner — Python Backend (FastAPI)

REST API that owns all data access for the app. The mobile/web frontend talks only to this API; it never touches the database directly.

## Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app, CORS, routers
│   ├── core/
│   │   ├── config.py        # environment settings
│   │   ├── supabase.py      # database clients
│   │   ├── deps.py          # auth token verification
│   │   └── errors.py        # error helpers
│   ├── routers/
│   │   ├── auth.py          # POST /api/auth/sign-up, /sign-in, /refresh
│   │   └── trips.py         # CRUD /api/trips + itinerary
│   └── schemas/             # request/response models
├── requirements.txt
└── .env                     # SUPABASE_URL, keys (not committed)
```

## Run locally

```
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Interactive API docs: http://localhost:8000/docs

## Environment variables (backend/.env)

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `ALLOWED_ORIGINS` (comma-separated origins for CORS)
- `SUPABASE_JWT_SECRET` (optional; enables real token verification)

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | /api/health | Health check |
| POST | /api/auth/sign-up | Create account, returns session + profile |
| POST | /api/auth/sign-in | Sign in, returns session + profile |
| POST | /api/auth/refresh | Refresh an access token |
| GET | /api/trips | List the signed-in user's trips |
| POST | /api/trips | Create a trip |
| GET | /api/trips/{id} | Get one trip |
| PATCH | /api/trips/{id} | Update a trip |
| DELETE | /api/trips/{id} | Delete a trip |
| GET | /api/trips/{id}/itinerary | Day-by-day itinerary items |

All trip routes require an `Authorization: Bearer <access_token>` header.
