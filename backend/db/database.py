from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://fastapi:123456@localhost:5432/fastdb" # Using aiosqlite for async SQLite

async_engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=True,  # Set to False in production
    pool_size=10, # Number of connections to keep open
    max_overflow=20 # Max connections allowed above pool_size
)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False, # Don't expire objects after commit
)

async def get_db():
    """
    Dependency function that provides an asynchronous database session.
    It ensures the session is closed after the request.
    """
    async with AsyncSessionLocal() as session:
        yield session

        