const mongoose = require("mongoose");

const testEndpoint = async (req, res, next) => {
  try {
    // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
    const mongoState = mongoose.connection.readyState;
    res.json({ success: true, mongoState });
  } catch (err) {
    next(err);
  }
};

module.exports = { testEndpoint };
