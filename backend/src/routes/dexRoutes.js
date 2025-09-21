// src/routes/dexRoutes.js
const express = require("express");
const { getDexListController } = require("../controllers/dexController");

const router = express.Router();

// Example: GET /api/dex/eth
router.get("/:chain", getDexListController);

module.exports = router;
