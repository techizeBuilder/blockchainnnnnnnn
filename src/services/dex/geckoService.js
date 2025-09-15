const axios = require("axios");
const BASE_URL = "https://api.geckoterminal.com/api/v2";

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
      }));

      allPools.push(...pools);

      const pagination = response.data.meta?.pagination;
      hasMore = pagination?.has_next_page || false;
      page++;
    } catch (error) {
      console.error(`❌ fetchAllPoolsForDex(${dexId}) error:`, error.response?.data || error.message);
      hasMore = false;
    }
  }
  return allPools;
}

module.exports = { fetchAllPoolsForDex };
