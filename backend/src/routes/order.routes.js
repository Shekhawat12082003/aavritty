import { Router } from 'express';
import * as api from '../controllers/api.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, api.getOrders);
router.get('/:id', authenticate, api.getOrderById);
router.post('/', authenticate, api.createOrder);
router.patch('/:id/status', authenticate, api.updateOrderStatus);

export default router;
