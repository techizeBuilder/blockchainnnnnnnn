// src/routes/poolRoutes.js
const express = require("express");
const { fetchPools } = require("../controllers/priceController");

const router = express.Router();

router.get("/ethereum", fetchPools);

module.exports = router;
