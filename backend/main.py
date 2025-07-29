from contextlib import asynccontextmanager

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from routers.auth import auth_router

FRONT_URL = "http://localhost:5173"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Logic here will run before the application starts receiving requests.
    print("Application startup...")
    yield
    # Logic here will run after the application finishes handling requests.
    print("Application shutdown.")


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
