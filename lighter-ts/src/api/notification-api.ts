import { HTTPClient } from '../client/http-client';

// Types for notification API responses
export interface Notification {
  id: string;
  accountIndex: number;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  timestamp: number;
}

export interface Notifications {
  notifications: Notification[];
  cursor?: string;
}

export class NotificationApi {
  private httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get notifications
   */
  async getNotifications(
    accountIndex: number,
    limit: number,
    authorization?: string,
    auth?: string,
    cursor?: string,
    read?: boolean
  ): Promise<Notifications> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    const params: Record<string, any> = {
      account_index: accountIndex,
      limit,
    };
    if (cursor) params.cursor = cursor;
    if (read !== undefined) params.read = read;

    return await this.httpClient.makeRequest<Notifications>('GET', 'api/v1/notifications', params, undefined, headers);
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(
    notificationId: string,
    authorization?: string,
    auth?: string
  ): Promise<void> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    return await this.httpClient.makeRequest<void>('POST', 'api/v1/notifications/read', {
      notification_id: notificationId,
    }, undefined, headers);
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead(
    accountIndex: number,
    authorization?: string,
    auth?: string
  ): Promise<void> {
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;
    if (auth) headers['Auth'] = auth;

    return await this.httpClient.makeRequest<void>('POST', 'api/v1/notifications/read/all', {
      account_index: accountIndex,
    }, undefined, headers);
  }
}