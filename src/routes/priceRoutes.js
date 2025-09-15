const express = require("express");
const router = express.Router();
const { getPools } = require("../controllers/priceController");

// GET /api/prices/pools?chain=eth
router.get("/pools", getPools);

module.exports = router;
