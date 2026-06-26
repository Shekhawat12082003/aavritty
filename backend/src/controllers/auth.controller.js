import { ApiResponse } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 */
export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json(new ApiResponse(201, user, 'Registration successful'));
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     security: []
 */
export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.status(200).json(new ApiResponse(200, result, 'Login successful'));
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshAccessToken(refreshToken);
  res.status(200).json(new ApiResponse(200, result, 'Token refreshed'));
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user.id);
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, null, 'Password reset link sent if email exists'));
});

export const resetPassword = asyncHandler(async (req, res) => {
  res.status(501).json(new ApiResponse(501, null, 'Password reset will be implemented in Phase 2'));
});

export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, 'Profile retrieved'));
});
