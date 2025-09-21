// src/controllers/poolController.js
const { getAllEthereumPools } = require("../services/dex/priceService");

async function fetchPools(req, res) {
  try {
    const pools = await getAllEthereumPools("eth");
    res.json(pools);
  } catch (err) {
    console.error("❌ fetchPools error:", err.message);
    res.status(500).json({ error: "Failed to fetch pools" });
  }
}

module.exports = { fetchPools };
