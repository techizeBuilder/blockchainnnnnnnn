// src/services/dex/dexService.js
const axios = require("axios");
const dexLogoMap = require("../../utils/dexLogos");

const BASE_URL = "https://api.geckoterminal.com/api/v2";

// fallback generator for unknown DEX logos
function buildLogoUrl(dexName) {
  if (!dexName) return null;
  const cleanName = dexName.toLowerCase().replace(/\s|\(|\)|\./g, "-");
  return `https://cryptologos.cc/logos/${cleanName}-logo.png`;
}

async function fetchDexesForChain(chain = "eth", page = 1, perPage = 50) {
  try {
    const url = `${BASE_URL}/networks/${chain}/dexes?page=${page}&per_page=${perPage}`;
    const response = await axios.get(url);

    return response.data.data.map((dex) => {
      const id = dex.id;
      const name = dex.attributes.name;

      return {
        id,
        name,
        logo: dexLogoMap[id] || buildLogoUrl(name), // manual map → fallback
        chain,
      };
    });
  } catch (error) {
    console.error(`❌ Error fetching DEXes for ${chain}:`, error.response?.data || error.message);
    return [];
  }
}

module.exports = { fetchDexesForChain };
