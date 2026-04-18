/**
 * crypto-analytics/index.js
 * Entry point for the cryptocurrency big-data analytics module.
 *
 * Usage example:
 *   const crypto = require('./crypto-analytics');
 *   const report = await crypto.generateReport('BTC', 30);
 *   console.log(report);
 */

const { fetchPrice, fetchHistoricalData, fetchTopCoins } = require("./dataFetcher");
const {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateVolatility,
  detectTrend,
  summariseMarket,
} = require("./analyzer");

/**
 * Generate a comprehensive analytics report for a single coin.
 * @param {string} symbol - Ticker symbol (e.g. "BTC").
 * @param {number} days   - Historical window in days (default 30).
 * @returns {Promise<Object>} Analytics report.
 */
async function generateReport(symbol, days = 30) {
  const candles = await fetchHistoricalData(symbol, days);
  const summary = summariseMarket(candles);
  const current = await fetchPrice(symbol);

  return {
    symbol: symbol.toUpperCase(),
    generatedAt: new Date().toISOString(),
    currentPrice: current.price,
    currency: current.currency,
    analysisPeriodDays: days,
    ...summary,
    candles,
  };
}

/**
 * Print a market overview table for the top N coins.
 * @param {number} limit - Number of coins to display (default 10).
 * @returns {Promise<void>}
 */
async function printMarketOverview(limit = 10) {
  const coins = await fetchTopCoins(limit);
  console.log("\n📊  Cryptocurrency Market Overview");
  console.log("─".repeat(60));
  console.log(
    `${"Rank".padEnd(6)}${"Symbol".padEnd(8)}${"Name".padEnd(12)}${"Price (USD)".padStart(14)}${"Market Cap".padStart(18)}`
  );
  console.log("─".repeat(60));

  for (const coin of coins) {
    console.log(
      `${String(coin.rank).padEnd(6)}${coin.symbol.padEnd(8)}${coin.name.padEnd(12)}${("$" + coin.price.toLocaleString()).padStart(14)}${("$" + (coin.marketCap / 1e9).toFixed(1) + "B").padStart(18)}`
    );
  }
  console.log("─".repeat(60));
}

module.exports = {
  // Data fetching
  fetchPrice,
  fetchHistoricalData,
  fetchTopCoins,
  // Analytics
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateVolatility,
  detectTrend,
  summariseMarket,
  // High-level helpers
  generateReport,
  printMarketOverview,
};
