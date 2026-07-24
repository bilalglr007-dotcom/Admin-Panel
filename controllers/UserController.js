import userRepository from '../repositories/UserRepository.js';
import Audit from '../lib/audit.js';
import bcrypt from 'bcryptjs';

class UserController {
  async getProfile(req, res, next) {
    try {
      const me = await userRepository.findById(req.user.id, '-password');
      if (!me) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
      res.status(200).json({ success: true, data: me });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { first_name, last_name, phone_number, avatar, banner, current_password, new_password } = req.body;
      const user = await userRepository.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });

      const updateFields = {};

      if (new_password) {
        if (!current_password) {
          return res.status(400).json({ success: false, message: 'Şifrenizi değiştirmek için mevcut şifrenizi girmelisiniz.' });
        }
        const isMatch = await bcrypt.compare(current_password, user.password);
        if (!isMatch) {
          return res.status(400).json({ success: false, message: 'Mevcut şifreniz hatalı.' });
        }
        const salt = await bcrypt.genSalt(10);
        updateFields.password = await bcrypt.hash(new_password, salt);
      }

      if (first_name !== undefined) updateFields.first_name = first_name;
      if (last_name !== undefined) updateFields.last_name = last_name;
      if (phone_number !== undefined) updateFields.phone_number = phone_number;
      if (avatar !== undefined) updateFields.avatar = avatar;
      if (banner !== undefined) updateFields.banner = banner;

      const updatedUser = await userRepository.updateById(req.user.id, updateFields, '-password');

      await Audit.log({
        level: 'INFO',
        email: user.email,
        location: 'USERS',
        proc_type: 'UPDATE',
        log: `Profil Güncellendi -> ${user.email}`,
      });

      res.status(200).json({ success: true, message: 'Profil başarıyla güncellendi.', data: updatedUser });
    } catch (err) {
      next(err);
    }
  }

  async createUser(req, res, next) {
    try {
      const userData = { ...req.body };
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
      }
      const addUser = await userRepository.create(userData);
      await Audit.log({
        level: 'INFO',
        email: req.user.email,
        location: 'USERS',
        proc_type: 'POST',
        log: `Yeni Kullanıcı Eklendi -> Ad Soyad: ${addUser.first_name} ${addUser.last_name}, E-posta: ${addUser.email}`
      });
      const userObj = addUser.toObject ? addUser.toObject() : { ...addUser };
      delete userObj.password;
      res.status(201).json({ success: true, data: userObj });
    } catch (err) {
      next(err);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const findUsers = await userRepository.findAll('-password');
      res.status(200).json({ success: true, data: findUsers });
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req, res, next) {
    try {
      const userByDetail = await userRepository.findById(req.params.id, '-password');
      res.status(200).json({ success: true, data: userByDetail });
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const currentUser = await userRepository.findById(req.params.id);
      if (!currentUser) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });

      const updateData = { ...req.body };
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      } else {
        delete updateData.password;
      }

      const userUpdate = await userRepository.updateById(req.params.id, updateData, '-password');
      const updatedFields = Object.keys(req.body).join(', ');
      await Audit.log({
        level: 'INFO',
        email: req.user.email,
        location: 'USERS',
        proc_type: 'PUT',
        log: `${currentUser?.email || req.params.id} Kullanıcısının Şu Alanları Güncellendi: ${updatedFields}`
      });
      res.status(200).json({ success: true, data: userUpdate });
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const userDelete = await userRepository.deleteById(req.params.id);
      await Audit.log({
        level: 'INFO',
        email: req.user.email,
        location: 'USERS',
        proc_type: 'DELETE',
        log: `${userDelete?.email || req.params.id} E-postalı Kullanıcı Silindi!`
      });
      res.status(200).json({ success: true, message: 'Kullanıcı Verisi Başarıyla Silindi' });
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
