import { HTTPClient } from '../client/http-client';

// Types for funding API responses
export interface Funding {
  marketIndex: number;
  fundingRate: number;
  fundingValue: number;
  timestamp: number;
}

export interface Fundings {
  fundings: Funding[];
  cursor?: string;
}

export interface FundingRate {
  marketIndex: number;
  fundingRate: number;
  nextFundingTime: number;
  timestamp: number;
}

export interface FundingRates {
  fundingRates: FundingRate[];
}

export class FundingApi {
  private httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get fundings
   */
  async getFundings(
    marketIndex: number,
    limit: number,
    cursor?: string
  ): Promise<Fundings> {
    const params: Record<string, any> = {
      market_index: marketIndex,
      limit,
    };
    if (cursor) params.cursor = cursor;

    return await this.httpClient.makeRequest<Fundings>('GET', 'api/v1/fundings', params);
  }

  /**
   * Get funding rates
   */
  async getFundingRates(marketIndices?: number[]): Promise<FundingRates> {
    const params: Record<string, any> = {};
    if (marketIndices) {
      params.market_indices = marketIndices.join(',');
    }

    return await this.httpClient.makeRequest<FundingRates>('GET', 'api/v1/funding/rates', params);
  }
}