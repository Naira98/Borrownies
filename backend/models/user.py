from __future__ import annotations
from datetime import datetime
from decimal import Decimal
from enum import Enum

from db.base import Base
from sqlalchemy import DateTime, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func


class UserStatus(Enum):
    ACTIVATED = "activated"
    DEACTIVATED = "deactivated"
    BLOCKED = "blocked"


class UserRole(Enum):
    MANAGER = "manager"
    CLIENT = "client"
    EMPLOYEE = "employee"
    COURIER = "courier"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    first_name: Mapped[str] = mapped_column(String(25))
    last_name: Mapped[str] = mapped_column(String(25))
    email: Mapped[str] = mapped_column(String(255), index=True, unique=True)
    national_id: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    phone_number: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    password: Mapped[str]
    wallet: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0.0)
    status: Mapped[UserStatus] = mapped_column(default=UserStatus.DEACTIVATED.value)
    role: Mapped[UserRole] = mapped_column(default=UserRole.CLIENT.value)
    interests: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    cart: Mapped[list[Cart]] = relationship(back_populates="user")  # type: ignore  # noqa: F821
    orders: Mapped[list[Order]] = relationship(back_populates="user")  # type: ignore  # noqa: F821
    return_orders: Mapped[list[ReturnOrder]] = relationship(back_populates="user")  # type: ignore  # noqa: F821
    courier_orders: Mapped[list[ReturnOrder]] = relationship(back_populates="courier")  # type: ignore # noqa: F821
    promo_code_accounts: Mapped[list[PromoCodeAccount]] = relationship(  # type: ignore # noqa: F821
        back_populates="user"
    )
    borrow_order_books: Mapped[list[BorrowOrderBook]] = relationship(back_populates="user")  # type: ignore # noqa: F821
    purchase_order_books: Mapped[list[PurchaseOrderBook]] = relationship(back_populates="user")  # type: ignore # noqa: F821

