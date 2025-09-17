// src/utils/cache.js
const NodeCache = require("node-cache");

// default TTL 30s, check every 60s
const cache = new NodeCache({ stdTTL: 30, checkperiod: 60 });

module.exports = cache;
