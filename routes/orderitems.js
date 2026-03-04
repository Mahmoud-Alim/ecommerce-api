import express from "express";
import OrderItem from "../models/orderitems.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const orderItemsList = await OrderItem.find().populate("product");
    if (!orderItemsList) {
      return res.status(500).json({ success: false });
    }
    res.status(200).send(orderItemsList);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    let orderItem = new OrderItem({
      quantity: req.body.quantity,
      product: req.body.product,
    });
    orderItem = await orderItem.save();

    if (!orderItem) return res.status(400).send("the order item cannot be created!");

    res.send(orderItem);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

export default router;
