import { Router } from 'express';
import * as api from '../controllers/api.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, api.getNotifications);
router.patch('/:id/read', authenticate, api.markNotificationRead);

export default router;
