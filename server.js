require("dotenv").config();
const http = require("http");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const pinoHttp = require("pino-http");

const connectDB = require("./src/config/db");
const logger = require("./src/config/logger");

const API_PREFIX = process.env.API_PREFIX || "/api/v1";
const PORT = process.env.PORT || 4000;

const app = express();

// Security
app.use(helmet());

// CORS
const allowed = (process.env.CORS_ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: allowed.length ? allowed : true }));

// Rate limiter (tune later)
app.use(rateLimit({ windowMs: 10 * 1000, max: 200, standardHeaders: true }));
app.use(`${API_PREFIX}/prices`, require("./src/routes/priceRoute"));

// Logging
app.use(pinoHttp({ logger }));

// JSON
app.use(express.json({ limit: "100kb" }));

// Health & Ready
app.get("/healthz", (req, res) => res.status(200).json({ status: "ok" }));
app.get("/readyz", (req, res) => res.status(200).json({ ready: true }));

// Routes (test)
app.use(`${API_PREFIX}/test`, require("./src/routes/testRoute"));

// Error handler (simple)
app.use((err, req, res, next) => {
  logger.error({ err, url: req.originalUrl }, "Unhandled error");
  const status = err.status || 500;
  const message = process.env.NODE_ENV === "production" && status === 500 ? "Internal server error" : err.message;
  res.status(status).json({ success: false, error: message });
});

// Start: connect DB then listen
const server = http.createServer(app);

const start = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => logger.info(`Server listening on ${PORT}`));
  } catch (err) {
    logger.error({ err }, "Startup failed");
    process.exit(1);
  }
};

start();

// Graceful shutdown
const graceful = (signal) => {
  logger.info(`Received ${signal}. Shutting down...`);
  server.close(() => {
    const mongoose = require("mongoose");
    mongoose.connection.close(false, () => {
      logger.info("MongoDB connection closed");
      process.exit(0);
    });
  });

  setTimeout(() => {
    logger.error("Force exit");
    process.exit(1);
  }, 30000);
};

process.on("SIGINT", () => graceful("SIGINT"));
process.on("SIGTERM", () => graceful("SIGTERM"));
