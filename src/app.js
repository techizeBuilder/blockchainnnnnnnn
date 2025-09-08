const express = require("express");
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());

// Base route
app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

// Routes
app.use('/api/users', userRoutes);

module.exports = app;
