"""Pydantic models for authentication payloads."""
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


UserRole = Literal["user", "admin"]


class RegisterInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    name: Optional[str] = Field(default=None, max_length=80)


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class GoogleAuthInput(BaseModel):
    # The ID-token JWT returned by Google Identity Services on the client.
    credential: str = Field(min_length=10, max_length=4096)


class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: Optional[str] = None
    role: UserRole = "user"
    created_at: Optional[datetime] = None
