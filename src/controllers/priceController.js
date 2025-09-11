const priceService = require("../services/dex/priceService");

async function fetchPools(req, res) {
  try {
    const { chain } = req.params;
    const { page = 1 } = req.query;

    const pools = await priceService.getPools(chain, page);
    res.json({ page, pools });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { fetchPools };
