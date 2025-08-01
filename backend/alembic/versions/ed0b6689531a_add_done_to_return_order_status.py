"""add done to return order status

Revision ID: ed0b6689531a
Revises: be36dda170eb
Create Date: 2025-08-02 17:35:24.213129

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ed0b6689531a'
down_revision: Union[str, Sequence[str], None] = 'be36dda170eb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    # Step 1: Alter the database enum type to add the new value.
    op.execute("ALTER TYPE returnorderstatus ADD VALUE 'DONE'")

    # Step 2: Update the column definition in the SQLAlchemy model.
    # This is often autogenerated but is included for clarity.
    op.alter_column(
        "return_orders",  # Replace with the actual table name
        "status",
        existing_type=sa.Enum(
            "CREATED",
            "ON_THE_WAY",
            "PICKED_UP",
            "CHECKING",
            "PROBLEM",
            name="returnorderstatus",
        ),
        type_=sa.Enum(
            "CREATED",
            "ON_THE_WAY",
            "PICKED_UP",
            "CHECKING",
            "PROBLEM",
            "DONE",
            name="returnorderstatus",
        ),
        existing_nullable=False,
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    # Step 1 (for downgrade): It's important to remove any data that uses the new status
    # before you can drop the value from the enum type.
    # This is a critical step to avoid errors.
    op.execute("DELETE FROM return_orders WHERE status = 'DONE'")

    # Step 2 (for downgrade): Dropping an enum value is not directly supported
    # by all database backends (e.g., PostgreSQL). You often need to
    # recreate the type without the value. This is a complex operation.
    # A safer approach is to simply leave the value in place if possible
    # and only handle the upgrade. The code below is a simplified example
    # of what you might need to do, but it is database-specific.
    op.alter_column(
        "return_orders",
        "status",
        existing_type=sa.Enum(
            "CREATED",
            "ON_THE_WAY",
            "PICKED_UP",
            "CHECKING",
            "PROBLEM",
            "DONE",
            name="returnorderstatus",
        ),
        type_=sa.Enum(
            "CREATED",
            "ON_THE_WAY",
            "PICKED_UP",
            "CHECKING",
            "PROBLEM",
            name="returnorderstatus",
        ),
        existing_nullable=False,
    )
    # ### end Alembic commands ###
