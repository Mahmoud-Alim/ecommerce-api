import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "90d",
    });
};

export const signup = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ success: false, message: "Email is already used" });
    }

    const newUser = await User.create({
        name,
        email,
        password,
        role: "user",
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        success: true,
        token,
        data: { user: { id: newUser._id, name: newUser.name, email: newUser.email } }
    });
});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: "Email or password is not correct" });
    }

    const token = signToken(user._id);

    res.status(200).json({
        success: true,
        token
    });
});