const { getPoolPrice } = require("../services/dex/multiChainPoolPrice");

exports.getPoolPriceController = async (req, res) => {
  try {
    const { chain, poolAddress } = req.query;
    if (!chain || !poolAddress) {
      return res.status(400).json({ error: "chain and poolAddress are required" });
    }

    const price = await getPoolPrice(chain, poolAddress);
    res.json(price);
  } catch (err) {
    console.error("❌ getPoolPriceController error:", err.message);
    res.status(500).json({ error: "Failed to fetch pool price" });
  }
};
