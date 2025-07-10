// Core exports
export { ApiClient } from './api/api-client';
export { WsClient } from './api/ws-client';
export { Config } from './utils/configuration';

// API exports
export { AccountApi } from './api/account-api';
export { OrderApi } from './api/order-api';
export { TransactionApi } from './api/transaction-api';

// Type exports
export * from './types';
export * from './utils/exceptions';

// Re-export types from API modules
export type {
  Account,
  AccountPosition,
  Order as AccountOrder,
  Trade as AccountTrade,
  AccountApiKeys,
  ApiKey,
  PublicPool,
  PublicPoolShare,
} from './api/account-api';

export type {
  OrderBook,
  PriceLevel,
  OrderBookDetail,
  OrderBookOrders,
  Order,
  Trade,
  ExchangeStats,
} from './api/order-api';

export type {
  Transaction,
  Block,
  NextNonce,
  TxHash,
  TxHashes,
} from './api/transaction-api';

// Default configuration
export const DEFAULT_CONFIG = {
  host: 'https://mainnet.zklighter.elliot.ai',
  timeout: 30000,
  userAgent: 'Lighter-TypeScript-SDK/1.0.0',
};

// Version
export const VERSION = '1.0.0';