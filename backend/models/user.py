from db.base import Base
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy import String, Numeric, DateTime
from sqlalchemy.sql import func
from enum import Enum
from decimal import Decimal
from datetime import datetime


class UserStatus(Enum):
    ACTIVATED = "activated"
    DEACTIVATED = "deactivated"
    BLOCKED = "blocked"

class UserRole(Enum) :
    MANAGER = "manager"
    CLIENT = "client"
    EMPLOYEE = "employee"
    COURIER = "courier"

class User(Base) : 
    __tablename__ = "users"
    
    id : Mapped[int] = mapped_column(primary_key=True,index=True)
    first_name : Mapped[str] = mapped_column(String(25), nullable=False)
    last_name : Mapped[str] = mapped_column(String(25), nullable=False)
    email : Mapped[str] = mapped_column(String(255), nullable=False, index=True, unique=True)
    national_id: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    phone_number: Mapped[str] = mapped_column(String(20), nullable=False, unique=True, index=True)
    password: Mapped[str] 
    wallet:Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0.0)
    status: Mapped[UserStatus] = mapped_column(default=UserStatus.ACTIVATED.value)
    role: Mapped[UserRole] = mapped_column(default=UserRole.CLIENT.value)
    interests: Mapped[str] = mapped_column(String(255), nullable=True)
    created_date: Mapped[datetime] = mapped_column(default=DateTime(timezone=True),server_default=func.now())
    
    cart: Mapped[list["Cart"]] = relationship(back_populates="user") # type: ignore




