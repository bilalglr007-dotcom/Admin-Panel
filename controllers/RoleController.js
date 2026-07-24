import roleRepository from '../repositories/RoleRepository.js';
import Audit from '../lib/audit.js';

class RoleController {
  async createRole(req, res, next) {
    try {
      const addRole = await roleRepository.create(req.body);
      await Audit.log({
        level: 'INFO',
        email: req.user.email,
        location: 'ROLES',
        proc_type: 'POST',
        log: `Yeni Rol Eklendi -> Rol Adı: ${addRole.role_name}`
      });
      res.status(201).json({ success: true, data: addRole });
    } catch (err) {
      next(err);
    }
  }

  async getAllRoles(req, res, next) {
    try {
      const findRoles = await roleRepository.findAll();
      res.status(200).json({ success: true, data: findRoles });
    } catch (err) {
      next(err);
    }
  }

  async getRoleById(req, res, next) {
    try {
      const roleByDetail = await roleRepository.findById(req.params.id);
      res.status(200).json({ success: true, data: roleByDetail });
    } catch (err) {
      next(err);
    }
  }

  async updateRole(req, res, next) {
    try {
      const currentRole = await roleRepository.findById(req.params.id);
      const roleUpdate = await roleRepository.updateById(req.params.id, req.body);
      const updatedFields = Object.keys(req.body).join(', ');
      await Audit.log({
        level: 'INFO',
        email: req.user.email,
        location: 'ROLES',
        proc_type: 'PUT',
        log: `${currentRole?.role_name || req.params.id} Rolünün Şu Alanları Güncellendi: ${updatedFields}`
      });
      res.status(200).json({ success: true, data: roleUpdate });
    } catch (err) {
      next(err);
    }
  }

  async deleteRole(req, res, next) {
    try {
      const roleDelete = await roleRepository.deleteById(req.params.id);
      await Audit.log({
        level: 'INFO',
        email: req.user.email,
        location: 'ROLES',
        proc_type: 'DELETE',
        log: `${roleDelete?.role_name || req.params.id} İsimli Rol Silindi!`
      });
      res.status(200).json({ success: true, message: 'Rol Verisi Başarıyla Silindi' });
    } catch (err) {
      next(err);
    }
  }
}

export default new RoleController();
