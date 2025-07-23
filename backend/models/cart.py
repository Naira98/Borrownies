from db.base import Base
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy import Integer, ForeignKey

class Cart (Base):
    __tablename__ = "carts"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    book_details_id: Mapped[int] = mapped_column(ForeignKey("book_details.id"), primary_key=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1)

    user: Mapped["User"] = relationship(back_populates="cart") # type: ignore
    book_details: Mapped["BookDetails"] = relationship(back_populates="cart_items") # type: ignore