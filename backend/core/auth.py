import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Literal

from fastapi import BackgroundTasks
from jose import JWTError, jwt
from passlib.context import CryptContext
from settings import settings
from schemas.auth import TokenData

# JWT Token
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = 30


def create_access_token(
    data: TokenData, expires_delta: Optional[timedelta] = None
) -> str:
    to_encode = data.model_dump()  # Converts the BaseModel to a dict

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode["exp"] = expire

    if JWT_SECRET_KEY is None:
        raise ValueError("JWT_SECRET_KEY is not set")

    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_token_generic(
    email: str,
    secret_key: Optional[str],
    algorithm: str,
    subject: Literal["FORGET_PASSWORD_SECRET_KEY", "EMAIL_VERIFICATION_SECRET_KEY"],
    expiration_minutes: int,
):
    if secret_key is None:
        raise ValueError(f"{subject} is not set")

    token_expires_at = datetime.now() + timedelta(minutes=expiration_minutes)

    data = {
        "sub": email,
        "exp": token_expires_at,
    }
    token = jwt.encode(data, secret_key, algorithm)
    return (token, token_expires_at)


def decode_token_generic(
    token: str,
    secret_key: Optional[str],
    algorithm: str,
    subject: Literal[
        "JWT_SECRET_KEY", "FORGET_PASSWORD_SECRET_KEY", "EMAIL_VERIFICATION_SECRET_KEY"
    ],
):
    if secret_key is None:
        raise ValueError(f"{subject} is not set")

    try:
        payload = jwt.decode(
            token,
            secret_key,
            algorithms=[algorithm],
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
    print(f"Added task to send email to {user_email}")
