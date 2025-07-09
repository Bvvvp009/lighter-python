import { HTTPClient } from '../client/http-client';

// Types for order API responses
export interface Order {
  index: number;
  marketIndex: number;
  accountIndex: number;
  clientOrderIndex: number;
  baseAmount: number;
  price: number;
  isAsk: number;
  type: number;
  timeInForce: number;
  reduceOnly: number;
  triggerPrice: number;
  orderExpiry: number;
  status: number;
  filledAmount: number;
  avgFillPrice: number;
  timestamp: number;
}

export interface Orders {
  orders: Order[];
  cursor?: string;
}

export interface OrderBook {
  marketIndex: number;
  bids: PriceLevel[];
  asks: PriceLevel[];
  timestamp: number;
}

export interface PriceLevel {
  price: number;
  amount: number;
}

export interface OrderBooks {
  orderBooks: OrderBook[];
}

export interface OrderBookDetail {
  marketIndex: number;
  bids: PriceLevel[];
  asks: PriceLevel[];
  stats: OrderBookStats;
  timestamp: number;
}

export interface OrderBookStats {
  totalBidAmount: number;
  totalAskAmount: number;
  bidCount: number;
  askCount: number;
}

export interface OrderBookDetails {
  orderBookDetails: OrderBookDetail[];
}

export interface Trade {
  index: number;
  marketIndex: number;
  orderIndex: number;
  accountIndex: number;
  baseAmount: number;
  price: number;
  isAsk: number;
  timestamp: number;
}

export interface Trades {
  trades: Trade[];
  cursor?: string;
}

export interface RecentTrade {
  marketIndex: number;
  baseAmount: number;
  price: number;
  isAsk: number;
  timestamp: number;
}

export interface RecentTrades {
  trades: RecentTrade[];
}

export interface MarketInfo {
  marketIndex: number;
  baseToken: string;
  quoteToken: string;
  baseTokenDecimals: number;
  quoteTokenDecimals: number;
  minOrderSize: number;
  maxOrderSize: number;
  tickSize: number;
  stepSize: number;
  status: number;
}

export interface MarketInfos {
  markets: MarketInfo[];
}

export interface Ticker {
  marketIndex: number;
  lastPrice: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  timestamp: number;
}

export interface Tickers {
  tickers: Ticker[];
}

export interface ExchangeStats {
  totalVolume24h: number;
  totalTrades24h: number;
  activeMarkets: number;
  timestamp: number;
}

export class OrderApi {
  private httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get orders
   */
  async getOrders(
    accountIndex: number,
    limit: number,
    authorization?: string,
    auth?: string,
    marketIndex?: number,
    cursor?: string,
    status?: number
  ): Promise<Orders> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    const params: Record<string, any> = {
      account_index: accountIndex,
      limit,
    };
    if (marketIndex !== undefined) params.market_index = marketIndex;
    if (cursor) params.cursor = cursor;
    if (status !== undefined) params.status = status;

    return await this.httpClient.makeRequest<Orders>('GET', 'api/v1/orders', params, undefined, headers);
  }

  /**
   * Get order books
   */
  async getOrderBooks(
    marketIndices: number[],
    depth?: number
  ): Promise<OrderBooks> {
    const params: Record<string, any> = {
      market_indices: marketIndices.join(','),
    };
    if (depth !== undefined) params.depth = depth;

    return await this.httpClient.makeRequest<OrderBooks>('GET', 'api/v1/orderbooks', params);
  }

  /**
   * Get order book details
   */
  async getOrderBookDetails(
    marketIndices: number[],
    depth?: number
  ): Promise<OrderBookDetails> {
    const params: Record<string, any> = {
      market_indices: marketIndices.join(','),
    };
    if (depth !== undefined) params.depth = depth;

    return await this.httpClient.makeRequest<OrderBookDetails>('GET', 'api/v1/orderbooks/details', params);
  }

  /**
   * Get trades
   */
  async getTrades(
    accountIndex: number,
    limit: number,
    authorization?: string,
    auth?: string,
    marketIndex?: number,
    cursor?: string
  ): Promise<Trades> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    const params: Record<string, any> = {
      account_index: accountIndex,
      limit,
    };
    if (marketIndex !== undefined) params.market_index = marketIndex;
    if (cursor) params.cursor = cursor;

    return await this.httpClient.makeRequest<Trades>('GET', 'api/v1/trades', params, undefined, headers);
  }

  /**
   * Get recent trades
   */
  async getRecentTrades(
    marketIndex: number,
    limit: number
  ): Promise<RecentTrades> {
    return await this.httpClient.makeRequest<RecentTrades>('GET', 'api/v1/recentTrades', {
      market_index: marketIndex,
      limit,
    });
  }

  /**
   * Get markets
   */
  async getMarkets(): Promise<MarketInfos> {
    return await this.httpClient.makeRequest<MarketInfos>('GET', 'api/v1/markets');
  }

  /**
   * Get tickers
   */
  async getTickers(marketIndices?: number[]): Promise<Tickers> {
    const params: Record<string, any> = {};
    if (marketIndices) {
      params.market_indices = marketIndices.join(',');
    }

    return await this.httpClient.makeRequest<Tickers>('GET', 'api/v1/tickers', params);
  }

  /**
   * Get exchange stats
   */
  async getExchangeStats(): Promise<ExchangeStats> {
    return await this.httpClient.makeRequest<ExchangeStats>('GET', 'api/v1/exchange/stats');
  }
}