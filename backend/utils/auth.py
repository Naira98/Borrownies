from models.user import User
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


async def get_user_by_email(email: str, db: AsyncSession):
    """
    Helper function to get user from email.
    """
    result = await db.execute(select(User).where(User.email == email))
    return result.scalars().first()

