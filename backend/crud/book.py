from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from models.book import (
    Book,
    BookDetails,
    BookStatus,
)


# Inject status field into each Book from its related BookDetails
def inject_status(books: list[Book]):
    for book in books:
        book.status = book.book_details[0].status.value if book.book_details else None
    return books


# Get all books with their author, category, and status
async def get_all_books(db: AsyncSession):
    result = await db.execute(
        select(Book).options(
            selectinload(Book.author),
            selectinload(Book.category),
            selectinload(Book.book_details),
        )
    )
    books = result.scalars().all()
    return inject_status(books)


# Search books by title with author, category, and status
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
    books = result.scalars().all()
    return inject_status(books)


async def get_books_by_status(db: AsyncSession, status: str):
    try:
        status_enum = BookStatus(status)
    except ValueError:
        return []

    stmt = (
        select(Book)
        .join(Book.book_details)
        .where(BookDetails.status == status_enum)
        .options(
            selectinload(Book.author),
            selectinload(Book.category),
            selectinload(Book.book_details),
        )
        .distinct()
    )
    result = await db.execute(stmt)
    books = result.scalars().all()
    return inject_status(books)


# Get books filtered by status (borrow or purchase)
# async def get_books_by_status(db: AsyncSession, status: str):
#     stmt = (
#         select(Book)
#         .join(Book.book_details)
#         .where(BookDetails.status == status)
#         .options(
#             selectinload(Book.author),
#             selectinload(Book.category),
#             selectinload(Book.book_details),
#         )
#         .distinct()
#     )
#     result = await db.execute(stmt)
#     books = result.scalars().all()
#     return inject_status(books)
