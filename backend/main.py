from fastapi import FastAPI
from db.database import async_engine
from db.base import Base
from contextlib import asynccontextmanager
# Import your models here to ensure they are registered with SQLAlchemy's metadata
from models import book, cart, settings, user


@asynccontextmanager
async def lifespan(app: FastAPI):
    # on startup
    async with async_engine.begin() as conn:
        # This will create tables if they don't exist.
        # For production, use Alembic for migrations.
        print("😂😂", conn)

        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created/checked.")
    yield
    # on shutdown (if you have any cleanup)


app = FastAPI(
    title="Borrownies Management API", version="1.0.0", lifespan=lifespan
)
