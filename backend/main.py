from contextlib import asynccontextmanager

from db.base import Base
from db.database import async_engine
from fastapi import FastAPI
from models import book, cart, settings, user  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created/checked.")
    yield


app = FastAPI(title="Borrownies Management API", version="1.0.0", lifespan=lifespan)
