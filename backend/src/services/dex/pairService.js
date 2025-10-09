// services/pairService.js
const axios = require("axios");

// Fetch multiple pages of pools from GeckoTerminal
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

// Calculate price difference between min & max across DEXs
function calculatePriceDiff(dexList) {
  if (dexList.length < 2) return 0;
  const prices = dexList.map(d => parseFloat(d.priceUsd)).filter(Boolean);
  if (prices.length < 2) return 0;

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return ((max - min) / min) * 100; // % difference
}

// Build pairs with arbitrage data
async function fetchPairs(chain, showAll = false, pages = 3, limit = 10) {
  const pools = await fetchPools(chain, pages);

  const pairs = {};
  pools.forEach(pool => {
    const attr = pool.attributes || {};
    const baseSymbol = attr.token0_symbol || attr.name?.split("/")[0];
    const quoteSymbol = attr.token1_symbol || attr.name?.split("/")[1];

    if (!baseSymbol || !quoteSymbol) return;

    const pairKey = `${baseSymbol} / ${quoteSymbol}`;
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
  Object.entries(pairs).forEach(([pair, dexList]) => {
    const uniqueDexes = [...new Set(dexList.map(p => p.dex))];

    if (showAll || uniqueDexes.length > 1) {
      resultPairs[pair] = {
        opportunities: dexList.sort((a, b) => b.liquidityUsd - a.liquidityUsd),
        priceDiff: calculatePriceDiff(dexList),
      };
    }
  });

  // Sort by priceDiff and limit results
  const sortedEntries = Object.entries(resultPairs)
    .sort(([, a], [, b]) => b.priceDiff - a.priceDiff)
    .slice(0, limit);

  const finalPairs = Object.fromEntries(sortedEntries);

  console.log(`✅ Returning ${Object.keys(finalPairs).length} pairs`);
  return { chain, pairs: finalPairs };
}

module.exports = { fetchPairs };
