const axios = require("axios");

async function enrichWithDexscreenerPrices(pools, chain = "ethereum") {
  try {
    const addresses = pools.map(p => p.address).slice(0, 30); // limit batch
    if (addresses.length === 0) return pools;

    const url = `https://api.dexscreener.com/latest/dex/pairs/${chain}/${addresses.join(",")}`;
    const response = await axios.get(url);

    const priceMap = {};
    response.data.pairs?.forEach(pair => {
      priceMap[pair.pairAddress.toLowerCase()] = {
        priceUsd: pair.priceUsd,
        liquidityUsd: pair.liquidity?.usd,
        volume24h: pair.volume?.h24,
      };
    });

    return pools.map(pool => ({
      ...pool,
      ...priceMap[pool.address.toLowerCase()],
    }));
  } catch (err) {
    console.error("❌ enrichWithDexscreenerPrices error:", err.message);
    return pools;
  }
}

module.exports = { enrichWithDexscreenerPrices };
