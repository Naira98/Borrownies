from datetime import datetime, timedelta
from typing import Literal, Optional

from fastapi import BackgroundTasks
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import SecretStr
from settings import settings


# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


# Token generation and decoding
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


# Sending mails
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
