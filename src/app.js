const express = require("express");
const userRoutes = require('./routes/userRoutes');
const ethereumRoutes = require("./routes/priceRoutes");

const app = express();

// Middleware
app.use(express.json());

// Base route
app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

// Routes
app.use('/api/users', userRoutes);

app.use("/api/ethereum", ethereumRoutes);

module.exports = app;
