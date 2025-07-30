import os
import sys

from core.auth import create_access_token, verify_password
from db.database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from models.user import User, UserStatus
from schemas.auth import LoginRequest, LoginResponse, TokenData,RegisterRequest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
# from core.auth import get_password_hash
# from models.user import UserRole

sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), "..")))


auth_router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@auth_router.post("/register")
async def register(user_data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        password=hashed_password,
        status=UserStatus.pending,
        phone_number=user_data.phone_number,
        national_id=user_data.national_id,
        role="client",  # Default role
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Create verification token
    token = create_access_token(TokenData(id=new_user.id, role=new_user.role.value))

    # Send verification email
    await send_verification_email(new_user.email, token)

    return {"message": "Registration successful. Please check your email to verify your account."}
@auth_router.post("/login", response_model=LoginResponse)
async def login(user_login: LoginRequest, db: AsyncSession = Depends(get_db)):
    CREDENTIALS_EXCEPTION = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect email or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # """ GENERATE DUMMY USER DATA FOR TESTING PURPOSE """
    # dummy_user = User(
    #     **{
    #         "first_name": "test",
    #         "last_name": "test",
    #         "email": "test@test.com",
    #         "password": get_password_hash("test"),
    #         "status": UserStatus.activated,
    #         "role": UserRole.client,
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
        raise CREDENTIALS_EXCEPTION

    if user.status.value != UserStatus.activated.value:
        raise HTTPException(status_code=400, detail="User is not activated")

    access_token = create_access_token(TokenData(id=user.id, role=user.role.value))

    return LoginResponse(access_token=access_token, user=user)


# @auth_router.post('/logout'):
#     async def logout():
#         return {"message": "Logout endpoint"}
