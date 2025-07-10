import { WsClient } from '../src';

async function main(): Promise<void> {
  const wsClient = new WsClient({
    url: 'wss://testnet.zklighter.elliot.ai/ws',
    onMessage: (data) => {
      console.log('Received message:', JSON.stringify(data, null, 2));
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
    },
    onClose: () => {
      console.log('WebSocket connection closed');
    },
    onOpen: () => {
      console.log('WebSocket connection opened');
    },
    reconnectInterval: 5000,
    maxReconnectAttempts: 5,
  });

  try {
    // Connect to WebSocket
    console.log('Connecting to WebSocket...');
    await wsClient.connect();
    console.log('Connected successfully!');

    // Subscribe to order book updates for market 0
    console.log('Subscribing to order book updates...');
    wsClient.subscribe({
      channel: 'orderbook',
      params: { market_id: 0 },
    });

    // Subscribe to trades for market 0
    console.log('Subscribing to trades...');
    wsClient.subscribe({
      channel: 'trades',
      params: { market_id: 0 },
    });

    // Keep the connection alive for 30 seconds
    console.log('Listening for messages for 30 seconds...');
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Unsubscribe from order book
    console.log('Unsubscribing from order book...');
    wsClient.unsubscribe('orderbook');

    // Keep listening for trades for another 10 seconds
    console.log('Listening for trades for 10 more seconds...');
    await new Promise(resolve => setTimeout(resolve, 10000));

  } catch (error) {
    console.error('Error in WebSocket example:', error);
  } finally {
    // Disconnect
    console.log('Disconnecting...');
    wsClient.disconnect();
    console.log('Disconnected');
  }
}

if (require.main === module) {
  main().catch(console.error);
}