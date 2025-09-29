// controllers/pairController.js
const { fetchPairs } = require("../services/dex/pairService");

async function getPairs(req, res) {
  try {
    const { chain } = req.params;
    const { all, pages } = req.query;

    if (!chain) {
      return res.status(400).json({ error: "Missing chain parameter" });
    }

    const showAll = all === "true";
    const numPages = pages ? parseInt(pages, 10) : 3;

    const data = await fetchPairs(chain, showAll, numPages);

    res.json(data);
  } catch (err) {
    console.error("❌ Error in getPairs controller:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getPairs };
