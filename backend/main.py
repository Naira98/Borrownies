from contextlib import asynccontextmanager

from db.base import Base
from db.database import async_engine
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from models import book, cart, notification, order, settings, user  # noqa: F401
from routers.auth import auth_router

FRONT_URL = "http://localhost:5173"


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created/checked.")
    yield


app = FastAPI(title="Book Nook API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONT_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router)


app.include_router(api_router)
