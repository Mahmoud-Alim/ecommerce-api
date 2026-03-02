import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import xss from "xss-clean";
import { globalErrorHandler } from "./middlewares/error.middleware.js";

process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION! Shutting down...");
    console.error(err.name, err.message);
    process.exit(1);
});

import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { success: false, message: "Too many requests, please try again late" }
});
app.use("/api", limiter);

app.use(helmet());                
app.use(mongoSanitize());         
app.use(hpp());                   
app.use(xss());                   
app.use(cors());                  
app.use(morgan("dev"));           
app.use(express.json({ limit: '10kb' })); 

mongoose.connect(MONGO_URI)
  .then(() => console.log("Database Connected & Secured"))
  .catch(err => {
      console.error("Database Connection Error:", err.message);
      process.exit(1);
  });

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

app.use("*", (req, res) => {
    res.status(404).json({ success: false, message: "This route does not exist" });
});

app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION! Shutting down...");
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});