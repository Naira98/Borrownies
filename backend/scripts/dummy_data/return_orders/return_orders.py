import json
from pathlib import Path

from models.order import ReturnOrder
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

current_dir = Path(__file__).resolve().parent


async def add_dummy_return_orders(db: AsyncSession):
    print("Seeding return_orders...")
    return_orders_file = current_dir / "return_orders.json"
    with open(return_orders_file, "r") as file:
        dummy_return_orders_data = json.load(file)

    return_orders_to_add = []
    for return_order in dummy_return_orders_data:
        result = await db.execute(
            select(ReturnOrder).where(ReturnOrder.id == return_order["id"])
        )

        if not result.scalars().first():
            return_orders_to_add.append(ReturnOrder(**return_order))
            print(
                f"  - Preparing to add return order for user id : {return_order['user_id']}"
            )
        else:
            print(
                f"  - Purchase Order for user id: {return_order['user_id']} already exists, skipping."
            )

    if return_orders_to_add:
        db.add_all(return_orders_to_add)
        print(
            f"  - Adding {len(return_orders_to_add)} new return_orders to the session."
        )
    else:
        print("  - No new return_orders to add.")
