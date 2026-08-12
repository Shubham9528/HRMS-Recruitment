import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

const SALT_ROUNDS = 10;

export const hashPassword = async (plain) => {
  return await bcrypt.hash(plain, SALT_ROUNDS);
};

export const comparePassword = async (plain, hash) => {
  return await bcrypt.compare(plain, hash);
};

export const signToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
