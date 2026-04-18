/**
 * src/index.js
 * Main application entry point.
 *
 * Demonstrates both the cryptocurrency analytics module and the
 * AI video generation module working together.
 *
 * Run with:  node src/index.js
 */

const crypto = require("./crypto-analytics");
const aiVideo = require("./ai-video");

async function main() {
  console.log("=".repeat(60));
  console.log(" Crypto Analytics + AI Video Generation App");
  console.log("=".repeat(60));

  // ── 1. Cryptocurrency analytics ─────────────────────────────────
  console.log("\n[1/2] Cryptocurrency Big-Data Analytics");
  console.log("-".repeat(40));

  await crypto.printMarketOverview(5);

  const report = await crypto.generateReport("BTC", 30);
  console.log(`\nBTC 30-day report:`);
  console.log(`  Current price : $${report.currentPrice.toLocaleString()} USD`);
  console.log(`  7-day SMA     : $${report.sma7.toLocaleString()}`);
  console.log(`  21-day SMA    : $${report.sma21.toLocaleString()}`);
  console.log(`  RSI (14)      : ${report.rsi14}`);
  console.log(`  Volatility    : ${report.volatility}% (annualised)`);
  console.log(`  Trend         : ${report.trend}`);

  // ── 2. AI video generation ───────────────────────────────────────
  console.log("\n[2/2] AI Video Generation");
  console.log("-".repeat(40));

  // Build a scene prompt from structured parameters.
  const prompt = aiVideo.buildScenePrompt({
    subject: "A glowing cryptocurrency trading dashboard",
    action: "displaying live price charts with rising green candles",
    setting: "a sleek futuristic trading floor",
    lighting: "blue neon",
    camera: "slow zoom-in",
    mood: "optimistic",
  });
  console.log(`\nGenerated prompt:\n  "${prompt}"`);

  // Create and run a generation job.
  const job = aiVideo.generateVideo({
    prompt,
    style: "cinematic",
    resolution: "HD",
    duration: 8,
    fps: 30,
  });
  console.log(`\nGeneration job complete:`);
  console.log(`  Job ID     : ${job.id}`);
  console.log(`  Status     : ${job.status}`);
  console.log(`  Output URL : ${job.outputUrl}`);
  console.log(`  Resolution : ${job.resolution}`);
  console.log(`  Duration   : ${job.durationRendered}s @ ${job.fps}fps`);

  // Apply post-processing effects.
  const processed = aiVideo.applyEffects(job.outputUrl, ["color-grade", "sharpen"]);
  console.log(`\nPost-processed output : ${processed.outputUrl}`);

  console.log("\n" + "=".repeat(60));
  console.log(" Done!");
  console.log("=".repeat(60));
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
