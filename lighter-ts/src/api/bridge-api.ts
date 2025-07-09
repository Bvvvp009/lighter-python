import { HTTPClient } from '../client/http-client';

// Types for bridge API responses
export interface BridgeSupportedNetwork {
  networkId: number;
  name: string;
  chainId: number;
  contractAddress: string;
  status: number;
}

export interface BridgeInfo {
  supportedNetworks: BridgeSupportedNetwork[];
  fees: Record<string, number>;
  limits: Record<string, number>;
}

export class BridgeApi {
  private httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get bridge info
   */
  async getBridgeInfo(): Promise<BridgeInfo> {
    return await this.httpClient.makeRequest<BridgeInfo>('GET', 'api/v1/bridge/info');
  }
}