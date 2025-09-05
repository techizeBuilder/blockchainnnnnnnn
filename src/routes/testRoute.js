const express = require("express");
const router = express.Router();
const { testEndpoint } = require("../controllers/testController");

router.get("/", testEndpoint);

module.exports = router;
