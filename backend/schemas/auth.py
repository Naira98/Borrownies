# from typing import List, Optional
from datetime import datetime
from decimal import Decimal

from models.user import UserRole, UserStatus
from pydantic import BaseModel, ConfigDict, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    national_id: str
    phone_number: str
    wallet: Decimal
    status: UserStatus
    role: UserRole
    interests: str | None
    created_date: datetime

    model_config = ConfigDict(from_attributes=True, use_enum_values=True)



# JWT token response
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# JWT token data (payload inside JWT)
class TokenData(BaseModel):
    id: int
    role: str


class LoginResponse(Token):
    user: UserResponse
