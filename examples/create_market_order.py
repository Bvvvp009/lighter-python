import asyncio
from utils import default_example_setup


async def main():
    client, api_client, _ = default_example_setup()

    tx, tx_hash, err = await client.create_market_order(
        market_index=0,
        client_order_index=0,
        base_amount=1000,  # 0.1 ETH
        avg_execution_price=170000,  # $1700 -- worst acceptable price for the order
        is_ask=True,
    )
    print(f"Create Order {tx=} {tx_hash=} {err=}")
    if err is not None:
        raise Exception(err)

    await client.close()
    await api_client.close()


if __name__ == "__main__":
    asyncio.run(main())
