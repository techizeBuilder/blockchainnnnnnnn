// src/routes/priceRoutes.js
const express = require("express");
const router = express.Router();
const priceController = require("../controllers/priceController");

router.get("/uniswap-pools", priceController.getUniswapPools);

module.exports = router;
