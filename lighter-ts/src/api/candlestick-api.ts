import { HTTPClient } from '../client/http-client';

// Types for candlestick API responses
export interface Candlestick {
  marketIndex: number;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Candlesticks {
  candlesticks: Candlestick[];
  cursor?: string;
}

export interface DetailedCandlestick extends Candlestick {
  // Additional fields for detailed candlesticks
  numberOfTrades: number;
  quoteVolume: number;
  weightedAveragePrice: number;
}

export interface DetailedCandlesticks {
  candlesticks: DetailedCandlestick[];
  cursor?: string;
}

export class CandlestickApi {
  private httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get candlesticks
   */
  async getCandlesticks(
    marketIndex: number,
    resolution: string,
    startTimestamp: number,
    endTimestamp: number,
    limit: number
  ): Promise<Candlesticks> {
    return await this.httpClient.makeRequest<Candlesticks>('GET', 'api/v1/candlesticks', {
      market_index: marketIndex,
      resolution,
      start_timestamp: startTimestamp,
      end_timestamp: endTimestamp,
      limit,
    });
  }

  /**
   * Get detailed candlesticks
   */
  async getDetailedCandlesticks(
    marketIndex: number,
    resolution: string,
    startTimestamp: number,
    endTimestamp: number,
    limit: number
  ): Promise<DetailedCandlesticks> {
    return await this.httpClient.makeRequest<DetailedCandlesticks>('GET', 'api/v1/candlesticks/detailed', {
      market_index: marketIndex,
      resolution,
      start_timestamp: startTimestamp,
      end_timestamp: endTimestamp,
      limit,
    });
  }
}