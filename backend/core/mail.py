# core/mail.py
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import os


conf = ConnectionConfig(
    MAIL_USERNAME="your_email@example.com",
    MAIL_PASSWORD="your_password",
    MAIL_FROM="your_email@example.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

async def send_verification_email(email: str, token: str):
    verification_link = f"http://localhost:8000/users/verify-email?token={token}"

    message = MessageSchema(
        subject="Verify your account",  
        recipients=[email],
        body=f"Click the link to verify your account: {verification_link}",
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)
    