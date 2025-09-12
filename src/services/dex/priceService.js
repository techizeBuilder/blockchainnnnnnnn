const axios = require("axios");

const BASE_URL = "https://api.geckoterminal.com/api/v2";

// Fetch all pages for one Uniswap version
async function fetchAllPoolsForDex(dexId, chain = "eth") {
  let page = 1;
  let allPools = [];
  let hasMore = true;

  while (hasMore) {
    try {
      const url = `${BASE_URL}/networks/${chain}/dexes/${dexId}/pools?page=${page}`;
      const response = await axios.get(url);

      const pools = response.data.data.map(pool => ({
        id: pool.id,
        address: pool.attributes.address,
        name: pool.attributes.name,
        dex: dexId,
        baseToken: pool.attributes.token0_symbol,
        quoteToken: pool.attributes.token1_symbol,
        priceUsd: pool.attributes.price_usd,
        liquidityUsd: pool.attributes.reserve_in_usd,
        volume24h: pool.attributes.volume_usd?.h24,
      }));

      allPools = [...allPools, ...pools];

      // Check if more pages exist
      const pagination = response.data.meta?.pagination;
      if (pagination && pagination.has_next_page) {
        page++;
      } else {
        hasMore = false;
      }
    } catch (error) {
      console.error(`❌ fetchAllPoolsForDex(${dexId}) page ${page} error:`, error.response?.data || error.message);
      hasMore = false;
    }
  }

  return allPools;
}

// Fetch all Uniswap pools (v2, v3, v4)
async function getAllUniswapPools(chain = "eth") {
  const dexIds = ["uniswap_v2", "uniswap_v3", "uniswap_v4"];

  const results = await Promise.all(dexIds.map(dexId => fetchAllPoolsForDex(dexId, chain)));

  return results.flat();
}

module.exports = {
  getAllUniswapPools,
};
