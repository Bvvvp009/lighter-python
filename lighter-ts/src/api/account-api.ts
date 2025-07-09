import { HTTPClient } from '../client/http-client';
import { AccountApiKeys } from '../types';

// Types for account API responses
export interface DetailedAccount {
  accountIndex: number;
  status: number;
  collateral: number;
  positions: AccountPosition[];
  metadata?: AccountMetadata;
}

export interface AccountPosition {
  marketIndex: number;
  ooc: number; // Open order count
  sign: number; // 1 for Long, -1 for Short
  position: number;
  avgEntryPrice: number;
  positionValue: number;
  unrealizedPnL: number;
  realizedPnL: number;
}

export interface AccountMetadata {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface DetailedAccounts {
  accounts: DetailedAccount[];
}

export interface AccountLimits {
  maxLeverage: number;
  maxPositionSize: number;
  maxOrderSize: number;
}

export interface AccountMetadatas {
  metadatas: AccountMetadata[];
}

// AccountApiKeys is already defined in types/index.ts

export interface L1Metadata {
  l1Address: string;
  accountIndex: number;
  publicKey: string;
}

export interface LiquidationInfo {
  marketIndex: number;
  position: number;
  avgEntryPrice: number;
  liquidationPrice: number;
  liquidationValue: number;
  timestamp: number;
}

export interface LiquidationInfos {
  liquidations: LiquidationInfo[];
  cursor?: string;
}

export interface PositionFunding {
  marketIndex: number;
  side: string;
  fundingRate: number;
  fundingValue: number;
  timestamp: number;
}

export interface PositionFundings {
  fundings: PositionFunding[];
  cursor?: string;
}

export interface PublicPool {
  index: number;
  status: number;
  operatorFee: number;
  totalShares: number;
  minOperatorShareRate: number;
  operatorAccountIndex: number;
}

export interface PublicPools {
  pools: PublicPool[];
  cursor?: string;
}

export interface SubAccounts {
  accounts: {
    accountIndex: number;
    status: number;
  }[];
}

export interface AccountPnL {
  entries: PnLEntry[];
}

export interface PnLEntry {
  timestamp: number;
  pnl: number;
  cumulativePnL: number;
}

export class AccountApi {
  private httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get account by account's index
   */
  async getAccount(by: string, value: string): Promise<DetailedAccounts> {
    return await this.httpClient.makeRequest<DetailedAccounts>('GET', 'api/v1/account', {
      by,
      value,
    });
  }

  /**
   * Get account limits
   */
  async getAccountLimits(
    accountIndex: number,
    authorization?: string,
    auth?: string
  ): Promise<AccountLimits> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    return await this.httpClient.makeRequest<AccountLimits>('GET', 'api/v1/account/limits', {
      account_index: accountIndex,
    }, headers);
  }

  /**
   * Get account metadata
   */
  async getAccountMetadata(
    by: string,
    value: string,
    authorization?: string,
    auth?: string
  ): Promise<AccountMetadatas> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    return await this.httpClient.makeRequest<AccountMetadatas>('GET', 'api/v1/account/metadata', {
      by,
      value,
    }, headers);
  }

  /**
   * Get accounts by L1 address
   */
  async getAccountsByL1Address(l1Address: string): Promise<SubAccounts> {
    return await this.httpClient.makeRequest<SubAccounts>('GET', 'api/v1/accounts/byL1Address', {
      l1_address: l1Address,
    });
  }

  /**
   * Get API keys
   */
  async getApiKeys(accountIndex: number, apiKeyIndex?: number): Promise<AccountApiKeys> {
    const params: Record<string, any> = { account_index: accountIndex };
    if (apiKeyIndex !== undefined) {
      params.api_key_index = apiKeyIndex;
    }

    return await this.httpClient.makeRequest<AccountApiKeys>('GET', 'api/v1/apikeys', params);
  }

  /**
   * Get L1 metadata
   */
  async getL1Metadata(
    l1Address: string,
    authorization?: string,
    auth?: string
  ): Promise<L1Metadata> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    return await this.httpClient.makeRequest<L1Metadata>('GET', 'api/v1/l1/metadata', {
      l1_address: l1Address,
    }, headers);
  }

  /**
   * Get liquidations
   */
  async getLiquidations(
    accountIndex: number,
    limit: number,
    authorization?: string,
    auth?: string,
    marketId?: number,
    cursor?: string
  ): Promise<LiquidationInfos> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    const params: Record<string, any> = {
      account_index: accountIndex,
      limit,
    };
    if (marketId !== undefined) params.market_id = marketId;
    if (cursor) params.cursor = cursor;

    return await this.httpClient.makeRequest<LiquidationInfos>('GET', 'api/v1/liquidations', params, headers);
  }

  /**
   * Get PnL
   */
  async getPnL(
    by: string,
    value: string,
    resolution: string,
    startTimestamp: number,
    endTimestamp: number,
    countBack: number,
    authorization?: string,
    auth?: string,
    ignoreTransfers?: boolean
  ): Promise<AccountPnL> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    const params: Record<string, any> = {
      by,
      value,
      resolution,
      start_timestamp: startTimestamp,
      end_timestamp: endTimestamp,
      count_back: countBack,
    };
    if (ignoreTransfers !== undefined) params.ignore_transfers = ignoreTransfers;

    return await this.httpClient.makeRequest<AccountPnL>('GET', 'api/v1/pnl', params, headers);
  }

  /**
   * Get position funding
   */
  async getPositionFunding(
    accountIndex: number,
    limit: number,
    authorization?: string,
    auth?: string,
    marketId?: number,
    cursor?: string,
    side?: string
  ): Promise<PositionFundings> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    const params: Record<string, any> = {
      account_index: accountIndex,
      limit,
    };
    if (marketId !== undefined) params.market_id = marketId;
    if (cursor) params.cursor = cursor;
    if (side) params.side = side;

    return await this.httpClient.makeRequest<PositionFundings>('GET', 'api/v1/position/funding', params, headers);
  }

  /**
   * Get public pools
   */
  async getPublicPools(
    index: number,
    limit: number,
    authorization?: string,
    auth?: string,
    filter?: string,
    accountIndex?: number
  ): Promise<PublicPools> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    const params: Record<string, any> = {
      index,
      limit,
    };
    if (filter) params.filter = filter;
    if (accountIndex !== undefined) params.account_index = accountIndex;

    return await this.httpClient.makeRequest<PublicPools>('GET', 'api/v1/public/pools', params, headers);
  }
}