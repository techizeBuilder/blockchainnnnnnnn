// src/controllers/dexController.js
const { fetchDexesForChain } = require("../services/dex/dexService");

async function getDexListController(req, res) {
  try {
    const { chain } = req.params; // e.g., "eth"
    const dexes = await fetchDexesForChain(chain);

    if (!dexes.length) {
      return res.status(404).json({ error: `No DEXs found for chain: ${chain}` });
    }

    res.json({ chain, dexes });
  } catch (error) {
    console.error("❌ Error in getDexListController:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { getDexListController };
