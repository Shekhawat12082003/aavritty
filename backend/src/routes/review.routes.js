import { Router } from 'express';
import * as api from '../controllers/api.controller.js';

const router = Router();

router.get('/', api.getReviews);
router.post('/', api.createReview);

export default router;
