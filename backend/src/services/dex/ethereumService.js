const axios = require("axios");

const API_URL = "https://open-api.dextools.io/free/v2/pool";

// ⚡ Fetch Ethereum pools (example search)
async function fetchEthereumPools(query = "WETH") {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: {
        chain: "ether",   // Ethereum mainnet
        query,
      },
      headers: {
        accept: "application/json",
      },
    });

    // Format pools data
    return response.data.data?.map((pool) => ({
      id: pool.address,
      name: pool.baseToken.symbol + "/" + pool.quoteToken.symbol,
      baseToken: pool.baseToken.symbol,
      quoteToken: pool.quoteToken.symbol,
      dex: pool.dex?.name || "unknown",
      liquidityUsd: pool.liquidity?.usd || null,
      volume24h: pool.volume?.h24?.usd || null,
      priceUsd: pool.price?.usd || null,
    })) || [];
  } catch (err) {
    console.error("❌ fetchEthereumPools error:", err.response?.data || err.message);
    return [];
  }
}

module.exports = { fetchEthereumPools };
