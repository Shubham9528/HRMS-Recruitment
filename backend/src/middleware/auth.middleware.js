import { verifyToken } from '../services/auth.service.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const error = new Error('Not authorized to access this route');
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = verifyToken(token);
    
    const user = await User.findById(decoded.id).select('role');
    
    if (!user) {
      const error = new Error('User no longer exists');
      error.statusCode = 401;
      throw error;
    }

    req.user = { id: decoded.id, role: user.role };
    next();
  } catch (err) {
    const error = new Error('Not authorized to access this route');
    error.statusCode = 401;
    throw error;
  }
});
