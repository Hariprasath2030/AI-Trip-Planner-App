from __future__ import annotations

from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel

bearer_scheme = HTTPBearer(auto_error=False)

SUPABASE_JWT_SECRET = ""  # set via env SUPABASE_JWT_SECRET


class AuthUser(BaseModel):
    id: str
    email: str | None = None


def require_user(creds: HTTPAuthorizationCredentials | None) -> AuthUser:
    if creds is None or not creds.credentials:
        raise HTTPException(status_code=401, detail="Missing authorization token")
    token = creds.credentials
    import os

    secret = os.environ.get("SUPABASE_JWT_SECRET", "")
    try:
        if secret:
            payload = jwt.decode(token, secret, algorithms=["HS256"], options={"verify_aud": False})
        else:
            # Without a secret, decode without verification but reject obviously malformed tokens.
            payload = jwt.decode(token, options={"verify_signature": False, "verify_aud": False})
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = payload.get("sub")
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    return AuthUser(id=user, email=payload.get("email"))
