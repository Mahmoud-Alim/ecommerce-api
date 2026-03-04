import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./routes/product.js";
import categoriesRoutes from "./routes/categories.js";
import usersRoutes from "./routes/users.js";
import ordersRoutes from "./routes/orders.js";
import orderItemsRoutes from "./routes/orderitems.js";

dotenv.config();

const app = express();

app.use(cors());
app.options("*", cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/orderitems", orderItemsRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});