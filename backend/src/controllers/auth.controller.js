import { User } from '../models/User.js';
import { hashPassword, comparePassword, signToken } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    passwordHash: hashedPassword,
    role: role || 'hr',
  });

  const token = signToken(user._id);

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };

  sendSuccess(res, userData, 'User registered successfully', 201);
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user by email (+passwordHash since it is select: false)
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await comparePassword(password, user.passwordHash);

  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken(user._id);

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };

  sendSuccess(res, userData, 'Login successful');
});
