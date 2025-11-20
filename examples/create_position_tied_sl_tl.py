import asyncio
import lighter

from lighter.signer_client import CreateOrderTxReq
from utils import default_example_setup


async def main():
    client, api_client, _ = default_example_setup()

    # Create a One-Cancels-the-Other grouped order with a take-profit and a stop-loss order
    take_profit_order = CreateOrderTxReq(
        MarketIndex=0,
        ClientOrderIndex=0,
        BaseAmount=0,
        Price=300000,
        IsAsk=0,
        Type=lighter.SignerClient.ORDER_TYPE_TAKE_PROFIT_LIMIT,
        TimeInForce=lighter.SignerClient.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
        ReduceOnly=1,
        TriggerPrice=300000,
        OrderExpiry=-1,
    )

    stop_loss_order = CreateOrderTxReq(
        MarketIndex=0,
        ClientOrderIndex=0,
        BaseAmount=0,
        Price=500000,
        IsAsk=0,
        Type=lighter.SignerClient.ORDER_TYPE_STOP_LOSS_LIMIT,
        TimeInForce=lighter.SignerClient.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
        ReduceOnly=1,
        TriggerPrice=500000,
        OrderExpiry=-1,
    )

    transaction = await client.create_grouped_orders(
        grouping_type=lighter.SignerClient.GROUPING_TYPE_ONE_CANCELS_THE_OTHER,
        orders=[take_profit_order, stop_loss_order],
    )

    print("Create Grouped Order Tx:", transaction)
    await client.close()
    await api_client.close()

if __name__ == "__main__":
    asyncio.run(main())
