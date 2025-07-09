import { HTTPClient } from '../client/http-client';

// Types for transaction API responses
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

export interface EnrichedTransaction extends Transaction {
  // Additional fields for enriched transactions
  block?: Block;
  relatedTransactions?: Transaction[];
}

export interface EnrichedTransactions {
  transactions: EnrichedTransaction[];
  cursor?: string;
}

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

export interface CurrentHeight {
  height: number;
}

export interface ValidatorInfo {
  address: string;
  stake: number;
  commission: number;
  status: number;
}

export interface ValidatorInfos {
  validators: ValidatorInfo[];
}

export interface ZkLighterInfo {
  version: string;
  chainId: number;
  blockHeight: number;
  timestamp: number;
}

export interface Status {
  status: string;
  timestamp: number;
}

export interface RiskInfo {
  marketIndex: number;
  riskLevel: number;
  riskScore: number;
  timestamp: number;
}

export interface RiskInfos {
  riskInfos: RiskInfo[];
}

export interface DepositHistoryItem {
  hash: string;
  l1Address: string;
  accountIndex: number;
  usdcAmount: number;
  status: number;
  timestamp: number;
  blockNumber?: number;
}

export interface DepositHistory {
  deposits: DepositHistoryItem[];
  cursor?: string;
}

export interface WithdrawHistoryItem {
  hash: string;
  l1Address: string;
  accountIndex: number;
  usdcAmount: number;
  status: number;
  timestamp: number;
  blockNumber?: number;
}

export interface WithdrawHistory {
  withdrawals: WithdrawHistoryItem[];
  cursor?: string;
}

export interface FastWithdrawInfo {
  minAmount: number;
  maxAmount: number;
  fee: number;
  estimatedTime: number;
}

export interface FastBridgeInfo {
  supportedNetworks: BridgeSupportedNetwork[];
  fees: Record<string, number>;
  limits: Record<string, number>;
}

export interface BridgeSupportedNetwork {
  networkId: number;
  name: string;
  chainId: number;
  contractAddress: string;
  status: number;
}

export class TransactionApi {
  private httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get transactions
   */
  async getTransactions(
    accountIndex: number,
    limit: number,
    authorization?: string,
    auth?: string,
    cursor?: string,
    txType?: number
  ): Promise<Transactions> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    const params: Record<string, any> = {
      account_index: accountIndex,
      limit,
    };
    if (cursor) params.cursor = cursor;
    if (txType !== undefined) params.tx_type = txType;

    return await this.httpClient.makeRequest<Transactions>('GET', 'api/v1/transactions', params, undefined, headers);
  }

  /**
   * Get enriched transactions
   */
  async getEnrichedTransactions(
    accountIndex: number,
    limit: number,
    authorization?: string,
    auth?: string,
    cursor?: string,
    txType?: number
  ): Promise<EnrichedTransactions> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    const params: Record<string, any> = {
      account_index: accountIndex,
      limit,
    };
    if (cursor) params.cursor = cursor;
    if (txType !== undefined) params.tx_type = txType;

    return await this.httpClient.makeRequest<EnrichedTransactions>('GET', 'api/v1/transactions/enriched', params, undefined, headers);
  }

  /**
   * Get transaction by hash
   */
  async getTransaction(hash: string): Promise<Transaction> {
    return await this.httpClient.makeRequest<Transaction>('GET', 'api/v1/transaction', {
      hash,
    });
  }

  /**
   * Get L1 transaction
   */
  async getL1Transaction(
    hash: string,
    authorization?: string,
    auth?: string
  ): Promise<Transaction> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    return await this.httpClient.makeRequest<Transaction>('GET', 'api/v1/l1/transaction', {
      hash,
    }, undefined, headers);
  }

  /**
   * Get pending transactions
   */
  async getPendingTransactions(
    accountIndex: number,
    limit: number,
    authorization?: string,
    auth?: string,
    cursor?: string
  ): Promise<Transactions> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    const params: Record<string, any> = {
      account_index: accountIndex,
      limit,
    };
    if (cursor) params.cursor = cursor;

    return await this.httpClient.makeRequest<Transactions>('GET', 'api/v1/transactions/pending', params, undefined, headers);
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

  /**
   * Get current height
   */
  async getCurrentHeight(): Promise<CurrentHeight> {
    return await this.httpClient.makeRequest<CurrentHeight>('GET', 'api/v1/height');
  }

  /**
   * Get validators
   */
  async getValidators(): Promise<ValidatorInfos> {
    return await this.httpClient.makeRequest<ValidatorInfos>('GET', 'api/v1/validators');
  }

  /**
   * Get zkLighter info
   */
  async getZkLighterInfo(): Promise<ZkLighterInfo> {
    return await this.httpClient.makeRequest<ZkLighterInfo>('GET', 'api/v1/info');
  }

  /**
   * Get status
   */
  async getStatus(): Promise<Status> {
    return await this.httpClient.makeRequest<Status>('GET', 'api/v1/status');
  }

  /**
   * Get risk info
   */
  async getRiskInfo(
    marketIndex: number,
    authorization?: string,
    auth?: string
  ): Promise<RiskInfo> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    return await this.httpClient.makeRequest<RiskInfo>('GET', 'api/v1/risk/info', {
      market_index: marketIndex,
    }, undefined, headers);
  }

  /**
   * Get deposit history
   */
  async getDepositHistory(
    accountIndex: number,
    limit: number,
    authorization?: string,
    auth?: string,
    cursor?: string
  ): Promise<DepositHistory> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    const params: Record<string, any> = {
      account_index: accountIndex,
      limit,
    };
    if (cursor) params.cursor = cursor;

    return await this.httpClient.makeRequest<DepositHistory>('GET', 'api/v1/deposits', params, undefined, headers);
  }

  /**
   * Get withdraw history
   */
  async getWithdrawHistory(
    accountIndex: number,
    limit: number,
    authorization?: string,
    auth?: string,
    cursor?: string
  ): Promise<WithdrawHistory> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    const params: Record<string, any> = {
      account_index: accountIndex,
      limit,
    };
    if (cursor) params.cursor = cursor;

    return await this.httpClient.makeRequest<WithdrawHistory>('GET', 'api/v1/withdrawals', params, undefined, headers);
  }

  /**
   * Get latest deposit
   */
  async getLatestDeposit(
    l1Address: string,
    authorization?: string,
    auth?: string
  ): Promise<DepositHistoryItem> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    return await this.httpClient.makeRequest<DepositHistoryItem>('GET', 'api/v1/deposits/latest', {
      l1_address: l1Address,
    }, undefined, headers);
  }

  /**
   * Get fast withdraw info
   */
  async getFastWithdrawInfo(
    authorization?: string,
    auth?: string
  ): Promise<FastWithdrawInfo> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    return await this.httpClient.makeRequest<FastWithdrawInfo>('GET', 'api/v1/fast/withdraw/info', undefined, undefined, headers);
  }

  /**
   * Get fast bridge info
   */
  async getFastBridgeInfo(): Promise<FastBridgeInfo> {
    return await this.httpClient.makeRequest<FastBridgeInfo>('GET', 'api/v1/fast/bridge/info');
  }
}