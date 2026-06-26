import { Router } from 'express';
import * as api from '../controllers/api.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

router.get('/', api.getUsers);
router.get('/:id', api.getUserById);
router.put('/:id', authenticate, api.updateUser);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), api.deleteUser);
router.patch('/:id/profile', authenticate, api.updateUserProfile);
router.patch('/:id/password', authenticate, api.changePassword);

export default router;
