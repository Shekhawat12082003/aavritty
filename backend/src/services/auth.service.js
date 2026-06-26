import bcrypt from 'bcrypt';
import prisma from '../config/database.js';
import { ApiError } from '../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken } from './token.service.js';

const SALT_ROUNDS = 12;

export const hashPassword = async (password) => bcrypt.hash(password, SALT_ROUNDS);
export const comparePassword = async (password, hash) => bcrypt.compare(password, hash);

export const registerUser = async ({ email, password, firstName, lastName, phone, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, 'Email already registered');

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, firstName, lastName, phone, role: role || 'CUSTOMER' },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
  });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) throw new ApiError(401, 'Invalid credentials');

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new ApiError(401, 'Invalid credentials');

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken, lastLoginAt: new Date() },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new ApiError(401, 'Refresh token required');

  const user = await prisma.user.findFirst({ where: { refreshToken } });
  if (!user) throw new ApiError(401, 'Invalid refresh token');

  const accessToken = generateAccessToken(user.id, user.role);
  return { accessToken };
};

export const logoutUser = async (userId) => {
  await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
};
