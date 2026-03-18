import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  userLogin,
  registerUser,
  getUserCount,
} from "../controllers/userController.js";
import { validateUserId } from "../middlewares/validationMiddleware.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import { registerSchema, loginSchema, updateUserSchema } from "../validations/userValidation.js";
import { requireSelfOrAdmin } from "../middlewares/authorization.js";

const router = express.Router();

router.post("/login", validateRequest(loginSchema), userLogin);
router.post("/register", validateRequest(registerSchema), registerUser);

router.get("/", requireAdmin, getUsers);
router.post("/", requireAdmin, validateRequest(registerSchema), createUser);
router.get("/count", requireAdmin, getUserCount);

router.get("/:id", validateUserId, requireSelfOrAdmin, getUserById);
router.put("/:id", validateUserId, requireSelfOrAdmin, validateRequest(updateUserSchema), updateUser);
router.delete("/:id", requireAdmin, validateUserId, deleteUser);

export default router;
