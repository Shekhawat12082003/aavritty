import jwt from 'jsonwebtoken';
import env from '../config/index.js';

export const generateAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  });
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
