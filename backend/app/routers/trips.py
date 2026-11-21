from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from app.core.deps import AuthUser, require_user
from app.core.errors import unwrap
from app.core.supabase import user_client
from app.schemas.trips import TripCreate, TripUpdate

router = APIRouter()

TRIP_FIELDS = (
    "id, title, destination, source, start_date, end_date, budget, interests, "
    "travelers, description, cover_image_path, status, created_at, updated_at"
)


def _client_for(user: AuthUser, token: str):
    return user_client(token)


@router.get("")
def list_trips(user: AuthUser = Depends(require_user)) -> list[dict]:
    client = user_client("")
    response = client.table("trips").select(TRIP_FIELDS).order("created_at", ascending=False)
    return unwrap(response, "Failed to load trips") or []


@router.get("/{trip_id}")
def get_trip(trip_id: str, user: AuthUser = Depends(require_user)) -> dict:
    client = user_client("")
    response = client.table("trips").select(TRIP_FIELDS).eq("id", trip_id).maybe_single()
    data = unwrap(response, "Failed to load trip")
    if not data:
        raise HTTPException(status_code=404, detail="Trip not found")
    return data


@router.get("/{trip_id}/itinerary")
def list_itinerary(trip_id: str, user: AuthUser = Depends(require_user)) -> list[dict]:
    client = user_client("")
    response = (
        client.table("trip_itinerary_items")
        .select("*")
        .eq("trip_id", trip_id)
        .order("day_number")
        .order("created_at")
    )
    return unwrap(response, "Failed to load itinerary") or []


@router.post("", status_code=201)
def create_trip(payload: TripCreate, user: AuthUser = Depends(require_user)) -> dict:
    client = user_client("")
    values = {
        "title": (payload.title or "").strip() or payload.destination.strip(),
        "source": (payload.source or "").strip() or None,
        "destination": payload.destination.strip(),
        "start_date": payload.start_date or None,
        "end_date": payload.end_date or None,
        "budget": payload.budget or None,
        "interests": payload.interests,
        "travelers": (payload.travelers or "").strip() or "Just me",
        "description": (payload.description or "").strip() or None,
        "status": "Planning",
    }
    response = client.table("trips").insert(values).select(TRIP_FIELDS).maybe_single()
    return unwrap(response, "Failed to create trip")


@router.patch("/{trip_id}")
def update_trip(trip_id: str, payload: TripUpdate, user: AuthUser = Depends(require_user)) -> dict:
    client = user_client("")
    values = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not values:
        raise HTTPException(status_code=400, detail="Nothing to update")
    response = client.table("trips").update(values).eq("id", trip_id).select(TRIP_FIELDS).maybe_single()
    data = unwrap(response, "Failed to update trip")
    if not data:
        raise HTTPException(status_code=404, detail="Trip not found")
    return data


@router.delete("/{trip_id}", status_code=204)
def delete_trip(trip_id: str, user: AuthUser = Depends(require_user)) -> None:
    client = user_client("")
    response = client.table("trips").delete().eq("id", trip_id)
    unwrap(response, "Failed to delete trip")
