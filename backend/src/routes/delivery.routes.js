import { Router } from 'express';
import * as api from '../controllers/api.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

router.get('/dashboard', authenticate, authorize('DELIVERY_PARTNER'), api.getDeliveryDashboard);
router.get('/orders', authenticate, authorize('DELIVERY_PARTNER'), api.getDeliveryOrders);

export default router;
