from __future__ import annotations

from datetime import datetime
from enum import Enum

from db.base import Base
from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func


class NotificationStatus(Enum):
    read = "read"
    unread = "unread"


class NotificationType(Enum):
    order_status_update = "order_status_update"
    return_order_status_update = "return_order_status_update"
    return_reminder = "return_reminder"
    new_promo_code = "new_promo_code"
    wallet_updated = "wallet_updated"


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    type: Mapped[NotificationType]
    status: Mapped[NotificationStatus] = mapped_column(
        default=NotificationStatus.unread.value
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Foreign Keys
    order_id: Mapped[int | None] = mapped_column(ForeignKey("orders.id"), nullable=True)
    return_order_id: Mapped[int | None] = mapped_column(
        ForeignKey("return_orders.id"), nullable=True
    )
    promo_code_id: Mapped[int | None] = mapped_column(
        ForeignKey("promo_codes.id"), nullable=True
    )

    # Relationships
    user: Mapped[User] = relationship(back_populates="notifications")  # type: ignore # noqa: F821
    order: Mapped[Order | None] = relationship()  # type: ignore # noqa: F821
    return_order: Mapped[ReturnOrder | None] = relationship()  # type: ignore # noqa: F821
    promo_code: Mapped[PromoCode | None] = relationship()  # type: ignore # noqa: F821
