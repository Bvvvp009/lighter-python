// Main exports
export { LighterClient } from './lighter-client';
export { LighterKeyManager } from './signer/key-manager';
export { HTTPClient } from './client/http-client';
export { TransactionBuilder } from './utils/transaction-builder';
export { WebSocketClient } from './ws-client';

// API exports
export * from './api';

// Types
export * from './types';

// Constants
export * from './constants';

// Re-export commonly used types for convenience
export type {
  TransactOpts,
  TxInfo,
  Signer,
  KeyManager,
  OrderInfo,
  CreateOrderTxReq,
  TransferTxReq,
  WithdrawTxReq,
  CancelOrderTxReq,
  ModifyOrderTxReq,
} from './types';

// Re-export client config type
export type { LighterClientConfig } from './lighter-client';

// Re-export WebSocket types
export type { WebSocketConfig, WebSocketMessage, WebSocketMessageHandler } from './ws-client';