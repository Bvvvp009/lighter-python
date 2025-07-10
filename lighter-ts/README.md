# Lighter TypeScript SDK

TypeScript SDK for Lighter - A modern, type-safe client for the Lighter API.

## Features

- 🔒 **Type Safety**: Full TypeScript support with comprehensive type definitions
- 🚀 **Modern**: Built with modern JavaScript/TypeScript features
- 🔄 **Async/Await**: Promise-based API with async/await support
- 📡 **WebSocket Support**: Real-time data streaming capabilities
- 🛡️ **Error Handling**: Comprehensive error handling with custom exception classes
- 📦 **Modular**: Clean, modular architecture with separate API classes
- 🧪 **Tested**: Comprehensive test suite with Jest

## Requirements

- Node.js 16.0+
- TypeScript 5.0+

## Installation

```bash
npm install lighter-ts
```

## Quick Start

```typescript
import { ApiClient, AccountApi, OrderApi } from 'lighter-ts';

async function main() {
  // Create API client
  const client = new ApiClient({
    host: 'https://testnet.zklighter.elliot.ai',
    apiKey: 'your-api-key',
    secretKey: 'your-secret-key',
  });

  // Initialize API instances
  const accountApi = new AccountApi(client);
  const orderApi = new OrderApi(client);

  try {
    // Get account information
    const account = await accountApi.getAccount({
      by: 'index',
      value: '1',
    });
    console.log('Account:', account);

    // Get order book
    const orderBook = await orderApi.getOrderBookDetails({
      market_id: 0,
      depth: 10,
    });
    console.log('Order Book:', orderBook);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

main();
```

## API Examples

### Account Operations

```typescript
import { ApiClient, AccountApi } from 'lighter-ts';

const client = new ApiClient();
const accountApi = new AccountApi(client);

// Get account by index
const account = await accountApi.getAccount({
  by: 'index',
  value: '1',
});

// Get account by L1 address
const accountByAddress = await accountApi.getAccount({
  by: 'l1_address',
  value: '0x8D7f03FdE1A626223364E592740a233b72395235',
});

// Get all accounts
const accounts = await accountApi.getAccounts({
  limit: 10,
  index: 0,
  sort: 'asc',
});

// Get API keys
const apiKeys = await accountApi.getApiKeys(1, 0);

// Check if account is whitelisted
const isWhitelisted = await accountApi.isWhitelisted(1);
```

### Order Operations

```typescript
import { ApiClient, OrderApi } from 'lighter-ts';

const client = new ApiClient();
const orderApi = new OrderApi(client);

// Get exchange statistics
const stats = await orderApi.getExchangeStats();

// Get order book details
const orderBook = await orderApi.getOrderBookDetails({
  market_id: 0,
  depth: 10,
});

// Get recent trades
const trades = await orderApi.getRecentTrades({
  market_id: 0,
  limit: 10,
});

// Create a limit order
const order = await orderApi.createOrder({
  market_id: 0,
  side: 'buy',
  type: 'limit',
  size: '1.0',
  price: '50000',
  time_in_force: 'GTC',
});

// Cancel an order
await orderApi.cancelOrder({
  market_id: 0,
  order_id: 'order-id',
});
```

### Transaction Operations

```typescript
import { ApiClient, TransactionApi } from 'lighter-ts';

const client = new ApiClient();
const transactionApi = new TransactionApi(client);

// Get current block height
const height = await transactionApi.getCurrentHeight();

// Get block information
const block = await transactionApi.getBlock({
  by: 'height',
  value: '1',
});

// Get transaction
const tx = await transactionApi.getTransaction({
  by: 'hash',
  value: 'tx-hash',
});

// Get next nonce
const nonce = await transactionApi.getNextNonce(1, 0);

// Send transaction
const result = await transactionApi.sendTransaction({
  account_index: 1,
  api_key_index: 0,
  transaction: 'signed-transaction-data',
});
```

### WebSocket Operations

```typescript
import { WsClient } from 'lighter-ts';

const wsClient = new WsClient({
  url: 'wss://testnet.zklighter.elliot.ai/ws',
  onMessage: (data) => {
    console.log('Received:', data);
  },
  onError: (error) => {
    console.error('WebSocket error:', error);
  },
  onClose: () => {
    console.log('WebSocket closed');
  },
});

// Connect to WebSocket
await wsClient.connect();

// Subscribe to order book updates
wsClient.subscribe({
  channel: 'orderbook',
  params: { market_id: 0 },
});

// Subscribe to trades
wsClient.subscribe({
  channel: 'trades',
  params: { market_id: 0 },
});

// Unsubscribe
wsClient.unsubscribe('orderbook');

// Disconnect
wsClient.disconnect();
```

## Configuration

The SDK can be configured with various options:

```typescript
import { ApiClient } from 'lighter-ts';

const client = new ApiClient({
  host: 'https://testnet.zklighter.elliot.ai', // API host
  apiKey: 'your-api-key',                      // API key for authentication
  secretKey: 'your-secret-key',                // Secret key for authentication
  timeout: 30000,                              // Request timeout in milliseconds
  userAgent: 'MyApp/1.0.0',                    // Custom user agent
});
```

## Error Handling

The SDK provides comprehensive error handling with custom exception classes:

```typescript
import {
  ApiException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ServiceException,
} from 'lighter-ts';

try {
  const result = await api.someMethod();
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Bad request:', error.message);
  } else if (error instanceof UnauthorizedException) {
    console.error('Unauthorized:', error.message);
  } else if (error instanceof NotFoundException) {
    console.error('Not found:', error.message);
  } else if (error instanceof ServiceException) {
    console.error('Server error:', error.message);
  } else if (error instanceof ApiException) {
    console.error('API error:', error.message, error.status);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## TypeScript Support

The SDK is built with TypeScript and provides comprehensive type definitions:

```typescript
import { Account, Order, Transaction } from 'lighter-ts';

// All API responses are properly typed
const account: Account = await accountApi.getAccount({ by: 'index', value: '1' });
const orders: Order[] = await orderApi.getAccountActiveOrders(1);
const transactions: Transaction[] = await transactionApi.getAccountTransactions(1);
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
npm run test:watch
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Formatting

```bash
npm run format
```

## API Reference

### Core Classes

- `ApiClient` - Main HTTP client for API requests
- `WsClient` - WebSocket client for real-time data
- `Config` - Configuration management

### API Classes

- `AccountApi` - Account-related operations
- `OrderApi` - Order and trading operations
- `TransactionApi` - Transaction and blockchain operations

### Exception Classes

- `LighterException` - Base exception class
- `ApiException` - General API exceptions
- `BadRequestException` - 400 errors
- `UnauthorizedException` - 401 errors
- `ForbiddenException` - 403 errors
- `NotFoundException` - 404 errors
- `TooManyRequestsException` - 429 errors
- `ServiceException` - 5xx errors

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run the test suite
6. Submit a pull request

## Support

For support and questions, please open an issue on GitHub or contact the development team.