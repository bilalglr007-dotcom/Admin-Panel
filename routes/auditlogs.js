import express from 'express';
import auditLogController from '../controllers/AuditLogController.js';
import { authenticateToken, checkRole } from '../middlewares/authMiddleware.js';
import { cacheMiddleware, invalidateCache } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache('auditlogs:*'), auditLogController.createAuditLog);
router.get('/', authenticateToken, cacheMiddleware('auditlogs', 60), auditLogController.getAllAuditLogs);
router.get('/:id', authenticateToken, cacheMiddleware('auditlogs', 60), auditLogController.getAuditLogById);
router.put('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache('auditlogs:*'), auditLogController.updateAuditLog);
router.delete('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache('auditlogs:*'), auditLogController.deleteAuditLog);

export default router;