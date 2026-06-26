import { Router } from 'express';
import * as api from '../controllers/api.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, api.getPayments);
router.post('/', authenticate, api.createPayment);

export default router;
