import asyncHandler from "express-async-handler";
import { sendSuccess } from "../utils/apiResponse.js";
import * as orderService from "../services/orderService.js";

export const getOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getAllOrders(req.query);
  return sendSuccess(res, 200, "Orders retrieved successfully", result);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  // Owner or admin check
  if (!req.auth.isAdmin && String(order.user?._id ?? order.user) !== String(req.auth.userId)) {
    return res.status(403).json({ success: false, message: "Forbidden: You can only view your own orders." });
  }
  return sendSuccess(res, 200, "Order retrieved successfully", order);
});

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.auth.userId);
  return sendSuccess(res, 201, "Order created successfully", order);
});

export const updateOrder = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrder(req.params.id, req.body.status);
  return sendSuccess(res, 200, "Order updated successfully", order);
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const result = await orderService.deleteOrder(req.params.id);
  return sendSuccess(res, 200, "Order deleted successfully", result);
});

export const getTotalSales = asyncHandler(async (req, res) => {
  const totalSales = await orderService.getTotalSales();
  return sendSuccess(res, 200, "Total sales retrieved successfully", totalSales);
});

export const getOrderCount = asyncHandler(async (req, res) => {
  const count = await orderService.getOrderCount();
  return sendSuccess(res, 200, "Order count retrieved successfully", count);
});

export const getUserOrders = asyncHandler(async (req, res) => {
  if (!req.auth.isAdmin && req.auth.userId !== req.params.userId) {
    return res.status(403).json({ success: false, message: "Forbidden: You can only view your own orders." });
  }
  const orders = await orderService.getUserOrders(req.params.userId);
  return sendSuccess(res, 200, "User orders retrieved successfully", orders);
});
