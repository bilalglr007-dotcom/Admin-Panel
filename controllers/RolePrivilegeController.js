import rolePrivilegeRepository from '../repositories/RolePrivilegeRepository.js';
import Audit from '../lib/audit.js';

class RolePrivilegeController {
  async createRolePrivilege(req, res, next) {
    try {
      const addRolePrivileges = await rolePrivilegeRepository.create(req.body);
      await Audit.log({
        level: 'INFO',
        email: req.user.email,
        location: 'ROLE_PRIVILEGES',
        proc_type: 'POST',
        log: `Yeni Rol-Yetki İlişkisi Tanımlandı -> Role ID: ${addRolePrivileges.role_id}, Permission: ${addRolePrivileges.permission}`
      });
      res.status(201).json({ success: true, data: addRolePrivileges });
    } catch (err) {
      next(err);
    }
  }

  async getAllRolePrivileges(req, res, next) {
    try {
      const findRolePrivileges = await rolePrivilegeRepository.findAll();
      res.status(200).json({ success: true, data: findRolePrivileges });
    } catch (err) {
      next(err);
    }
  }

  async getRolePrivilegeById(req, res, next) {
    try {
      const RolePrivilegesByDetail = await rolePrivilegeRepository.findById(req.params.id);
      res.status(200).json({ success: true, data: RolePrivilegesByDetail });
    } catch (err) {
      next(err);
    }
  }

  async updateRolePrivilege(req, res, next) {
    try {
      const currentRolePrivileges = await rolePrivilegeRepository.findById(req.params.id);
      const RolePrivilegesUpdate = await rolePrivilegeRepository.updateById(req.params.id, req.body);
      const updatedFields = Object.keys(req.body).join(', ');
      await Audit.log({
        level: 'INFO',
        email: req.user.email,
        location: 'ROLE_PRIVILEGES',
        proc_type: 'PUT',
        log: `Rol-Yetki İlişkisinin Şu Alanları Güncellendi: ${updatedFields}`
      });
      res.status(200).json({ success: true, data: RolePrivilegesUpdate });
    } catch (err) {
      next(err);
    }
  }

  async deleteRolePrivilege(req, res, next) {
    try {
      const RolePrivilegesDelete = await rolePrivilegeRepository.deleteById(req.params.id);
      await Audit.log({
        level: 'INFO',
        email: req.user.email,
        location: 'ROLE_PRIVILEGES',
        proc_type: 'DELETE',
        log: `Rol-Yetki İlişkisi Silindi! (ID: ${req.params.id})`
      });
      res.status(200).json({ success: true, message: 'Rol-Yetki İlişkisi Başarıyla Silindi' });
    } catch (err) {
      next(err);
    }
  }
}

export default new RolePrivilegeController();
