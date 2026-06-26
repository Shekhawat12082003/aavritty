import { Router } from 'express';
import * as api from '../controllers/api.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/stats', authenticate, api.getDashboardStats);

export default router;
