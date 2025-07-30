from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import jwt
from passlib.context import CryptContext
from schemas.auth import TokenData
from settings import settings


def create_access_token(
    data: TokenData, expires_delta: Optional[timedelta] = None
) -> str:
    to_encode = data.model_dump()  # Converts the BaseModel to a dict

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode["exp"] = expire

    if settings.JWT_SECRET_KEY is None:
        raise ValueError("JWT_SECRET_KEY is not set")

    encoded_jwt = jwt.encode(
        to_encode, settings.JWT_SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_reset_password_token(email: str):
    if settings.FORGET_PWD_SECRET_KEY is None:
        raise ValueError("FORGET_PWD_SECRET_KEY is not set")

    data = {
        "sub": email,
        "exp": datetime.now(timezone.utc)
        + timedelta(minutes=settings.FORGET_PWD_TOKEN_EXPIRE_MINUTES),
    }
    token = jwt.encode(data, settings.FORGET_PWD_SECRET_KEY, settings.ALGORITHM)
    return token
