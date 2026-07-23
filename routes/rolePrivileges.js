import Audit from '../lib/audit.js';
import RolePrivileges from '../db/models/rolePrivileges.js';
import express from 'express';
import { authenticateToken, checkRole } from '../middlewares/authMiddleware.js';
import { cacheMiddleware, invalidateCache } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['role-privileges:*', 'auditlogs:*']), async (req, res, next) => {
  try {
    const addRolePrivileges = await RolePrivileges.create(req.body);
    await Audit.log({ level: 'INFO', email: req.user.email, location: 'ROLE_PRIVILEGES', proc_type: 'POST', log: `Yeni Rol-Yetki İlişkisi Tanımlandı -> Role ID: ${addRolePrivileges.role_id}, Permission: ${addRolePrivileges.permission}` });
    res.status(201).json({ success: true, data: addRolePrivileges });
  } catch (err) {
    next(err);
  }
});

router.get('/', authenticateToken, cacheMiddleware('role-privileges'), async (req, res, next) => {
  try {
    const findRolePrivileges = await RolePrivileges.find();
    res.status(200).json({ success: true, data: findRolePrivileges });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticateToken, cacheMiddleware('role-privileges'), async (req, res, next) => {
  try {
    const RolePrivilegesByDetail = await RolePrivileges.findById(req.params.id);
    res.status(200).json({ success: true, data: RolePrivilegesByDetail });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['role-privileges:*', 'auditlogs:*']), async (req, res, next) => {
  try {
    const currentRolePrivileges = await RolePrivileges.findById(req.params.id);
    const RolePrivilegesUpdate = await RolePrivileges.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    const updatedFields = Object.keys(req.body).join(', ');
    await Audit.log({ level: 'INFO', email: req.user.email, location: 'ROLE_PRIVILEGES', proc_type: 'PUT', log: `Rol-Yetki İlişkisinin Şu Alanları Güncellendi: ${updatedFields}` });
    res.status(200).json({ success: true, data: RolePrivilegesUpdate });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['role-privileges:*', 'auditlogs:*']), async (req, res, next) => {
  try {
    const RolePrivilegesDelete = await RolePrivileges.findByIdAndDelete(req.params.id);
    await Audit.log({ level: 'INFO', email: req.user.email, location: 'ROLE_PRIVILEGES', proc_type: 'DELETE', log: `Rol-Yetki İlişkisi Silindi! (ID: ${req.params.id})` });
    res.status(200).json({ success: true, message: 'Rol-Yetki İlişkisi Başarıyla Silindi' });
  } catch (err) {
    next(err);
  }
});

export default router;