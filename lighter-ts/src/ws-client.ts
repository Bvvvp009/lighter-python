import WebSocket from 'ws';

export interface WebSocketConfig {
  url: string;
  pingInterval?: number;
  pongTimeout?: number;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export type WebSocketMessageHandler = (message: WebSocketMessage) => void;

export class WebSocketClient {
  private config: WebSocketConfig;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private pingTimer: NodeJS.Timeout | null = null;
  private pongTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, WebSocketMessageHandler[]> = new Map();
  private isConnecting = false;
  private isConnected = false;

  constructor(config: WebSocketConfig) {
    this.config = {
      pingInterval: 30000, // 30 seconds
      pongTimeout: 10000, // 10 seconds
      reconnectInterval: 5000, // 5 seconds
      maxReconnectAttempts: 10,
      ...config,
    };
  }

  /**
   * Connect to WebSocket server
   */
  async connect(): Promise<void> {
    if (this.isConnecting || this.isConnected) {
      return;
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.url);

        this.ws.on('open', () => {
          this.isConnecting = false;
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.startPingTimer();
          resolve();
        });

        this.ws.on('message', (data: WebSocket.Data) => {
          this.handleMessage(data);
        });

        this.ws.on('close', (code: number, reason: Buffer) => {
          this.handleClose(code, reason.toString());
        });

        this.ws.on('error', (error: Error) => {
          this.isConnecting = false;
          reject(error);
        });

        this.ws.on('pong', () => {
          this.handlePong();
        });

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.stopPingTimer();
    this.stopPongTimer();
    this.stopReconnectTimer();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
    this.isConnecting = false;
  }

  /**
   * Subscribe to a message type
   */
  subscribe(messageType: string, handler: WebSocketMessageHandler): void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    this.messageHandlers.get(messageType)!.push(handler);
  }

  /**
   * Unsubscribe from a message type
   */
  unsubscribe(messageType: string, handler: WebSocketMessageHandler): void {
    const handlers = this.messageHandlers.get(messageType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Send a message
   */
  send(message: WebSocketMessage): void {
    if (!this.isConnected || !this.ws) {
      throw new Error('WebSocket is not connected');
    }

    this.ws.send(JSON.stringify(message));
  }

  /**
   * Subscribe to order book updates
   */
  subscribeOrderBook(marketIndex: number, handler: WebSocketMessageHandler): void {
    this.subscribe('orderbook', handler);
    this.send({
      type: 'subscribe',
      data: { channel: 'orderbook', marketIndex },
      timestamp: Date.now(),
    });
  }

  /**
   * Subscribe to trade updates
   */
  subscribeTrades(marketIndex: number, handler: WebSocketMessageHandler): void {
    this.subscribe('trades', handler);
    this.send({
      type: 'subscribe',
      data: { channel: 'trades', marketIndex },
      timestamp: Date.now(),
    });
  }

  /**
   * Subscribe to ticker updates
   */
  subscribeTicker(marketIndex: number, handler: WebSocketMessageHandler): void {
    this.subscribe('ticker', handler);
    this.send({
      type: 'subscribe',
      data: { channel: 'ticker', marketIndex },
      timestamp: Date.now(),
    });
  }

  /**
   * Subscribe to account updates
   */
  subscribeAccount(accountIndex: number, handler: WebSocketMessageHandler): void {
    this.subscribe('account', handler);
    this.send({
      type: 'subscribe',
      data: { channel: 'account', accountIndex },
      timestamp: Date.now(),
    });
  }

  /**
   * Subscribe to order updates
   */
  subscribeOrders(accountIndex: number, handler: WebSocketMessageHandler): void {
    this.subscribe('orders', handler);
    this.send({
      type: 'subscribe',
      data: { channel: 'orders', accountIndex },
      timestamp: Date.now(),
    });
  }

  /**
   * Subscribe to transaction updates
   */
  subscribeTransactions(accountIndex: number, handler: WebSocketMessageHandler): void {
    this.subscribe('transactions', handler);
    this.send({
      type: 'subscribe',
      data: { channel: 'transactions', accountIndex },
      timestamp: Date.now(),
    });
  }

  /**
   * Unsubscribe from a channel
   */
  unsubscribeChannel(channel: string, marketIndex?: number, accountIndex?: number): void {
    const data: any = { channel };
    if (marketIndex !== undefined) data.marketIndex = marketIndex;
    if (accountIndex !== undefined) data.accountIndex = accountIndex;

    this.send({
      type: 'unsubscribe',
      data,
      timestamp: Date.now(),
    });
  }

  private handleMessage(data: WebSocket.Data): void {
    try {
      const message: WebSocketMessage = JSON.parse(data.toString());
      const handlers = this.messageHandlers.get(message.type);
      
      if (handlers) {
        handlers.forEach(handler => {
          try {
            handler(message);
          } catch (error) {
            console.error('Error in WebSocket message handler:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private handleClose(code: number, reason: string): void {
    this.isConnected = false;
    this.stopPingTimer();
    this.stopPongTimer();

    console.log(`WebSocket closed: ${code} - ${reason}`);

    if (this.reconnectAttempts < this.config.maxReconnectAttempts!) {
      this.scheduleReconnect();
    }
  }

  private handlePong(): void {
    this.stopPongTimer();
  }

  private startPingTimer(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
    }

    this.pingTimer = setInterval(() => {
      if (this.ws && this.isConnected) {
        this.ws.ping();
        this.startPongTimer();
      }
    }, this.config.pingInterval);
  }

  private stopPingTimer(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private startPongTimer(): void {
    this.stopPongTimer();
    this.pongTimer = setTimeout(() => {
      console.warn('WebSocket pong timeout');
      if (this.ws) {
        this.ws.terminate();
      }
    }, this.config.pongTimeout);
  }

  private stopPongTimer(): void {
    if (this.pongTimer) {
      clearTimeout(this.pongTimer);
      this.pongTimer = null;
    }
  }

  private scheduleReconnect(): void {
    this.stopReconnectTimer();
    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);
      this.connect().catch(error => {
        console.error('Reconnect failed:', error);
      });
    }, this.config.reconnectInterval);
  }

  private stopReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Check if WebSocket is connected
   */
  get connected(): boolean {
    return this.isConnected;
  }
}