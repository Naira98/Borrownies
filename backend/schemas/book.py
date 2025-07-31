from decimal import Decimal
from pydantic import BaseModel, ConfigDict
from models.book import BookStatus


# Book base schema
class Book(BaseModel):
    id: int
    title: str
    price: Decimal
    description: str
    cover_img: str | None

    model_config = ConfigDict(from_attributes=True)


class AuthorSchema(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class CategorySchema(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class BookDetailsSchema(BaseModel):
    status: BookStatus
    available_stock: int

    model_config = ConfigDict(from_attributes=True)


class BookResponse(Book):
    author: AuthorSchema
    category: CategorySchema
    book_details: list[
        BookDetailsSchema  # Changed to list because a book can have multiple details(borrowed, purchased)
    ]

    model_config = ConfigDict(from_attributes=True)
