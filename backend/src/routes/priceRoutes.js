// src/routes/priceRoutes.js
const express = require("express");
const { getPools } = require("../controllers/priceController");

const router = express.Router();

// GET /api/prices/pools
router.get("/pools", getPools);

module.exports = router;
