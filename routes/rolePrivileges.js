import express from 'express';
import rolePrivilegeController from '../controllers/RolePrivilegeController.js';
import { authenticateToken, checkRole } from '../middlewares/authMiddleware.js';
import { cacheMiddleware, invalidateCache } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['role-privileges:*', 'auditlogs:*']), rolePrivilegeController.createRolePrivilege);
router.get('/', authenticateToken, cacheMiddleware('role-privileges'), rolePrivilegeController.getAllRolePrivileges);
router.get('/:id', authenticateToken, cacheMiddleware('role-privileges'), rolePrivilegeController.getRolePrivilegeById);
router.put('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['role-privileges:*', 'auditlogs:*']), rolePrivilegeController.updateRolePrivilege);
router.delete('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['role-privileges:*', 'auditlogs:*']), rolePrivilegeController.deleteRolePrivilege);

export default router;