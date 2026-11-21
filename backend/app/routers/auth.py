from __future__ import annotations

from fastapi import APIRouter

from app.core.errors import unwrap
from app.core.supabase import admin_client
from app.schemas.auth import AuthResult, SessionResponse, SignInRequest, SignUpRequest

router = APIRouter()


def _profile_for(user_id: str) -> dict | None:
    response = admin_client.table("profiles").select("*").eq("id", user_id).maybe_single()
    return unwrap(response, "Failed to load profile")


def _session_from(session: dict | None) -> SessionResponse | None:
    if not session:
        return None
    return SessionResponse(
        access_token=session["access_token"],
        refresh_token=session.get("refresh_token", ""),
        expires_in=session.get("expires_in"),
    )


@router.post("/sign-up", response_model=AuthResult)
def sign_up(payload: SignUpRequest) -> AuthResult:
    response = admin_client.auth.sign_up(
        {
            "email": payload.email,
            "password": payload.password,
            "options": {"data": {"full_name": payload.full_name}},
        }
    )
    data = getattr(response, "session", None)
    user = getattr(response, "user", None)
    if getattr(response, "session", None) is None:
        pass
    session = _session_from(getattr(response, "session", None))
    profile = _profile_for(user.id) if user else None
    if session is None:
        return AuthResult(session=None, profile=profile, error="Account created. Please sign in.")
    return AuthResult(session=session, profile=profile, error=None)


@router.post("/sign-in", response_model=AuthResult)
def sign_in(payload: SignInRequest) -> AuthResult:
    response = admin_client.auth.sign_in_with_password(
        {"email": payload.email, "password": payload.password}
    )
    session = _session_from(getattr(response, "session", None))
    if session is None:
        return AuthResult(error="Invalid email or password")
    user = getattr(response, "user", None)
    profile = _profile_for(user.id) if user else None
    return AuthResult(session=session, profile=profile, error=None)


@router.post("/refresh", response_model=AuthResult)
def refresh(refresh_token: str) -> AuthResult:
    response = admin_client.auth.refresh_session(refresh_token=refresh_token)
    session = _session_from(getattr(response, "session", None))
    if session is None:
        return AuthResult(error="Could not refresh session")
    return AuthResult(session=session, error=None)
