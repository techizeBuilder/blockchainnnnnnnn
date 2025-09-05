const { getPrices } = require("../services/priceService");

const fetchPrices = async (req, res, next) => {
  try {
    const prices = await getPrices();
    res.json({
      success: true,
      pair: "ETH/USDT",
      prices
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { fetchPrices };
