const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d' 
  });
};

// @desc    Register user
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role 
  });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.status(200).json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Get current user profile
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user
  });
});

module.exports = { register, login, getMe };