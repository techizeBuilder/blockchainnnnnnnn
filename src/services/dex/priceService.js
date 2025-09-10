const axios = require("axios");

const GECKO_BASE = "https://api.geckoterminal.com/api/v2";

/**
 * Fetch all Ethereum pairs with pagination
 * @param {number} page
 * @param {number} perPage
 */
const getEthereumPairs = async (page = 1, perPage = 20) => {
  try {
    const url = `${GECKO_BASE}/networks/eth/pools?page=${page}&per_page=${perPage}`;

    const { data } = await axios.get(url);

    const pools = data.data.map(pool => ({
      id: pool.id,
      dex: pool.attributes.dex_id,
      token0: pool.attributes.token0_symbol,
      token1: pool.attributes.token1_symbol,
      price: pool.attributes.token0_price_usd,
      volume24h: pool.attributes.volume_usd.h24
    }));

    return {
      page,
      perPage,
      total: data.meta?.total || pools.length,
      pools
    };
  } catch (err) {
    console.error("❌ Error fetching Ethereum pairs:", err.message);
    return { error: "Failed to fetch pairs" };
  }
};

module.exports = { getEthereumPairs };
