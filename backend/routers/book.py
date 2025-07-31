from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import get_db
from crud import book as book_crud
from schemas.book import BookResponse, BookStatus

router = APIRouter(prefix="/books", tags=["Books"])


@router.get("/search/", response_model=list[BookResponse])
async def search_books(
    title: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db),
):
    return await book_crud.search_books_by_title(db, title)


@router.get("/status/{status}", response_model=list[BookResponse])
async def get_books_by_status(status: BookStatus, db: AsyncSession = Depends(get_db)):
    return await book_crud.get_books_by_status(db, status.value)
