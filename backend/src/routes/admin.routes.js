import { Router } from 'express';
import * as api from '../controllers/api.controller.js';
import * as productController from '../controllers/product.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

router.get('/dashboard', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), api.getAdminDashboard);
router.get('/stats', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), api.getAdminStats);
router.get('/products', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), productController.getProducts);
router.patch('/products/:id/toggle-active', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), productController.toggleProductActive);
router.get('/orders', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), api.getOrders);
router.get('/orders/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), api.getOrderById);
router.patch('/orders/:id/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), api.updateOrderStatus);

export default router;
