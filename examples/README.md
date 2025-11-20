## Setup steps for testnet
- Go to https://testnet.app.lighter.xyz/ and connect a wallet to receive $500
- run `system_setup.py` with the correct ETH Private key configured
  - set an API key index which is not 0, so you won't override the one used by [app.lighter.xyz](https://app.lighter.xyz/)
  - this will require you to enter your Ethereum private key
  - the eth private key will only be used in the Py SDK to sign a message
  - the eth private key is not required in order to trade on the platform
  - the eth private key is not passed to the binary 
  - the API key config is saved in a local file `./api_key_config.json`

## Start trading on testnet
- `create_modify_cancel_order.py`
  - creates an ask (sell) order for 0.1 ETH @ $4050
  - modified the order and increases the size to 0.11 ETH and increases the price to $4100
  - cancels the order
  - Note: all of these operations use the client order index of the order. You can use the order from the exchange as well
  
- `ws_send_tx.py`
  - same flow as `create_modify_cancel_order.py`
  - sends TXs over WS instead of HTTP

- `create_grouped_ioc_with_attached_sl_tp.py`
  - creates an ask (sell) IoC order for 0.1 ETH
  - along w/ the order, it sets up a Stop Loss (SL) and a Take Profit (TP) order for the whole size of the order
  - the size of the SL/TP will be equal to the executed size of the order
  - the SL/TP orders are canceled when the sign of your position changes

- `create_position_tied_sl_tl.py`
  - creates a bid (buy) Stop Loss (SL) and a Take Profit (TP) to close your short position
  - the size of the orders will be for your whole position (because BaseAmount=0)
  - the orders will grow / shrink as you accumulate more position
  - the SL/TP orders are canceled when the sign of your position changes

### On SL/TP orders
SL/TP orders need to be configured beyond just setting the trigger price. When the trigger price is set, 
the order will just be executed, like a normal order. This means that a market order, for example, might not have enough slippage! \
Let's say that you have a 1 BTC long position, and the current price is $110'000. \
You want to set up a take profit at $120'000
- order should be an ask (sell) order, to close your position
- the trigger price should be $120'000

What about the order types? Just as normal orders, SL/TP orders trigger an order, which can be:
- market order
- limit IOC / GTC

## Setup steps for mainnet
- deposit money on Lighter to create an account first
- change the URL to `mainnet.zklighter.elliot.ai`
- repeat setup step