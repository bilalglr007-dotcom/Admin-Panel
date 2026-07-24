import express from 'express';
import userRoleController from '../controllers/UserRoleController.js';
import { authenticateToken, checkRole } from '../middlewares/authMiddleware.js';
import { cacheMiddleware, invalidateCache } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['user-roles:*', 'auditlogs:*']), userRoleController.createUserRole);
router.get('/', authenticateToken, cacheMiddleware('user-roles'), userRoleController.getAllUserRoles);
router.get('/:id', authenticateToken, cacheMiddleware('user-roles'), userRoleController.getUserRoleById);
router.put('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['user-roles:*', 'auditlogs:*']), userRoleController.updateUserRole);
router.delete('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['user-roles:*', 'auditlogs:*']), userRoleController.deleteUserRole);

export default router;