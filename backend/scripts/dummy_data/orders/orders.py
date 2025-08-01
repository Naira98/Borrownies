import json
from pathlib import Path

from models.order import Order
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

current_dir = Path(__file__).resolve().parent


async def add_dummy_orders(db: AsyncSession):
    print("Seeding orders...")
    orders_file = current_dir / "orders.json"
    with open(orders_file, "r") as file:
        dummy_orders_data = json.load(file)

    orders_to_add = []
    for order_to_add in dummy_orders_data:
        # pick_up_date expects a datetime object, convert from ISO format to Python datetime
        if isinstance(order_to_add["pick_up_date"], str):
            order_to_add["pick_up_date"] = datetime.strptime(
                order_to_add["pick_up_date"], "%Y-%m-%dT%H:%M:%SZ"
            )
        orders_to_add.append(Order(**order_to_add))
        print(f"  - Preparing to add Order for user id: {order_to_add['user_id']}")

    db.add_all(orders_to_add)
    print(f"  - Adding {len(orders_to_add)} new orders to the session.")
