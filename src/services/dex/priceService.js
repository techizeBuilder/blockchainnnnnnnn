const { fetchAllPoolsForDex } = require("./geckoService");
const { enrichWithDexscreenerPrices } = require("./dexScreenerService");

async function getAllUniswapPools(chain = "eth") {
  const dexIds = ["uniswap_v2", "uniswap_v3"]; // remove v4 if not supported
  const results = await Promise.all(dexIds.map(dexId => fetchAllPoolsForDex(dexId, chain)));

  const pools = results.flat();

  // enrich with Dexscreener
  const poolsWithPrices = await enrichWithDexscreenerPrices(pools, "ethereum");
  return poolsWithPrices;
}

module.exports = { getAllUniswapPools };
