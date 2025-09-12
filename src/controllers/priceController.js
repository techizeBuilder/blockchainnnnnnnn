const priceService = require("../services/dex/priceService");

exports.getUniswapPools = async (req, res) => {
  try {
    const { chain = "eth" } = req.query;
    const pools = await priceService.getAllUniswapPools(chain);
    res.json({ chain, total: pools.length, pools });
  } catch (error) {
    console.error("❌ getUniswapPools error:", error.message);
    res.status(500).json({ error: "Failed to fetch Uniswap pools" });
  }
};
