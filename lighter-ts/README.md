# Lighter TypeScript SDK

This directory contains the complete TypeScript SDK for the Lighter perpetual trading platform.

## Overview

The TypeScript SDK provides full access to all Lighter API endpoints and transaction functionality, with complete feature parity to the Python SDK.

## Features

- **Complete API Coverage**: All endpoints from the Python SDK implemented
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Transaction Building**: Create and sign all transaction types
- **WebSocket Support**: Real-time data streaming
- **Authentication**: Support for API keys and private key signing
- **Error Handling**: Comprehensive error handling and validation

## Quick Start

```bash
# Install dependencies
npm install

# Build the SDK
npm run build

# Run tests
npm test

# Run examples
npm run example
```

## Usage

```typescript
import { LighterClient } from './src';

const client = new LighterClient({
  baseUrl: 'https://api.lighter.xyz',
  lighterChainId: 1,
  privateKey: new Uint8Array([/* your private key */]),
});

// Get account information
const account = await client.account.getAccount('index', '123');

// Get markets
const markets = await client.order.getMarkets();

// Create a limit order
const orderTx = await client.createLimitOrder(
  1, // marketIndex
  1, // clientOrderIndex
  1000, // baseAmount
  50000, // price
  false, // isAsk (false = buy)
  { fromAccountIndex: 123 }
);
```

## Documentation

For detailed documentation, see [README-TS.md](./README-TS.md).

## API Classes

- `AccountApi` - Account management and information
- `OrderApi` - Order operations and market data
- `TransactionApi` - Transaction history and blockchain data
- `CandlestickApi` - Price chart data
- `FundingApi` - Funding rates and history
- `BridgeApi` - Cross-chain bridge operations
- `AnnouncementApi` - Platform announcements
- `NotificationApi` - User notifications
- `ReferralApi` - Referral system
- `RootApi` - System information and utilities
- `BlockApi` - Block information

## WebSocket Support

Real-time data streaming for:
- Order book updates
- Trade updates
- Ticker updates
- Account updates
- Order updates
- Transaction updates

## Examples

See the [examples](./examples) directory for usage examples.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm test

# Lint
npm run lint

# Watch mode
npm run dev
```

## License

MIT License - see LICENSE file for details.