// src/services/dex/geckoService.js
const axios = require("axios");
const BASE_URL = "https://api.geckoterminal.com/api/v2";
const COINGECKO_URL = "https://api.coingecko.com/api/v3";

/**
 * Fetch all pools for a given DEX on a chain with pagination
 */
async function fetchAllPoolsForDex(dexId, chain = "eth", maxPages = 5, perPage = 50) {
  let page = 1;
  let allPools = [];
  let hasMore = true;

  while (hasMore && page <= maxPages) {
    try {
      const url = `${BASE_URL}/networks/${chain}/dexes/${dexId}/pools?page=${page}&per_page=${perPage}`;
      const response = await axios.get(url);

      const pools = response.data.data.map((pool) => ({
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

/**
 * Fallback price fetcher from CoinGecko
 */
async function getGeckoPrice(symbol) {
  try {
    if (!symbol) return null;

    const url = `${COINGECKO_URL}/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`;
    const response = await axios.get(url);

    return response.data[symbol.toLowerCase()]?.usd || null;
  } catch (error) {
    console.error(`❌ getGeckoPrice(${symbol}) error:`, error.response?.data || error.message);
    return null;
  }
}

module.exports = { fetchAllPoolsForDex, getGeckoPrice };
