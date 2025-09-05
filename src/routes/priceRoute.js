const express = require("express");
const router = express.Router();
const { fetchPrices } = require("../controllers/priceController");

router.get("/", fetchPrices);

module.exports = router;
