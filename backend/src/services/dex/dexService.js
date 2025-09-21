const axios = require("axios");
const BASE_URL = "https://api.geckoterminal.com/api/v2";

const dexLogoMap = {
  uniswap_v2: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
  sushiswap: "https://cryptologos.cc/logos/sushiswap-sushi-logo.png",
  curve: "https://cryptologos.cc/logos/curve-dao-token-crv-logo.png",
  balancer_ethereum: "https://cryptologos.cc/logos/balancer-bal-logo.png",
};

async function fetchDexesForChain(chain = "eth", page = 1, perPage = 50) {
  try {
    const url = `${BASE_URL}/networks/${chain}/dexes?page=${page}&per_page=${perPage}`;
    const response = await axios.get(url);

    return response.data.data.map((dex) => ({
      id: dex.id,
      name: dex.attributes.name,
      logo: dexLogoMap[dex.id] || null, // fallback
      chain: chain,
    }));
  } catch (error) {
    console.error(`❌ Error fetching DEXes for ${chain}:`, error.response?.data || error.message);
    return [];
  }
}

module.exports = { fetchDexesForChain };