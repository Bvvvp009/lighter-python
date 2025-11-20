import asyncio
import lighter
from utils import default_example_setup


async def main():
    client, api_client, _ = default_example_setup()

    # create order
    tx, tx_hash, err = await client.create_order(
        market_index=0,
        client_order_index=123,
        base_amount=1000,  # 0.1 ETH
        price=405000,  # $4050
        is_ask=True,
        order_type=lighter.SignerClient.ORDER_TYPE_LIMIT,
        time_in_force=lighter.SignerClient.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
        reduce_only=False,
        trigger_price=0,
    )
    print(f"Create Order {tx=} {tx_hash=} {err=}")
    if err is not None:
        raise Exception(err)

    # create order
    tx, tx_hash, err = await client.modify_order(
        market_index=0,
        order_index=123,
        base_amount=1100,  # 0.11 ETH
        price=410000,  # $4100
        trigger_price=0,
    )
    print(f"Modify Order {tx=} {tx_hash=} {err=}")
    if err is not None:
        raise Exception(err)

    # cancel order
    tx, tx_hash, err = await client.cancel_order(
        market_index=0,
        order_index=123,
    )
    print(f"Cancel Order {tx=} {tx_hash=} {err=}")
    if err is not None:
        raise Exception(err)

    await client.close()
    await api_client.close()


if __name__ == "__main__":
    asyncio.run(main())
