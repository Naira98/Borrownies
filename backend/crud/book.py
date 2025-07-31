from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload, contains_eager

from models.book import Book, BookDetails, BookStatus


# Fetch books by partial match in title (case-insensitive)
async def search_books_by_title(db: AsyncSession, title: str):
    stmt = (
        select(Book)
        .where(Book.title.ilike(f"%{title}%"))
        .options(
            selectinload(Book.author),
            selectinload(Book.category),
            selectinload(Book.book_details),
        )
    )
    result = await db.execute(stmt)
    books = result.scalars().all()  # to avoid redundant columns data
    return books


# Fetch books based on their status in BookDetails (e.g., 'borrow', 'purchase').
async def get_books_by_status(db: AsyncSession, status: BookStatus):
    stmt = (
        select(Book)
        .join(Book.book_details)
        .where(BookDetails.status == status)
        .options(
            selectinload(Book.author),
            selectinload(Book.category),
            contains_eager(Book.book_details),  # Only load the filtered book_details
        )
    )
    result = await db.execute(stmt)
    books = result.unique().scalars().all()
    return books
