/**
 * analyzer.js
 * Big-data analytics functions for cryptocurrency market data.
 *
 * Provides price trend analysis, moving averages, volatility metrics,
 * and portfolio performance calculations.
 */

/**
 * Calculate the Simple Moving Average (SMA) for a series of prices.
 * @param {number[]} prices - Array of closing prices (oldest first).
 * @param {number} period   - Number of periods for the SMA window.
 * @returns {number[]} SMA values (length = prices.length - period + 1).
 */
function calculateSMA(prices, period) {
  if (!Array.isArray(prices) || prices.length < period) {
    throw new Error(`Need at least ${period} prices to compute SMA(${period})`);
  }
  const sma = [];
  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);
    const avg = slice.reduce((sum, p) => sum + p, 0) / period;
    sma.push(+avg.toFixed(2));
  }
  return sma;
}

/**
 * Calculate the Exponential Moving Average (EMA) for a series of prices.
 * @param {number[]} prices - Array of closing prices (oldest first).
 * @param {number} period   - EMA period.
 * @returns {number[]} EMA values (same length as prices).
 */
function calculateEMA(prices, period) {
  if (!Array.isArray(prices) || prices.length < period) {
    throw new Error(`Need at least ${period} prices to compute EMA(${period})`);
  }
  const k = 2 / (period + 1);
  const ema = [prices[0]];
  for (let i = 1; i < prices.length; i++) {
    ema.push(+(prices[i] * k + ema[i - 1] * (1 - k)).toFixed(2));
  }
  return ema;
}

/**
 * Calculate the Relative Strength Index (RSI).
 * @param {number[]} prices - Closing prices (oldest first).
 * @param {number} period   - RSI period (default 14).
 * @returns {number} RSI value (0–100).
 */
function calculateRSI(prices, period = 14) {
  if (prices.length < period + 1) {
    throw new Error(`Need at least ${period + 1} prices to compute RSI(${period})`);
  }

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const delta = prices[i] - prices[i - 1];
    if (delta >= 0) gains += delta;
    else losses += Math.abs(delta);
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return +(100 - 100 / (1 + rs)).toFixed(2);
}

/**
 * Calculate annualised volatility from daily closing prices.
 * @param {number[]} prices - Closing prices (oldest first).
 * @returns {number} Volatility expressed as a percentage (annualised).
 */
function calculateVolatility(prices) {
  if (prices.length < 2) {
    throw new Error("Need at least 2 prices to compute volatility");
  }

  // Daily log returns
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.log(prices[i] / prices[i - 1]));
  }

  const mean = returns.reduce((s, r) => s + r, 0) / returns.length;
  const variance =
    returns.reduce((s, r) => s + (r - mean) ** 2, 0) / (returns.length - 1);

  // Annualise (√252 trading days)
  return +(Math.sqrt(variance) * Math.sqrt(252) * 100).toFixed(2);
}

/**
 * Detect price trend: bullish, bearish, or sideways.
 * Uses a short SMA vs a long SMA crossover.
 * @param {number[]} prices     - Closing prices.
 * @param {number} shortPeriod  - Short SMA period (default 7).
 * @param {number} longPeriod   - Long SMA period (default 21).
 * @returns {"bullish"|"bearish"|"sideways"} Trend label.
 */
function detectTrend(prices, shortPeriod = 7, longPeriod = 21) {
  const shortSMA = calculateSMA(prices, shortPeriod);
  const longSMA = calculateSMA(prices, longPeriod);

  const latestShort = shortSMA[shortSMA.length - 1];
  const latestLong = longSMA[longSMA.length - 1];

  const threshold = 0.005; // 0.5 % threshold for sideways
  const ratio = (latestShort - latestLong) / latestLong;

  if (ratio > threshold) return "bullish";
  if (ratio < -threshold) return "bearish";
  return "sideways";
}

/**
 * Summarise analytics for a set of OHLCV candles.
 * @param {Array<{close: number}>} candles - OHLCV records (oldest first).
 * @returns {{latestPrice: number, sma7: number, sma21: number, rsi14: number, volatility: number, trend: string}}
 */
function summariseMarket(candles) {
  const closes = candles.map((c) => c.close);
  const sma7 = calculateSMA(closes, 7);
  const sma21 = calculateSMA(closes, 21);
  const rsi14 = calculateRSI(closes);
  const volatility = calculateVolatility(closes);
  const trend = detectTrend(closes);

  return {
    latestPrice: closes[closes.length - 1],
    sma7: sma7[sma7.length - 1],
    sma21: sma21[sma21.length - 1],
    rsi14,
    volatility,
    trend,
  };
}

module.exports = {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateVolatility,
  detectTrend,
  summariseMarket,
};
