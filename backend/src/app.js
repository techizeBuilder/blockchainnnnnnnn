const express = require("express");
const cors = require("cors"); // ✅ import cors
const userRoutes = require('./routes/userRoutes');
const priceRoutes = require("./routes/priceRoutes");
const tokenPriceRoutes = require("./routes/tokenPriceRoutes");

const app = express();

// ✅ Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://blockchainfrontend-ten.vercel.app/", // your frontend
    credentials: true, // allow cookies/authorization headers
  })
);

// Middleware
app.use(express.json());

// Base route
app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

// Routes
app.use('/api/users', userRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/tokens", tokenPriceRoutes);

module.exports = app;
