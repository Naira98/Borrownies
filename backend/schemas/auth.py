# from typing import List, Optional
from datetime import datetime
from decimal import Decimal

from models.user import UserRole, UserStatus
from pydantic import BaseModel, ConfigDict, EmailStr

class UserBase(BaseModel):
    email: EmailStr
   


class LoginRequest(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    first_name: str
    last_name: str
    national_id: str
    phone_number: str
    wallet: Decimal
    status: UserStatus
    role: UserRole
    interests: str | None
    created_date: datetime
    reset_token: str | None = None
    reset_token_expires_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True, use_enum_values=True)



# JWT token response
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# JWT token data (payload inside JWT)
class TokenData(BaseModel):
    id: int
    role: str
class RegisterRequest(UserBase):
    first_name: str
    last_name: str
    password: str
    phone_number: str
    national_id: str

class verifyEmailRequest(BaseModel):
    token: str

class LoginResponse(Token):
    user: UserResponse

class ForgetPasswordRequest(UserBase):
    pass

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class MessageResponse(BaseModel):
    message: str

class ResetForegetPassword(BaseModel):
    reset_token: str
    new_password: str
    confirm_password: str

    
class SuccessMessage(BaseModel):
    success: bool
    status_code: int
    message: str