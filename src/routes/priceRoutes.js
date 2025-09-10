const express = require("express");
const { fetchEthereumPairs } = require("../controllers/priceController");

const router = express.Router();

// GET -> fetch all pairs (paginated)
router.get("/pairs", fetchEthereumPairs);

module.exports = router;
