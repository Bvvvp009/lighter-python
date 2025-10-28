import asyncio
import lighter
import logging

from lighter.signer_client import CreateOrderTxReq

logging.basicConfig(level=logging.DEBUG)

# The API_KEY_PRIVATE_KEY provided belongs to a dummy account registered on Testnet.
# It was generated using the setup_system.py script, and serves as an example.
BASE_URL = "https://testnet.zklighter.elliot.ai"
API_KEY_PRIVATE_KEY = "0xed636277f3753b6c0275f7a28c2678a7f3a95655e09deaebec15179b50c5da7f903152e50f594f7b"
ACCOUNT_INDEX = 65
API_KEY_INDEX = 3

async def main():
    client = lighter.SignerClient(
        url=BASE_URL,
        private_key=API_KEY_PRIVATE_KEY,
        account_index=ACCOUNT_INDEX,
        api_key_index=API_KEY_INDEX,
    )

    # Create a One-Cancels-the-Other grouped order with a take-profit and a stop-loss order
    take_profit_order = CreateOrderTxReq(
        MarketIndex=0,
        ClientOrderIndex=0,
        BaseAmount=1000,
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
        BaseAmount=1000,
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

if __name__ == "__main__":
    asyncio.run(main())
