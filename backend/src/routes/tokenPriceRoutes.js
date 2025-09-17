const express = require("express");
const { getPoolPriceController } = require("../controllers/tokenPriceController");
const router = express.Router();

router.get("/pool-price", getPoolPriceController);

module.exports = router;
