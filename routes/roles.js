import express from 'express';
import roleController from '../controllers/RoleController.js';
import { authenticateToken, checkRole } from '../middlewares/authMiddleware.js';
import { cacheMiddleware, invalidateCache } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['roles:*', 'auditlogs:*']), roleController.createRole);
router.get('/', authenticateToken, cacheMiddleware('roles'), roleController.getAllRoles);
router.get('/:id', authenticateToken, cacheMiddleware('roles'), roleController.getRoleById);
router.put('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['roles:*', 'auditlogs:*']), roleController.updateRole);
router.delete('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['roles:*', 'auditlogs:*']), roleController.deleteRole);

export default router;