const express = require("express");
const userRoutes = require('./routes/userRoutes');
const priceRoutes = require("./routes/priceRoutes");
const tokenPriceRoutes = require("./routes/tokenPriceRoutes");

const app = express();

// Middleware
app.use(express.json());

// Base route
app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

// Routes
app.use('/api/users', userRoutes);

app.use("/api/prices", priceRoutes);   // <-- this is what enables /api/pools

module.exports = app;
