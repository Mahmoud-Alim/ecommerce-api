import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import logger from "./utils/logger.js";

// Fail fast if required production environment variables are missing
const requiredInProd = ["MONGO_URI", "JWT_SECRET", "SESSION_SECRET", "COOKIE_PARSER_SECRET"];
if (process.env.NODE_ENV === "production") {
  for (const key of requiredInProd) {
    if (!process.env[key]) {
      logger.error(`Missing required environment variable: ${key}`);
      process.exit(1);
    }
  }
}

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => logger.info("MongoDB connected successfully"))
  .catch((err) => {
    logger.error("MongoDB connection error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});

server.keepAliveTimeout = 5000;
server.headersTimeout = 10000;

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received — shutting down gracefully...`);
  server.close(async () => {
    logger.info("HTTP server closed.");
    await mongoose.connection.close(false);
    logger.info("MongoDB connection closed.");
    process.exit(0);
  });
  setTimeout(() => {
    logger.error("Graceful shutdown timed out — forcing exit.");
    process.exit(1);
  }, 10_000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.error("UNHANDLED REJECTION:", reason);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});
