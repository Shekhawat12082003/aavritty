import { Router } from 'express';
import * as api from '../controllers/api.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

router.get('/dashboard', authenticate, authorize('VENDOR'), api.getVendorDashboard);
router.get('/products', authenticate, authorize('VENDOR'), api.getVendorProducts);

export default router;
