from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import BackgroundTasks
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import SecretStr
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
    if settings.FORGET_PASSWORD_SECRET_KEY is None:
        raise ValueError("FORGET_PASSWORD_SECRET_KEY is not set")

    reset_token_expires_at = datetime.now() + timedelta(
        minutes=settings.RESET_PASSWORD_TOKEN_EXPIRATION_MINUTES
    )

    data = {
        "sub": email,
        "exp": reset_token_expires_at,
    }
    reset_token = jwt.encode(
        data, settings.FORGET_PASSWORD_SECRET_KEY, settings.ALGORITHM
    )
    return (reset_token, reset_token_expires_at)


def decode_reset_password_token(reset_token: str):
    if settings.FORGET_PASSWORD_SECRET_KEY is None:
        raise ValueError("FORGET_PASSWORD_SECRET_KEY is not set")

    try:
        payload = jwt.decode(
            reset_token,
            settings.FORGET_PASSWORD_SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        email_from_payload = payload.get("sub")
        if email_from_payload is None:
            return None

        email: str = str(email_from_payload)
        return email
    except JWTError:
        return None


async def send_email(
    user_email: str,
    html_body: str,
    message_subject: str,
    background_tasks: BackgroundTasks,
):
    if (
        settings.MAIL_USERNAME is None
        or settings.MAIL_PASSWORD is None
        or settings.MAIL_FROM is None
        or settings.MAIL_SERVER is None
        or settings.MAIL_PORT is None
    ):
        raise ValueError(
            "Email configuration is not set properly. Check MAIL_USERNAME and MAIL_PASSWORD."
        )

    # --- FastAPI-Mail Configuration ---
    conf = ConnectionConfig(
        MAIL_USERNAME=settings.MAIL_USERNAME,
        MAIL_PASSWORD=SecretStr(settings.MAIL_PASSWORD),
        MAIL_FROM=settings.MAIL_FROM,
        MAIL_PORT=settings.MAIL_PORT,
        MAIL_SERVER=settings.MAIL_SERVER,
        MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
        MAIL_STARTTLS=settings.MAIL_STARTTLS,
        USE_CREDENTIALS=settings.USE_CREDENTIALS,
    )

    fm = FastMail(conf)
    message = MessageSchema(
        subject=message_subject,
        recipients=[user_email],
        body=html_body,
        subtype=MessageType.html,
    )

    background_tasks.add_task(fm.send_message, message)
    print(f"Added task to send password reset email to {user_email}")
