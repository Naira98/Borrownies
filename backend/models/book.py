from __future__ import annotations
from decimal import Decimal
from enum import Enum

from db.base import Base
from sqlalchemy import ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


class BookStatus(Enum):
    BORROW = "borrow"
    PURCHASE = "purchase"


class Author(Base):
    __tablename__ = "authors"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50))
    books: Mapped[list[Book]] = relationship(back_populates="author")


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(25))
    books: Mapped[list[Book]] = relationship(back_populates="category")


class Book(Base):
    __tablename__ = "books"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    price: Mapped[Decimal] = mapped_column(Numeric(4, 2))
    description: Mapped[str] = mapped_column(String(1000), nullable=True)
    cover_img: Mapped[str] = mapped_column(String, nullable=True)

    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    author_id: Mapped[int] = mapped_column(ForeignKey("authors.id"))

    category: Mapped[Category] = relationship(back_populates="books")
    author: Mapped[Author] = relationship(back_populates="books")
    book_details: Mapped[list[BookDetails]] = relationship(back_populates="book")


class BookDetails(Base):
    __tablename__ = "book_details"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    available_stock: Mapped[int] = mapped_column(Integer)
    status: Mapped[BookStatus]

    book_id: Mapped[int] = mapped_column(ForeignKey("books.id"), index=True)

    book: Mapped[Book] = relationship(back_populates="book_details")
    cart_items: Mapped[list["Cart"]] = relationship(back_populates="book_details")  # type: ignore  # noqa: F821
