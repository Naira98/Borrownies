from fastapi import FastAPI
from db.base import Base
from db.database import async_engine


app = FastAPI(title="Warehouse Management API", version="1.0.0")


@app.on_event("startup")
async def on_startup():
    async with async_engine.begin() as conn:
        # This will create tables if they don't exist.
        # For production, use Alembic for migrations.
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created/checked.")


