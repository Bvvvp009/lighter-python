import { HTTPClient } from '../client/http-client';

// Types for referral API responses
export interface ReferralPointEntry {
  accountIndex: number;
  points: number;
  reason: string;
  timestamp: number;
}

export interface ReferralPoints {
  entries: ReferralPointEntry[];
  cursor?: string;
  totalPoints: number;
}

export class ReferralApi {
  private httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get referral points
   */
  async getReferralPoints(
    accountIndex: number,
    limit: number,
    authorization?: string,
    auth?: string,
    cursor?: string
  ): Promise<ReferralPoints> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    const params: Record<string, any> = {
      account_index: accountIndex,
      limit,
    };
    if (cursor) params.cursor = cursor;

    return await this.httpClient.makeRequest<ReferralPoints>('GET', 'api/v1/referral/points', params, undefined, headers);
  }
}