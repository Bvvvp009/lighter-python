import asyncio
import lighter
from utils import default_example_setup

TO_ACCOUNT_INDEX = 9
ETH_PRIVATE_KEY = "0x..."


async def main():
    client, api_client, _ = default_example_setup()
    info_api = lighter.InfoApi(api_client)

    auth_token, _ = client.create_auth_token_with_expiry()
    fee_info = await info_api.transfer_fee_info(client.account_index, authorization=auth_token, auth=auth_token, to_account_index=TO_ACCOUNT_INDEX)
    print(fee_info)

    err = client.check_client()
    if err is not None:
        print(f"CheckClient error: {err}")
        return

    memo = "a"*32  # memo is a user message, and it has to be exactly 32 bytes long
    transfer_tx, response, err = await client.transfer(
        ETH_PRIVATE_KEY,
        usdc_amount=100,  # decimals are added by sdk
        to_account_index=TO_ACCOUNT_INDEX,
        fee=fee_info.transfer_fee_usdc,
        memo=memo,
    )
    if err is not None:
       raise Exception(f"error transferring {err}")
    print(transfer_tx, response)

    lev_tx, response, err = await client.update_leverage(4, client.CROSS_MARGIN_MODE, 3)
    print(lev_tx, response, err)

if __name__ == "__main__":
    asyncio.run(main())