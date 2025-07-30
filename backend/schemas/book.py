from decimal import Decimal
from pydantic import BaseModel, ConfigDict
from models.book import BookStatus


# Author response schema
class AuthorSchema(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


# Category response schema
class CategorySchema(BaseModel):
    id: int
    name: str
    model_config = ConfigDict(from_attributes=True)


# Book response schema with nested author, category, and status only
class BookResponse(BaseModel):
    id: int
    title: str
    price: Decimal
    description: str | None
    cover_img: str | None
    author: AuthorSchema
    category: CategorySchema
    status: BookStatus | None  # Status can be 'borrow', 'purchase', or None

    model_config = ConfigDict(from_attributes=True)
