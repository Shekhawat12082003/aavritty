import { Router } from 'express';
import * as api from '../controllers/api.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, api.getBulkQuotes);
router.post('/', authenticate, api.createBulkQuote);

export default router;
