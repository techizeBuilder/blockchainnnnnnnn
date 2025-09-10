const { getEthereumPairs } = require("../services/dex/priceService");

const fetchEthereumPairs = async (req, res) => {
  try {
    const { page = 1, perPage = 10 } = req.query;

    const result = await getEthereumPairs(page, perPage);

    res.json(result);
  } catch (err) {
    console.error("fetchEthereumPairs error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { fetchEthereumPairs };
