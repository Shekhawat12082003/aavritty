import { Router } from 'express';
import * as api from '../controllers/api.controller.js';

const router = Router();

router.post('/submit', api.submitContactForm);

export default router;
