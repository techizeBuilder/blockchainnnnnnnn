const express = require("express");
const router = express.Router();
const { getPairs } = require("../controllers/pairController.js");

// GET /pairs/:chain → fetch top pairs for a chain (ex: ethereum, bsc, polygon)

// GET /pairs/eth?limit=10
router.get("/:chain", getPairs);
module.exports = router;

