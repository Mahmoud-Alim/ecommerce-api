import { sendError } from "../utils/apiResponse.js";
import asyncHandler from "express-async-handler";
import Order from "../models/order.js";

export const requireSelfOrAdmin = (req, res, next) => {
  const requester = req.auth?.userId;
  if (!requester) return sendError(res, 401, "Unauthorized");
  if (req.auth?.isAdmin) return next();
  const targetId = req.params.id || req.params.userId;
  if (String(requester) === String(targetId)) return next();
  return sendError(res, 403, "Forbidden: owner-only");
};

export const requireOrderOwnerOrAdmin = asyncHandler(async (req, res, next) => {
  const orderId = req.params.id;
  if (!orderId) return sendError(res, 400, "Order id required");
  const order = await Order.findById(orderId).select("user");
  if (!order) return sendError(res, 404, "Order not found");
  if (req.auth?.isAdmin) return next();
  if (!req.auth?.userId || String(order.user) !== String(req.auth.userId)) {
    return sendError(res, 403, "Forbidden: you can only access your own orders");
  }
  next();
});

