import json
from pathlib import Path

from models.order import BorrowOrderBook
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

current_dir = Path(__file__).resolve().parent


async def add_dummy_borrow_orders(db: AsyncSession):
    print("Seeding borrow_orders...")
    borrow_orders_file = current_dir / "borrow_orders.json"
    with open(borrow_orders_file, "r") as file:
        dummy_borrow_orders_data = json.load(file)

    borrow_orders_to_add = []
    for borrow_order_to_add in dummy_borrow_orders_data:
        # return_date expects a datetime object, convert from ISO format to Python datetime
        if isinstance(borrow_order_to_add["return_date"], str):
            borrow_order_to_add["return_date"] = datetime.strptime(
                borrow_order_to_add["return_date"], "%Y-%m-%dT%H:%M:%SZ"
            )
        borrow_orders_to_add.append(BorrowOrderBook(**borrow_order_to_add))
        print(
            f"  - Preparing to add borrow Order for user id: {borrow_order_to_add['user_id']}"
        )

    db.add_all(borrow_orders_to_add)
    print(f"  - Adding {len(borrow_orders_to_add)} new borrow_orders to the session.")
