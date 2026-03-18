import express from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getTotalSales,
  getOrderCount,
  getUserOrders,
} from "../controllers/orderController.js";
import { validateOrderId, validateUserId } from "../middlewares/validationMiddleware.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import { orderSchema, updateOrderStatusSchema } from "../validations/orderValidation.js";
import { requireOrderOwnerOrAdmin, requireSelfOrAdmin } from "../middlewares/authorization.js";

const router = express.Router();

router.get("/", requireAdmin, getOrders);
router.get("/total-sales", requireAdmin, getTotalSales);
router.get("/count", requireAdmin, getOrderCount);
router.put("/:id", requireAdmin, validateOrderId, validateRequest(updateOrderStatusSchema), updateOrder);
router.delete("/:id", requireAdmin, validateOrderId, deleteOrder);

router.get("/user-orders/:userId", validateUserId, requireSelfOrAdmin, getUserOrders);
router.get("/:id", validateOrderId, requireOrderOwnerOrAdmin, getOrderById);
router.post("/", validateRequest(orderSchema), createOrder);

export default router;
