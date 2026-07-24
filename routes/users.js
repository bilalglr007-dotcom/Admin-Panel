import express from 'express';
import userController from '../controllers/UserController.js';
import { authenticateToken, checkRole } from '../middlewares/authMiddleware.js';
import { cacheMiddleware, invalidateCache } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

router.get('/profile/me', authenticateToken, userController.getProfile);
router.put('/profile/me', authenticateToken, invalidateCache(['users:*', 'auditlogs:*']), userController.updateProfile);

router.post('/', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['users:*', 'auditlogs:*']), userController.createUser);
router.get('/', authenticateToken, cacheMiddleware('users'), userController.getAllUsers);
router.get('/:id', authenticateToken, cacheMiddleware('users'), userController.getUserById);
router.put('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['users:*', 'auditlogs:*']), userController.updateUser);
router.delete('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['users:*', 'auditlogs:*']), userController.deleteUser);

export default router;
