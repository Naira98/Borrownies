from datetime import datetime, timedelta, timezone

from core.auth import (
    create_token_generic,
    decode_token_generic,
    get_password_hash,
    send_email,
    verify_password,
)
from db.database import get_db
from fastapi import APIRouter, BackgroundTasks, Depends, Response, status
from fastapi.responses import JSONResponse
from models.session import Session
from models.user import UserStatus
from nanoid import generate
from schemas.auth import (
    ForgetPasswordRequest,
    LoginRequest,
    LoginResponse,
    MessageResponse,
    ResetForegetPassword,
    SuccessMessage,
)
from settings import settings
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from utils.auth import get_user_by_email

# from models.user import User, UserRole

auth_router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@auth_router.post("/register")
async def register():
    return {"message": "Register endpoint"}


@auth_router.post("/login", response_model=LoginResponse)
async def login(
    user_login: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)
):
    # """ GENERATE DUMMY USER DATA FOR TESTING PURPOSE """
    # dummy_user = User(
    #     **{
    #         "first_name": "test",
    #         "last_name": "test",
    #         "email": "test@test.com",
    #         "password": get_password_hash("test"),
    #         "status": UserStatus.ACTIVATED.value,
    #         "role": UserRole.CLIENT.value,
    #         "national_id": "12345678901234",
    #         "phone_number": "12345678901",
    #     }
    # )
    # db.add(dummy_user)
    # await db.commit()
    # await db.refresh(dummy_user)
    # print("ADDED DUMMY USER 🤡🤡🤡🤡🤡", dummy_user.id)

    user = await get_user_by_email(user_login.email, db)

    if not user or not verify_password(user_login.password, user.password):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"message": "Incorrect email or password"},
        )

    if user.status.value == UserStatus.DEACTIVATED.value:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "User is not activated"},
        )

    elif user.status.value == UserStatus.BLOCKED.value:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "User is blocked"},
        )

    session_token = generate(size=100)
    session_expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.SESSION_EXPIRE_MINUTES
    )

    new_session = Session(
        session=session_token, expires_at=session_expires_at, user_id=user.id
    )

    db.add(new_session)
    await db.commit()

    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        expires=session_expires_at,
    )

    return user


@auth_router.post("/forget-password", response_model=MessageResponse)
async def forget_password(
    fpr: ForgetPasswordRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    user = await get_user_by_email(fpr.email, db)

    if user is None:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Invalid Email address"},
        )

    reset_token, reset_token_expires_at = create_token_generic(
        user.email,
        settings.FORGET_PASSWORD_SECRET_KEY,
        settings.ALGORITHM,
        "FORGET_PASSWORD_SECRET_KEY",
        settings.RESET_PASSWORD_TOKEN_EXPIRATION_MINUTES,
    )

    user.reset_token = reset_token
    user.reset_token_expires_at = reset_token_expires_at

    await db.commit()

    reset_link = f"{settings.APP_HOST}{settings.FORGET_PASSWORD_URL}/{reset_token}"

    html_body = f"""
        <html>
            <body>
                <p>You have requested to reset your password. Click the link below to reset it:</p>
                <p><a href="{reset_link}">Reset Password</a></p>
                <p>This link will expire in {settings.RESET_PASSWORD_TOKEN_EXPIRATION_MINUTES} minutes.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
            </body>
        </html>
        """

    await send_email(user.email, html_body, "Password Reset Request", background_tasks)

    return {"message": "Password reset email has been sent."}


@auth_router.post("/reset-password", response_model=SuccessMessage)
async def reset_password(rfp: ResetForegetPassword, db: AsyncSession = Depends(get_db)):
    if rfp.new_password != rfp.confirm_password:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "New password and confirm password are not same."},
        )

    info = decode_token_generic(
        rfp.reset_token,
        settings.FORGET_PASSWORD_SECRET_KEY,
        settings.ALGORITHM,
        "FORGET_PASSWORD_SECRET_KEY",
    )
    if info is None:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": "Invalid Password Reset Payload"},
        )

    user = await get_user_by_email(info, db)

    if user is None:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "User not found"},
        )

    if (
        user.reset_token_expires_at is None
        or user.reset_token_expires_at < datetime.now()
    ):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Reset token has expired"},
        )

    hashed_password = get_password_hash(rfp.new_password)

    user.password = hashed_password
    user.reset_token = None
    user.reset_token_expires_at = None

    # remove all sessions after reseting password
    await db.execute(delete(Session).where(Session.user_id == user.id))

    await db.commit()
    return {
        "success": True,
        "status_code": status.HTTP_200_OK,
        "message": "Password Rest Successfull!",
    }
