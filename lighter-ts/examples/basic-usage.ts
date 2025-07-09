import { LighterClient, WebSocketClient } from '../src';

async function main() {
  // Initialize the client
  const client = new LighterClient({
    baseUrl: 'https://api.lighter.xyz',
    lighterChainId: 1,
    // Note: In production, use proper private key management
    privateKey: new Uint8Array(32), // Replace with actual private key
  });

  try {
    // Get account information
    console.log('Getting account information...');
    const account = await client.account.getAccount('index', '123');
    console.log('Account:', account);

    // Get markets
    console.log('Getting markets...');
    const markets = await client.order.getMarkets();
    console.log('Markets:', markets);

    // Get order books for first market
    if (markets.markets.length > 0) {
      const marketIndex = markets.markets[0].marketIndex;
      console.log(`Getting order book for market ${marketIndex}...`);
      const orderBooks = await client.order.getOrderBooks([marketIndex], 10);
      console.log('Order books:', orderBooks);
    }

    // Get recent trades
    console.log('Getting recent trades...');
    const trades = await client.order.getRecentTrades(1, 5);
    console.log('Recent trades:', trades);

    // Get exchange stats
    console.log('Getting exchange stats...');
    const stats = await client.order.getExchangeStats();
    console.log('Exchange stats:', stats);

    // Get current height
    console.log('Getting current height...');
    const height = await client.transaction.getCurrentHeight();
    console.log('Current height:', height);

    // Get zkLighter info
    console.log('Getting zkLighter info...');
    const info = await client.root.getZkLighterInfo();
    console.log('zkLighter info:', info);

    // Example of creating a transaction (commented out for safety)
    /*
    console.log('Creating limit order...');
    const orderTx = await client.createLimitOrder(
      1, // marketIndex
      1, // clientOrderIndex
      1000, // baseAmount
      50000, // price
      false, // isAsk (false = buy)
      { fromAccountIndex: 123 }
    );
    console.log('Order transaction:', orderTx);

    // Send the transaction
    console.log('Sending transaction...');
    const txHash = await client.sendTransaction(orderTx);
    console.log('Transaction hash:', txHash);
    */

  } catch (error) {
    console.error('Error:', error);
  }
}

// WebSocket example
async function websocketExample() {
  const ws = new WebSocketClient({
    url: 'wss://ws.lighter.xyz',
  });

  try {
    await ws.connect();
    console.log('WebSocket connected');

    // Subscribe to order book updates
    ws.subscribeOrderBook(1, (message) => {
      console.log('Order book update:', message.data);
    });

    // Subscribe to trade updates
    ws.subscribeTrades(1, (message) => {
      console.log('Trade update:', message.data);
    });

    // Subscribe to ticker updates
    ws.subscribeTicker(1, (message) => {
      console.log('Ticker update:', message.data);
    });

    // Keep connection alive for a while
    setTimeout(() => {
      console.log('Disconnecting WebSocket...');
      ws.disconnect();
    }, 30000); // 30 seconds

  } catch (error) {
    console.error('WebSocket error:', error);
  }
}

// Run examples
if (require.main === module) {
  console.log('Running basic usage example...');
  main().then(() => {
    console.log('Basic usage example completed');
    
    console.log('\nRunning WebSocket example...');
    return websocketExample();
  }).then(() => {
    console.log('WebSocket example completed');
  }).catch((error) => {
    console.error('Example failed:', error);
  });
}