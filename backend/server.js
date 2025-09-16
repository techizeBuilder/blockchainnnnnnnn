require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./src/app");
const { startDexscreenerWS } = require("./src/services/dex/priceService");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);

      // 🔥 Start Dexscreener WebSocket for Ethereum (can extend to more chains later)
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
