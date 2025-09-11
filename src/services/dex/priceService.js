const axios = require("axios");

const GECKO_BASE_URL = "https://api.geckoterminal.com/api/v2";

// Map chain names to GeckoTerminal network IDs
const CHAIN_MAP = {
  ethereum: "eth",
  polygon: "polygon",
  bsc: "bsc",
  avalanche: "avax",
  fantom: "ftm",
};

async function getPools(chain, page = 1) {
  try {
    const network = CHAIN_MAP[chain.toLowerCase()];
    if (!network) throw new Error(`Unsupported chain: ${chain}`);

    const url = `${GECKO_BASE_URL}/networks/${network}/pools?page=${page}`;

    const { data } = await axios.get(url);

    const pools = data.data.map((pool) => ({
      id: pool.id,
      address: pool.attributes.address,
      name: pool.attributes.name,
      baseToken: pool.attributes.token0,
      quoteToken: pool.attributes.token1,
      priceUsd: pool.attributes.token0_price_usd,
      liquidityUsd: pool.attributes.reserve_in_usd,
      volume24h: pool.attributes.volume_usd.h24,
    }));

    return pools;
  } catch (err) {
    console.error("❌ getPools error:", err.message);
    throw new Error("Failed to fetch pools");
  }
}

module.exports = { getPools };
