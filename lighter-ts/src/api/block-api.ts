import { HTTPClient } from '../client/http-client';

// Types for block API responses
export interface Block {
  number: number;
  hash: string;
  timestamp: number;
  transactionCount: number;
}

export interface Blocks {
  blocks: Block[];
  cursor?: string;
}

export interface Transaction {
  hash: string;
  txType: number;
  accountIndex: number;
  apiKeyIndex: number;
  nonce: number;
  expiredAt: number;
  status: number;
  timestamp: number;
  blockNumber?: number;
  blockIndex?: number;
}

export interface Transactions {
  transactions: Transaction[];
  cursor?: string;
}

export class BlockApi {
  private httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get blocks
   */
  async getBlocks(
    limit: number,
    cursor?: string
  ): Promise<Blocks> {
    const params: Record<string, any> = { limit };
    if (cursor) params.cursor = cursor;

    return await this.httpClient.makeRequest<Blocks>('GET', 'api/v1/blocks', params);
  }

  /**
   * Get block by number
   */
  async getBlock(blockNumber: number): Promise<Block> {
    return await this.httpClient.makeRequest<Block>('GET', 'api/v1/block', {
      block_number: blockNumber,
    });
  }

  /**
   * Get block transactions
   */
  async getBlockTransactions(
    blockNumber: number,
    limit: number,
    cursor?: string
  ): Promise<Transactions> {
    const params: Record<string, any> = {
      block_number: blockNumber,
      limit,
    };
    if (cursor) params.cursor = cursor;

    return await this.httpClient.makeRequest<Transactions>('GET', 'api/v1/block/transactions', params);
  }
}