# Lighter TypeScript SDK

A comprehensive TypeScript SDK for the Lighter perpetual trading platform, providing full access to all API endpoints and transaction functionality.

## Features

- **Complete API Coverage**: All endpoints from the Python SDK implemented
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Transaction Building**: Create and sign all transaction types
- **WebSocket Support**: Real-time data streaming
- **Authentication**: Support for API keys and private key signing
- **Error Handling**: Comprehensive error handling and validation

## Installation

```bash
npm install lighter-ts
```

## Quick Start

### Basic Setup

```typescript
import { LighterClient } from 'lighter-ts';

// Initialize client with private key
const client = new LighterClient({
  baseUrl: 'https://api.lighter.xyz',
  lighterChainId: 1,
  privateKey: new Uint8Array([/* your private key */]),
});

// Or with a custom signer
const client = new LighterClient({
  baseUrl: 'https://api.lighter.xyz',
  lighterChainId: 1,
  signer: yourCustomSigner,
});
```

### Account Operations

```typescript
// Get account information
const account = await client.account.getAccount('index', '123');

// Get account limits
const limits = await client.account.getAccountLimits(123, 'your-auth-token');

// Get API keys
const apiKeys = await client.account.getApiKeys(123);

// Get liquidations
const liquidations = await client.account.getLiquidations(123, 10, 'your-auth-token');

// Get PnL
const pnl = await client.account.getPnL('index', '123', '1h', 1640995200, 1641081600, 24, 'your-auth-token');
```

### Order Operations

```typescript
// Get orders
const orders = await client.order.getOrders(123, 10, 'your-auth-token');

// Get order books
const orderBooks = await client.order.getOrderBooks([1, 2, 3], 10);

// Get recent trades
const trades = await client.order.getRecentTrades(1, 10);

// Get markets
const markets = await client.order.getMarkets();

// Get tickers
const tickers = await client.order.getTickers([1, 2, 3]);
```

### Transaction Operations

```typescript
// Get transactions
const transactions = await client.transaction.getTransactions(123, 10, 'your-auth-token');

// Get blocks
const blocks = await client.block.getBlocks(10);

// Get current height
const height = await client.transaction.getCurrentHeight();

// Get deposit history
const deposits = await client.transaction.getDepositHistory(123, 10, 'your-auth-token');
```

### Creating Transactions

```typescript
// Create a limit order
const orderTx = await client.createLimitOrder(
  1, // marketIndex
  1, // clientOrderIndex
  1000, // baseAmount
  50000, // price
  false, // isAsk (false = buy)
  { fromAccountIndex: 123 }
);

// Send the transaction
const txHash = await client.sendTransaction(orderTx);

// Create a market order
const marketOrderTx = await client.createMarketOrder(
  1, // marketIndex
  2, // clientOrderIndex
  1000, // baseAmount
  true, // isAsk (true = sell)
  { fromAccountIndex: 123 }
);

// Transfer USDC
const transferTx = await client.transferUSDC(
  456, // toAccountIndex
  1000, // usdcAmount
  { fromAccountIndex: 123 }
);

// Withdraw USDC
const withdrawTx = await client.withdrawUSDC(
  1000, // usdcAmount
  { fromAccountIndex: 123 }
);
```

### WebSocket Real-time Data

```typescript
import { WebSocketClient } from 'lighter-ts';

const ws = new WebSocketClient({
  url: 'wss://ws.lighter.xyz',
});

await ws.connect();

// Subscribe to order book updates
ws.subscribeOrderBook(1, (message) => {
  console.log('Order book update:', message.data);
});

// Subscribe to trade updates
ws.subscribeTrades(1, (message) => {
  console.log('Trade update:', message.data);
});

// Subscribe to account updates
ws.subscribeAccount(123, (message) => {
  console.log('Account update:', message.data);
});

// Subscribe to order updates
ws.subscribeOrders(123, (message) => {
  console.log('Order update:', message.data);
});

// Subscribe to transaction updates
ws.subscribeTransactions(123, (message) => {
  console.log('Transaction update:', message.data);
});
```

## API Reference

### LighterClient

The main client class that provides access to all functionality.

#### Constructor

```typescript
new LighterClient(config: LighterClientConfig)
```

#### Configuration

```typescript
interface LighterClientConfig {
  baseUrl: string;
  lighterChainId: number;
  signer?: Signer;
  privateKey?: Uint8Array;
  channelName?: string;
  fatFingerProtection?: boolean;
  timeout?: number;
}
```

#### Properties

- `account`: AccountApi - Account-related operations
- `order`: OrderApi - Order-related operations
- `transaction`: TransactionApi - Transaction-related operations
- `candlestick`: CandlestickApi - Candlestick data
- `funding`: FundingApi - Funding-related operations
- `bridge`: BridgeApi - Bridge operations
- `announcement`: AnnouncementApi - Announcements
- `notification`: NotificationApi - Notifications
- `referral`: ReferralApi - Referral operations
- `root`: RootApi - Root operations
- `block`: BlockApi - Block operations

### API Classes

Each API class provides methods for specific functionality:

#### AccountApi

- `getAccount(by: string, value: string)`
- `getAccountLimits(accountIndex: number, authorization?: string, auth?: string)`
- `getAccountMetadata(by: string, value: string, authorization?: string, auth?: string)`
- `getAccountsByL1Address(l1Address: string)`
- `getApiKeys(accountIndex: number, apiKeyIndex?: number)`
- `getL1Metadata(l1Address: string, authorization?: string, auth?: string)`
- `getLiquidations(accountIndex: number, limit: number, authorization?: string, auth?: string, marketId?: number, cursor?: string)`
- `getPnL(by: string, value: string, resolution: string, startTimestamp: number, endTimestamp: number, countBack: number, authorization?: string, auth?: string, ignoreTransfers?: boolean)`
- `getPositionFunding(accountIndex: number, limit: number, authorization?: string, auth?: string, marketId?: number, cursor?: string, side?: string)`
- `getPublicPools(index: number, limit: number, authorization?: string, auth?: string, filter?: string, accountIndex?: number)`

#### OrderApi

- `getOrders(accountIndex: number, limit: number, authorization?: string, auth?: string, marketIndex?: number, cursor?: string, status?: number)`
- `getOrderBooks(marketIndices: number[], depth?: number)`
- `getOrderBookDetails(marketIndices: number[], depth?: number)`
- `getTrades(accountIndex: number, limit: number, authorization?: string, auth?: string, marketIndex?: number, cursor?: string)`
- `getRecentTrades(marketIndex: number, limit: number)`
- `getMarkets()`
- `getTickers(marketIndices?: number[])`
- `getExchangeStats()`

#### TransactionApi

- `getTransactions(accountIndex: number, limit: number, authorization?: string, auth?: string, cursor?: string, txType?: number)`
- `getEnrichedTransactions(accountIndex: number, limit: number, authorization?: string, auth?: string, cursor?: string, txType?: number)`
- `getTransaction(hash: string)`
- `getL1Transaction(hash: string, authorization?: string, auth?: string)`
- `getPendingTransactions(accountIndex: number, limit: number, authorization?: string, auth?: string, cursor?: string)`
- `getBlocks(limit: number, cursor?: string)`
- `getBlock(blockNumber: number)`
- `getBlockTransactions(blockNumber: number, limit: number, cursor?: string)`
- `getCurrentHeight()`
- `getValidators()`
- `getZkLighterInfo()`
- `getStatus()`
- `getRiskInfo(marketIndex: number, authorization?: string, auth?: string)`
- `getDepositHistory(accountIndex: number, limit: number, authorization?: string, auth?: string, cursor?: string)`
- `getWithdrawHistory(accountIndex: number, limit: number, authorization?: string, auth?: string, cursor?: string)`
- `getLatestDeposit(l1Address: string, authorization?: string, auth?: string)`
- `getFastWithdrawInfo(authorization?: string, auth?: string)`
- `getFastBridgeInfo()`

### Transaction Building

The SDK provides convenience methods for creating common transactions:

- `createLimitOrder(marketIndex: number, clientOrderIndex: number, baseAmount: number, price: number, isAsk: boolean, opts: TransactOpts)`
- `createMarketOrder(marketIndex: number, clientOrderIndex: number, baseAmount: number, isAsk: boolean, opts: TransactOpts)`
- `transferUSDC(toAccountIndex: number, usdcAmount: number, opts: TransactOpts)`
- `withdrawUSDC(usdcAmount: number, opts: TransactOpts)`

### WebSocketClient

Real-time data streaming client.

#### Constructor

```typescript
new WebSocketClient(config: WebSocketConfig)
```

#### Configuration

```typescript
interface WebSocketConfig {
  url: string;
  pingInterval?: number;
  pongTimeout?: number;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}
```

#### Methods

- `connect()`: Connect to WebSocket server
- `disconnect()`: Disconnect from server
- `subscribe(messageType: string, handler: WebSocketMessageHandler)`: Subscribe to message type
- `unsubscribe(messageType: string, handler: WebSocketMessageHandler)`: Unsubscribe from message type
- `send(message: WebSocketMessage)`: Send message
- `subscribeOrderBook(marketIndex: number, handler: WebSocketMessageHandler)`: Subscribe to order book updates
- `subscribeTrades(marketIndex: number, handler: WebSocketMessageHandler)`: Subscribe to trade updates
- `subscribeTicker(marketIndex: number, handler: WebSocketMessageHandler)`: Subscribe to ticker updates
- `subscribeAccount(accountIndex: number, handler: WebSocketMessageHandler)`: Subscribe to account updates
- `subscribeOrders(accountIndex: number, handler: WebSocketMessageHandler)`: Subscribe to order updates
- `subscribeTransactions(accountIndex: number, handler: WebSocketMessageHandler)`: Subscribe to transaction updates
- `unsubscribeChannel(channel: string, marketIndex?: number, accountIndex?: number)`: Unsubscribe from channel

## Error Handling

The SDK provides comprehensive error handling:

```typescript
try {
  const account = await client.account.getAccount('index', '123');
} catch (error) {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
  }
}
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Support

For support and questions, please open an issue on GitHub or contact the Lighter team.