import express from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import Joi from "joi";

const router = express.Router();

const signupSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        "string.min": "Name must be at least 3 characters",
        "any.required": "Name is required"
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Email is not valid",
        "any.required": "Email is required"
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required"
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Email is not valid",
        "any.required": "Email is required"
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required"
    })
});

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

export default router;