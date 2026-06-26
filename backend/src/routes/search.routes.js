import { Router } from 'express';
import * as api from '../controllers/api.controller.js';

const router = Router();

router.get('/', api.search);

export default router;
