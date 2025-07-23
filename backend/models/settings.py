from db.base import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Numeric

from decimal import Decimal

class Settings (Base):
    __tablename__ = "settings"

    id: Mapped[int] = mapped_column(default=1, primary_key=True,sa_check_constraint='id = 1')
    deposit_perc: Mapped[Decimal] = mapped_column(Numeric(4,2), nullable=False)
    borrow_perc: Mapped[Decimal] = mapped_column(Numeric(4,2), nullable=False)
    delay_perc: Mapped[Decimal] = mapped_column(Numeric(4,2), nullable=False)
    delivery_fees: Mapped[Decimal] = mapped_column(Numeric(4,2), nullable=False)
    max_num_of_borrow_books: Mapped[int]
