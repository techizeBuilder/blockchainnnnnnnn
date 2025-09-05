// src/services/price.service.js
const axios = require("axios");

/**
 * Fetch ETH/USDT price from Binance
 */
const getBinancePrice = async () => {
  try {
    const url = "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT";
    const { data } = await axios.get(url);
    return parseFloat(data.price);
  } catch (err) {
    console.error("❌ Binance price fetch error:", err.message);
    return null;
  }
};

/**
 * Fetch ETH/USDC price from Uniswap V3
 */
const getUniswapPrice = async () => {
  try {
    const url = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";
    const query = {
      query: `
        {
          pool(id: "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8") {
            token0Price
          }
        }
      `,
    };

    const { data } = await axios.post(url, query);

    if (data?.data?.pool?.token0Price) {
      return parseFloat(data.data.pool.token0Price);
    }
    return null;
  } catch (err) {
    console.error("❌ Uniswap price fetch error:", err.message);
    return null;
  }
};

/**
 * Fetch arbitrage prices across DEX & CEX
 */
const getArbitragePrices = async () => {
  const [binance, uniswap] = await Promise.all([
    getBinancePrice(),
    getUniswapPrice(),
  ]);

  return {
    pair: "ETH/USDT",
    prices: { binance, uniswap },
  };
};

module.exports = {
  getArbitragePrices,
};
const getPrices = async () => {
  const [binancePrice, uniswapPrice] = await Promise.all([
    getBinancePrice(),
    getUniswapPrice(),
  ]);

  return {
    binance: binancePrice,
    uniswap: uniswapPrice,
  };
}