/**
 * src/tests/crypto-analytics.test.js
 * Unit tests for the cryptocurrency analytics module.
 * Uses Node.js built-in test runner (node --test).
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateVolatility,
  detectTrend,
  summariseMarket,
} = require("../crypto-analytics/analyzer");

const {
  fetchPrice,
  fetchHistoricalData,
  fetchTopCoins,
} = require("../crypto-analytics/dataFetcher");

// ── calculateSMA ─────────────────────────────────────────────────────────────

describe("calculateSMA", () => {
  it("returns correct SMA for a simple series", () => {
    const prices = [1, 2, 3, 4, 5];
    const result = calculateSMA(prices, 3);
    assert.deepEqual(result, [2, 3, 4]);
  });

  it("returns single value when period equals array length", () => {
    const prices = [10, 20, 30];
    const result = calculateSMA(prices, 3);
    assert.deepEqual(result, [20]);
  });

  it("throws when not enough data points", () => {
    assert.throws(
      () => calculateSMA([1, 2], 5),
      /Need at least 5 prices/
    );
  });

  it("throws for non-array input", () => {
    assert.throws(
      () => calculateSMA("not-an-array", 3),
      /Need at least 3 prices/
    );
  });
});

// ── calculateEMA ─────────────────────────────────────────────────────────────

describe("calculateEMA", () => {
  it("returns the same length array as input", () => {
    const prices = [10, 12, 14, 13, 15];
    const ema = calculateEMA(prices, 3);
    assert.equal(ema.length, prices.length);
  });

  it("first EMA value equals first price", () => {
    const prices = [100, 110, 105];
    const ema = calculateEMA(prices, 3);
    assert.equal(ema[0], 100);
  });

  it("throws when not enough data", () => {
    assert.throws(
      () => calculateEMA([1], 5),
      /Need at least 5 prices/
    );
  });
});

// ── calculateRSI ─────────────────────────────────────────────────────────────

describe("calculateRSI", () => {
  it("returns a value between 0 and 100", () => {
    const prices = Array.from({ length: 20 }, (_, i) => 100 + i);
    const rsi = calculateRSI(prices, 14);
    assert.ok(rsi >= 0 && rsi <= 100, `RSI ${rsi} out of range`);
  });

  it("returns 100 when there are no losses", () => {
    // Strictly increasing prices → no losses.
    const prices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const rsi = calculateRSI(prices, 14);
    assert.equal(rsi, 100);
  });

  it("throws when insufficient data", () => {
    assert.throws(
      () => calculateRSI([1, 2], 14),
      /Need at least 15 prices/
    );
  });
});

// ── calculateVolatility ───────────────────────────────────────────────────────

describe("calculateVolatility", () => {
  it("returns a positive number for varying prices", () => {
    const prices = [100, 102, 98, 105, 99, 103];
    const vol = calculateVolatility(prices);
    assert.ok(vol > 0, "Volatility should be positive");
  });

  it("throws with fewer than 2 prices", () => {
    assert.throws(
      () => calculateVolatility([100]),
      /Need at least 2 prices/
    );
  });
});

// ── detectTrend ───────────────────────────────────────────────────────────────

describe("detectTrend", () => {
  it('returns "bullish" for a rising price series', () => {
    // 30 strictly increasing prices → short SMA > long SMA.
    const prices = Array.from({ length: 30 }, (_, i) => 100 + i * 2);
    assert.equal(detectTrend(prices), "bullish");
  });

  it('returns "bearish" for a falling price series', () => {
    const prices = Array.from({ length: 30 }, (_, i) => 500 - i * 5);
    assert.equal(detectTrend(prices), "bearish");
  });

  it('returns "sideways" for a flat price series', () => {
    const prices = Array.from({ length: 30 }, () => 100);
    assert.equal(detectTrend(prices), "sideways");
  });
});

// ── summariseMarket ────────────────────────────────────────────────────────────

describe("summariseMarket", () => {
  it("returns expected keys", () => {
    const candles = Array.from({ length: 25 }, (_, i) => ({ close: 100 + i }));
    const summary = summariseMarket(candles);
    assert.ok("latestPrice" in summary);
    assert.ok("sma7" in summary);
    assert.ok("sma21" in summary);
    assert.ok("rsi14" in summary);
    assert.ok("volatility" in summary);
    assert.ok("trend" in summary);
  });
});

// ── fetchPrice ────────────────────────────────────────────────────────────────

describe("fetchPrice", () => {
  it("returns price data for BTC", async () => {
    const data = await fetchPrice("BTC");
    assert.equal(data.symbol, "BTC");
    assert.ok(typeof data.price === "number" && data.price > 0);
    assert.equal(data.currency, "USD");
  });

  it("is case-insensitive for symbols", async () => {
    const data = await fetchPrice("eth");
    assert.equal(data.symbol, "ETH");
  });

  it("throws for unknown symbol", async () => {
    await assert.rejects(fetchPrice("UNKNOWN"), /Unknown symbol/);
  });
});

// ── fetchHistoricalData ────────────────────────────────────────────────────────

describe("fetchHistoricalData", () => {
  it("returns the requested number of candles", async () => {
    const data = await fetchHistoricalData("BTC", 7);
    assert.equal(data.length, 7);
  });

  it("each candle has the required OHLCV fields", async () => {
    const [candle] = await fetchHistoricalData("ETH", 1);
    ["date", "open", "high", "low", "close", "volume"].forEach((key) => {
      assert.ok(key in candle, `Missing field: ${key}`);
    });
  });

  it("high >= close and low <= close", async () => {
    const candles = await fetchHistoricalData("BTC", 5);
    for (const c of candles) {
      assert.ok(c.high >= c.close, `high(${c.high}) < close(${c.close})`);
      assert.ok(c.low <= c.close, `low(${c.low}) > close(${c.close})`);
    }
  });
});

// ── fetchTopCoins ─────────────────────────────────────────────────────────────

describe("fetchTopCoins", () => {
  it("returns the correct number of coins", async () => {
    const coins = await fetchTopCoins(3);
    assert.equal(coins.length, 3);
  });

  it("coins are ranked starting from 1", async () => {
    const coins = await fetchTopCoins(5);
    assert.equal(coins[0].rank, 1);
    assert.equal(coins[4].rank, 5);
  });
});
