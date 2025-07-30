import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Book Nook API"
    version: str = "1.0.0"
    frontend_url: str = "http://localhost:5173"

    # JWT settings
    JWT_SECRET_KEY: str | None = os.getenv("JWT_SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Forget password settings
    FORGET_PWD_SECRET_KEY: str | None = os.getenv("FORGET_PWD_SECRET_KEY")
    FORGET_PWD_TOKEN_EXPIRE_MINUTES: int = 10


settings = Settings()
