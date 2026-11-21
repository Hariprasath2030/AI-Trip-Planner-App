from __future__ import annotations

from typing import Any

from fastapi import HTTPException
from supabase.lib.client_options import ClientOptions


def supabase_error(exc: Exception, fallback: str) -> HTTPException:
    message = getattr(exc, "message", None) or str(exc)
    status = getattr(getattr(exc, "code", None), "__int__", lambda: 400)()
    try:
        status = int(getattr(exc, "code", 400))
    except (TypeError, ValueError):
        status = 400
    if not (400 <= status < 600):
        status = 400
    return HTTPException(status_code=status, detail=message or fallback)


def unwrap(response: Any, fallback: str) -> Any:
    error = getattr(response, "error", None)
    if error is not None:
        raise supabase_error(error, fallback)
    return response.data
