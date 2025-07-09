import { HTTPClient } from '../client/http-client';

// Types for announcement API responses
export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: number;
  timestamp: number;
  expiresAt?: number;
}

export interface Announcements {
  announcements: Announcement[];
  cursor?: string;
}

export class AnnouncementApi {
  private httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get announcements
   */
  async getAnnouncements(
    limit: number,
    cursor?: string,
    type?: string
  ): Promise<Announcements> {
    const params: Record<string, any> = { limit };
    if (cursor) params.cursor = cursor;
    if (type) params.type = type;

    return await this.httpClient.makeRequest<Announcements>('GET', 'api/v1/announcements', params);
  }
}