import AuditLogs from '../db/models/auditlogs.js';
import express from 'express';
import { authenticateToken, checkRole } from '../middlewares/authMiddleware.js';
import { cacheMiddleware, invalidateCache } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache('auditlogs:*'), async (req, res, next) => {
  try {
    const addAuditLog = await AuditLogs.create(req.body);
    res.status(201).json({ success: true, data: addAuditLog });
  } catch (err) {
    next(err);
  }
});

router.get('/', authenticateToken, cacheMiddleware('auditlogs', 60), async (req, res, next) => {
  try {
    const findAuditLogs = await AuditLogs.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: findAuditLogs });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticateToken, cacheMiddleware('auditlogs', 60), async (req, res, next) => {
  try {
    const auditLogByDetail = await AuditLogs.findById(req.params.id);
    res.status(200).json({ success: true, data: auditLogByDetail });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache('auditlogs:*'), async (req, res, next) => {
  try {
    const auditLogUpdate = await AuditLogs.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.status(200).json({ success: true, data: auditLogUpdate });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache('auditlogs:*'), async (req, res, next) => {
  try {
    const auditLogDelete = await AuditLogs.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Sistem Günlüğü Başarıyla Silindi' });
  } catch (err) {
    next(err);
  }
});

export default router;