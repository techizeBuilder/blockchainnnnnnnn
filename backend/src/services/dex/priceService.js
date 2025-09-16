// src/services/dex/priceService.js
const { fetchAllPoolsForDex } = require("./geckoService");
const { enrichWithDexscreenerPrices } = require("./dexScreenerService");
const cache = require("../../utils/cache");

/**
 * Filter pools to only include those with full data
 */
function filterFullDataPools(pools) {
  return pools.filter(
    (pool) =>
      pool.priceUsd !== undefined &&
      pool.liquidityUsd !== undefined &&
      pool.volume24h !== undefined
  );
}

/**
 * Get all Ethereum pools from multiple DEXs
 */
async function getAllEthereumPools(chain = "eth") {
  const cacheKey = `allPools:${chain}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log("⚡ Returning cached data");
    return cached;
  }

  console.log("⏳ Fetching fresh data from Gecko + Dexscreener...");

  const dexIds = [
    "uniswap",
    "sushiswap",
    "curve",
    "balancer",
    "shibaswap",
    "dodo",
    "kyberswap",
  ];

  // Fetch from Gecko in parallel with error resilience
  const results = await Promise.allSettled(
    dexIds.map((dexId) => fetchAllPoolsForDex(dexId, chain))
  );

  let pools = results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => r.value);

  // Enrich with DexScreener prices (real-time)
  const poolsWithPrices = await enrichWithDexscreenerPrices(pools, "ethereum");

  // ✅ Filter only complete pools
  const completePools = filterFullDataPools(poolsWithPrices);

  // Save to cache
  cache.set(cacheKey, completePools, 60); // TTL 60s

  return completePools;
}

module.exports = {
  getAllEthereumPools,
};
