const mongoose = require("mongoose");
const logger = require("./logger");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    logger.error("MONGO_URI is not set");
    throw new Error("MONGO_URI not configured");
  }

  const opts = {
    maxPoolSize: 50,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000
  };

  mongoose.connection.on("connected", () => logger.info("MongoDB connected"));
  mongoose.connection.on("reconnected", () => logger.info("MongoDB reconnected"));
  mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));
  mongoose.connection.on("error", (err) => logger.error({ err }, "MongoDB error"));

  await mongoose.connect(uri, opts);
  logger.info("✅ MongoDB connection established");
};

module.exports = connectDB;
