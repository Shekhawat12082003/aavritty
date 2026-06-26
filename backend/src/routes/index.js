import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import userRoutes from './user.routes.js';
import orderRoutes from './order.routes.js';
import paymentRoutes from './payment.routes.js';
import bulkQuoteRoutes from './bulkQuote.routes.js';
import reviewRoutes from './review.routes.js';
import vendorRoutes from './vendor.routes.js';
import adminRoutes from './admin.routes.js';
import deliveryRoutes from './delivery.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import searchRoutes from './search.routes.js';
import notificationRoutes from './notification.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/bulk-quotes', bulkQuoteRoutes);
router.use('/reviews', reviewRoutes);
router.use('/vendor', vendorRoutes);
router.use('/admin', adminRoutes);
router.use('/delivery', deliveryRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/search', searchRoutes);
router.use('/notifications', notificationRoutes);

export default router;
