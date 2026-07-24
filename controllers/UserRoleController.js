import userRoleRepository from '../repositories/UserRoleRepository.js';
import Audit from '../lib/audit.js';

class UserRoleController {
  async createUserRole(req, res, next) {
    try {
      const addUserRoles = await userRoleRepository.create(req.body);
      await Audit.log({
        level: 'INFO',
        email: req.user.email,
        location: 'USER_ROLES',
        proc_type: 'POST',
        log: `Yeni Kullanıcı-Rol İlişkisi Tanımlandı -> User ID: ${addUserRoles.user_id}, Role ID: ${addUserRoles.role_id}`
      });
      res.status(201).json({ success: true, data: addUserRoles });
    } catch (err) {
      next(err);
    }
  }

  async getAllUserRoles(req, res, next) {
    try {
      const findUserRoles = await userRoleRepository.findAll();
      res.status(200).json({ success: true, data: findUserRoles });
    } catch (err) {
      next(err);
    }
  }

  async getUserRoleById(req, res, next) {
    try {
      const userRolesByDetail = await userRoleRepository.findById(req.params.id);
      res.status(200).json({ success: true, data: userRolesByDetail });
    } catch (err) {
      next(err);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const currentUserRoles = await userRoleRepository.findById(req.params.id);
      const userRolesUpdate = await userRoleRepository.updateById(req.params.id, req.body);
      const updatedFields = Object.keys(req.body).join(', ');
      await Audit.log({
        level: 'INFO',
        email: req.user.email,
        location: 'USER_ROLES',
        proc_type: 'PUT',
        log: `Kullanıcı-Rol İlişkisinin Şu Alanları Güncellendi: ${updatedFields}`
      });
      res.status(200).json({ success: true, data: userRolesUpdate });
    } catch (err) {
      next(err);
    }
  }

  async deleteUserRole(req, res, next) {
    try {
      const userRolesDelete = await userRoleRepository.deleteById(req.params.id);
      await Audit.log({
        level: 'INFO',
        email: req.user.email,
        location: 'USER_ROLES',
        proc_type: 'DELETE',
        log: `Kullanıcı-Rol İlişkisi Silindi! (User ID: ${userRolesDelete?.user_id || req.params.id})`
      });
      res.status(200).json({ success: true, message: 'Kullanıcı Rol İlişkisi Başarıyla Silindi' });
    } catch (err) {
      next(err);
    }
  }
}

export default new UserRoleController();
