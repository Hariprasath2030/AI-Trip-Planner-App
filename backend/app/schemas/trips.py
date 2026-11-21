from __future__ import annotations

from pydantic import BaseModel, Field


class TripCreate(BaseModel):
    title: str | None = Field(default=None, max_length=160)
    source: str | None = Field(default=None, max_length=160)
    destination: str = Field(min_length=1, max_length=160)
    start_date: str | None = Field(default=None, max_length=10)
    end_date: str | None = Field(default=None, max_length=10)
    budget: str | None = Field(default=None, max_length=40)
    interests: list[str] = Field(default_factory=list)
    travelers: str | None = Field(default=None, max_length=80)
    description: str | None = Field(default=None, max_length=600)


class TripUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=160)
    source: str | None = Field(default=None, max_length=160)
    destination: str | None = Field(default=None, max_length=160)
    start_date: str | None = Field(default=None, max_length=10)
    end_date: str | None = Field(default=None, max_length=10)
    budget: str | None = Field(default=None, max_length=40)
    interests: list[str] | None = None
    travelers: str | None = Field(default=None, max_length=80)
    description: str | None = Field(default=None, max_length=600)
    status: str | None = Field(default=None, pattern="^(Planning|Upcoming|Completed)$")
