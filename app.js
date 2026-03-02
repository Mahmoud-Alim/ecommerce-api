import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import { xss } from "express-xss-sanitizer";
import cookieParser from "cookie-parser";
import { doubleCsrf } from "csrf-csrf";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";

dotenv.config();

process.on("uncaughtException", (err) => {
    process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const {
    generateToken,
    doubleCsrfProtection,
} = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || "super-secret-key",
    cookieName: "x-csrf-token",
    cookieOptions: {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
    },
    getTokenFromRequest: (req) => req.headers["x-csrf-token"],
});

app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET || "cookie-secret"));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({
    whitelist: ['price', 'ratingsAverage', 'ratingsQuantity', 'duration', 'difficulty', 'category']
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests, please try again later" }
});
app.use("/api", limiter);

app.get("/api/get-csrf-token", (req, res) => {
    const token = generateToken(req, res);
    res.json({ success: true, csrfToken: token });
});

app.use(doubleCsrfProtection);

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

app.all("*", (req, res) => {
    res.status(404).json({ success: false, message: "This route does not exist" });
});

app.use(globalErrorHandler);

mongoose.connect(MONGO_URI)
    .then(() => console.log("Database Connected & Secured"))
    .catch(err => {
        process.exit(1);
    });

const server = app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err) => {
    server.close(() => process.exit(1));
});