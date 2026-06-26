import { Router } from 'express';
import { validate } from '../middleware/error.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
} from '../validators/auth.validator.js';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', authLimiter, registerValidator, validate, authController.register);
router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.post('/admin/login', authLimiter, loginValidator, validate, authController.adminLogin);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validate, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', authenticate, authController.getProfile);

export default router;
