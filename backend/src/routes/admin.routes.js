import { Router } from 'express';
import * as api from '../controllers/api.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

router.get('/dashboard', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), api.getAdminDashboard);
router.get('/stats', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), api.getAdminStats);

export default router;
