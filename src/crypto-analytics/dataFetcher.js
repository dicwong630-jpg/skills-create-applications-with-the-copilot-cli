/**
 * dataFetcher.js
 * Helpers for fetching cryptocurrency market data.
 *
 * In a real implementation these functions would call live exchange APIs
 * (e.g. Binance, CoinGecko, Kraken).  Here they return mock data so the
 * module can be used without network access and tested offline.
 */

/**
 * Fetch the latest price for a given cryptocurrency symbol.
 * @param {string} symbol - Ticker symbol, e.g. "BTC", "ETH".
 * @returns {Promise<{symbol: string, price: number, currency: string, timestamp: string}>}
 */
async function fetchPrice(symbol) {
  // Mock prices – replace with a real API call in production.
  const mockPrices = {
    BTC: 65000,
    ETH: 3200,
    BNB: 420,
    SOL: 170,
    ADA: 0.45,
  };

  const price = mockPrices[symbol.toUpperCase()];
  if (price === undefined) {
    throw new Error(`Unknown symbol: ${symbol}`);
  }

  return {
    symbol: symbol.toUpperCase(),
    price,
    currency: "USD",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Fetch historical OHLCV (open/high/low/close/volume) data.
 * @param {string} symbol - Ticker symbol.
 * @param {number} days   - Number of past days to retrieve.
 * @returns {Promise<Array<{date: string, open: number, high: number, low: number, close: number, volume: number}>>}
 */
async function fetchHistoricalData(symbol, days = 7) {
  const basePrice = (await fetchPrice(symbol)).price;
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Simulate slight daily price variation (±5 %).
    const variation = (Math.random() - 0.5) * 0.1;
    const close = +(basePrice * (1 + variation)).toFixed(2);
    const open = +(close * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2);
    const high = +(Math.max(open, close) * (1 + Math.random() * 0.02)).toFixed(2);
    const low = +(Math.min(open, close) * (1 - Math.random() * 0.02)).toFixed(2);
    const volume = +(Math.random() * 1e9).toFixed(0);

    data.push({
      date: date.toISOString().split("T")[0],
      open,
      high,
      low,
      close,
      volume,
    });
  }

  return data;
}

/**
 * Fetch the top N cryptocurrencies by market cap.
 * @param {number} limit - Number of coins to return (default 10).
 * @returns {Promise<Array<{rank: number, symbol: string, name: string, price: number, marketCap: number}>>}
 */
async function fetchTopCoins(limit = 10) {
  const coins = [
    { symbol: "BTC", name: "Bitcoin",  price: 65000,  marketCap: 1.27e12 },
    { symbol: "ETH", name: "Ethereum", price: 3200,   marketCap: 3.84e11 },
    { symbol: "BNB", name: "BNB",      price: 420,    marketCap: 6.3e10  },
    { symbol: "SOL", name: "Solana",   price: 170,    marketCap: 7.5e10  },
    { symbol: "ADA", name: "Cardano",  price: 0.45,   marketCap: 1.6e10  },
    { symbol: "XRP", name: "XRP",      price: 0.55,   marketCap: 3.0e10  },
    { symbol: "DOT", name: "Polkadot", price: 7.5,    marketCap: 1.0e10  },
    { symbol: "MATIC", name: "Polygon",price: 0.9,    marketCap: 8.5e9   },
    { symbol: "DOGE", name: "Dogecoin",price: 0.08,   marketCap: 1.1e10  },
    { symbol: "AVAX", name: "Avalanche",price: 35,    marketCap: 1.4e10  },
  ];

  return coins.slice(0, limit).map((coin, index) => ({
    rank: index + 1,
    ...coin,
  }));
}

module.exports = { fetchPrice, fetchHistoricalData, fetchTopCoins };
