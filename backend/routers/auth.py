from datetime import datetime

from core.auth import (
    create_access_token,
    create_token_generic,
    decode_token_generic,
    get_password_hash,
    send_email,
    verify_password,
)
from db.database import get_db
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from models.user import User, UserStatus
from schemas.auth import (
    ForgetPasswordRequest,
    LoginRequest,
    LoginResponse,
    MessageResponse,
    ResetForegetPassword,
    SuccessMessage,
    TokenData,
)
from settings import settings
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
# from models.user import UserRole


auth_router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@auth_router.post("/register")
async def register():
    return {"message": "Register endpoint"}


@auth_router.post("/login", response_model=LoginResponse)
async def login(user_login: LoginRequest, db: AsyncSession = Depends(get_db)):
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

    result = await db.execute(select(User).where(User.email == user_login.email))
    user = result.scalars().first()

    if not user or not verify_password(user_login.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.status.value == UserStatus.DEACTIVATED.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User is not activated"
        )

    elif user.status.value == UserStatus.BLOCKED.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User is blocked"
        )

    access_token = create_access_token(TokenData(id=user.id, role=user.role.value))

    return LoginResponse(access_token=access_token, user=user)


@auth_router.post("/forget-password", response_model=MessageResponse)
async def forget_password(
    fpr: ForgetPasswordRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    try:
        result = await db.execute(select(User).where(User.email == fpr.email))
        user = result.scalars().first()

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid Email address",
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
        db.add(user)

        try:
            await db.commit()
            await db.refresh(user)
        except IntegrityError:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not generate unique reset token. Please try again.",
            )

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

        await send_email(
            user.email, html_body, "Password Reset Request", background_tasks
        )

        return {
            "message": "Password reset email has been sent."
        }

    except Exception as e:
        print(f"An error occurred in /forget-password: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal server error occurred. Please try again later.",
        )


@auth_router.post("/reset-password", response_model=SuccessMessage)
async def reset_password(rfp: ResetForegetPassword, db: AsyncSession = Depends(get_db)):
    try:
        if rfp.new_password != rfp.confirm_password:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="New password and confirm password are not same.",
            )

        info = decode_token_generic(
            rfp.reset_token,
            settings.FORGET_PASSWORD_SECRET_KEY,
            settings.ALGORITHM,
            "FORGET_PASSWORD_SECRET_KEY",
        )
        if info is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Invalid Password Reset Payload or Reset Link Expired",
            )

        result = await db.execute(select(User).where(User.email == info))
        user = result.scalars().first()

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        if (
            user.reset_token_expires_at is None
            or user.reset_token_expires_at < datetime.now()
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reset token has expired",
            )

        hashed_password = get_password_hash(rfp.new_password)

        user.password = hashed_password
        user.reset_token = None
        user.reset_token_expires_at = None
        db.add(user)
        await db.commit()
        return {
            "success": True,
            "status_code": status.HTTP_200_OK,
            "message": "Password Rest Successfull!",
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while resetting the password: {str(e)}",
        )
