// src/controllers/priceController.js
const { getAllEthereumPools } = require("../services/dex/priceService");

async function getPools(req, res) {
  try {
    const pools = await getAllEthereumPools("eth");
    res.json({ pools, count: pools.length });
  } catch (err) {
    console.error("❌ getPools error:", err.message);
    res.status(500).json({ error: "Failed to fetch pools" });
  }
}

module.exports = { getPools };
