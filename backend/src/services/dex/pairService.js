// services/pairService.js
const axios = require("axios");

async function fetchPools(chain, pages = 3) {
  let allPools = [];

  for (let i = 1; i <= pages; i++) {
    const url = `https://api.geckoterminal.com/api/v2/networks/${chain}/pools?page=${i}&include=dex`;

    try {
      const res = await axios.get(url);
      if (res.data && res.data.data) {
        allPools = [...allPools, ...res.data.data];
      }
    } catch (err) {
      console.error(`❌ Error fetching page ${i}:`, err.message);
    }
  }

  console.log(`✅ Found ${allPools.length} pools across ${pages} pages`);
  return allPools;
}

async function fetchPairs(chain, showAll = false, pages = 3) {
  const pools = await fetchPools(chain, pages);

  const pairs = {};
  pools.forEach(pool => {
    const attr = pool.attributes || {};
    const baseSymbol = attr.token0_symbol || attr.name?.split("/")[0];
    const quoteSymbol = attr.token1_symbol || attr.name?.split("/")[1];

    if (!baseSymbol || !quoteSymbol) return;

    const pairKey = `${baseSymbol}/${quoteSymbol}`;
    if (!pairs[pairKey]) pairs[pairKey] = [];

    pairs[pairKey].push({
      dex: pool.relationships?.dex?.data?.id || "unknown",
      address: pool.id,
      priceUsd: attr.base_token_price_usd,
      liquidityUsd: attr.reserve_in_usd,
      baseToken: attr.base_token_price_quote_token,
      quoteToken: attr.quote_token_price_base_token,
    });
  });

  let resultPairs = {};
  if (showAll) {
    resultPairs = pairs;
  } else {
    Object.entries(pairs).forEach(([pair, dexList]) => {
      const uniqueDexes = [...new Set(dexList.map(p => p.dex))];
      if (uniqueDexes.length > 1) {
        resultPairs[pair] = dexList;
      }
    });
  }

  console.log(`✅ Returning ${Object.keys(resultPairs).length} pairs`);
  return { chain, pairs: resultPairs };
}

module.exports = { fetchPairs };
