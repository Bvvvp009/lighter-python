import { HTTPClient } from '../client/http-client';

// Types for root API responses
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

export interface ExchangeStats {
  totalVolume24h: number;
  totalTrades24h: number;
  activeMarkets: number;
  timestamp: number;
}

export interface ExportData {
  data: string;
  format: string;
  timestamp: number;
}

export interface ReqExportData {
  accountIndex: number;
  startTimestamp: number;
  endTimestamp: number;
  dataType: string;
  format: string;
}

export class RootApi {
  private httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
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
   * Get exchange stats
   */
  async getExchangeStats(): Promise<ExchangeStats> {
    return await this.httpClient.makeRequest<ExchangeStats>('GET', 'api/v1/exchange/stats');
  }

  /**
   * Export data
   */
  async exportData(
    req: ReqExportData,
    authorization?: string,
    auth?: string
  ): Promise<ExportData> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    return await this.httpClient.makeRequest<ExportData>('POST', 'api/v1/export/data', req, undefined, headers);
  }
}