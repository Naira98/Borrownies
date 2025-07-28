from __future__ import annotations
from datetime import datetime
from decimal import Decimal
from enum import Enum

from db.base import Base
from sqlalchemy import DateTime, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func


class BorrowBookProblem(Enum):
    NORMAL = "normal"
    LOST = "lost"
    DAMAGED = "damaged"


class PickUpType(Enum):
    SITE = "site"
    COURIER = "courier"


class OrderStatus(Enum):
    CREATED = "created"
    ON_THE_WAY = "on_the_way"
    PICKED_UP = "picked_up"
    PROBLEM = "problem"


class ReturnOrderStatus(Enum):
    CREATED = "created"
    ON_THE_WAY = "on_the_way"
    PICKED_UP = "picked_up"
    CHECKING = "checking"
    PROBLEM = "problem"


class BorrowOrderBook(Base):
    __tablename__ = "borrow_order_books"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    borrowing_days: Mapped[int]
    return_date: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    # price: Mapped[Decimal] = mapped_column(Numeric(4, 2))
    borrow_book_problem: Mapped[BorrowBookProblem] = mapped_column(
        default=BorrowBookProblem.NORMAL.value
    )
    deposit_fees: Mapped[Decimal] = mapped_column(Numeric(5, 2))
    borrow_fees: Mapped[Decimal] = mapped_column(Numeric(5, 2))
    delay_fees_per_day: Mapped[Decimal] = mapped_column(Numeric(5, 2))

    book_details_id: Mapped[int] = mapped_column(ForeignKey("book_details.id"))
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    return_order_id: Mapped[int | None] = mapped_column(
        ForeignKey("return_orders.id"), nullable=True
    )
    promo_code_id: Mapped[int | None] = mapped_column(
        ForeignKey("promo_codes.id"), nullable=True
    )

    book_details: Mapped[BookDetails] = relationship(  # type: ignore # noqa: F821
        back_populates="borrow_order_books_details"
    )
    order: Mapped[Order] = relationship(back_populates="borrow_order_books_details")
    return_order: Mapped[ReturnOrder] = relationship(
        back_populates="borrow_order_books_details"
    )
    promo_code: Mapped[PromoCode | None] = relationship(back_populates="orders_books")  # type: ignore # noqa: F821


class PurchaseOrderBook(Base):
    __tablename__ = "purchase_order_books"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    quantity: Mapped[int] = mapped_column(default=1)
    price: Mapped[Decimal] = mapped_column(Numeric(4, 2))

    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    book_details_id: Mapped[int] = mapped_column(ForeignKey("book_details.id"))

    book_details: Mapped[BookDetails] = relationship(  # type: ignore # noqa: F821
        back_populates="purchase_order_books_details"
    )
    order: Mapped[Order] = relationship(back_populates="purchase_order_books_details")


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    pick_up_date: Mapped[datetime | None] = mapped_column(default=None, nullable=True)
    pick_up_type: Mapped[PickUpType]
    status: Mapped[OrderStatus] = mapped_column(default=OrderStatus.CREATED.value)

    user: Mapped[User] = relationship(back_populates="orders")  # type: ignore  # noqa: F821
    borrow_order_books_details: Mapped[list[BorrowOrderBook]] = relationship(
        back_populates="order"
    )
    purchase_order_books_details: Mapped[list[PurchaseOrderBook]] = relationship(
        back_populates="order"
    )


class ReturnOrder(Base):
    __tablename__ = "return_orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    pick_up_type: Mapped[PickUpType]
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    courier_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    status: Mapped[ReturnOrderStatus] = mapped_column(
        default=ReturnOrderStatus.CREATED.value
    )

    user: Mapped[User] = relationship(back_populates="return_orders")  # type: ignore  # noqa: F821
    courier: Mapped[User] = relationship(back_populates="courier_orders")  # type: ignore  # noqa: F821
    borrow_order_books_details: Mapped[list[BorrowOrderBook]] = relationship(
        back_populates="return_order"
    )
    purchase_order_books_details: Mapped[list[PurchaseOrderBook]] = relationship(
        back_populates="return_order"
    )
