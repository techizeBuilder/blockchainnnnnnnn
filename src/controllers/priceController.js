const { getAllUniswapPools } = require("../services/dex/priceService");

async function getPools(req, res) {
  try {
    // Default chain = ethereum, but allow query param ?chain=eth
    const chain = req.query.chain || "eth";
    const pools = await getAllUniswapPools(chain);

    return res.status(200).json({
      success: true,
      count: pools.length,
      data: pools,
    });
  } catch (error) {
    console.error("❌ getPools error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pools",
    });
  }
}

module.exports = { getPools };
