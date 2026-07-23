import Audit from '../lib/audit.js';
import Users from '../db/models/users.js';
import express from 'express';
import bcrypt from 'bcryptjs';
import { authenticateToken, checkRole } from '../middlewares/authMiddleware.js';
import { cacheMiddleware, invalidateCache } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

router.get('/profile/me', authenticateToken, async (req, res, next) => {
  try {
    const me = await Users.findById(req.user.id).select('-password');
    if (!me) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    res.status(200).json({ success: true, data: me });
  } catch (err) {
    next(err);
  }
});

router.put('/profile/me', authenticateToken, invalidateCache(['users:*', 'auditlogs:*']), async (req, res, next) => {
  try {
    const { first_name, last_name, phone_number, avatar, banner, current_password, new_password } = req.body;
    const user = await Users.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });

    if (new_password) {
      if (!current_password) {
        return res.status(400).json({ success: false, message: 'Şifrenizi değiştirmek için mevcut şifrenizi girmelisiniz.' });
      }
      const isMatch = await bcrypt.compare(current_password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Mevcut şifreniz hatalı.' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(new_password, salt);
    }

    if (first_name !== undefined) user.first_name = first_name;
    if (last_name !== undefined) user.last_name = last_name;
    if (phone_number !== undefined) user.phone_number = phone_number;
    if (avatar !== undefined) user.avatar = avatar;
    if (banner !== undefined) user.banner = banner;

    await user.save();

    await Audit.log({
      level: 'INFO',
      email: user.email,
      location: 'USERS',
      proc_type: 'UPDATE',
      log: `Profil Güncellendi -> ${user.email}`,
    });

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({ success: true, message: 'Profil başarıyla güncellendi.', data: updatedUser });
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['users:*', 'auditlogs:*']), async (req, res, next) => {
  try {
    const userData = { ...req.body };
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    const addUser = await Users.create(userData);
    await Audit.log({ level: 'INFO', email: req.user.email, location: 'USERS', proc_type: 'POST', log: `Yeni Kullanıcı Eklendi -> Ad Soyad: ${addUser.first_name} ${addUser.last_name}, E-posta: ${addUser.email}` });
    const userObj = addUser.toObject();
    delete userObj.password;
    res.status(201).json({ success: true, data: userObj });
  } catch (err) {
    next(err);
  }
});

router.get('/', authenticateToken, cacheMiddleware('users'), async (req, res, next) => {
  try {
    const findUsers = await Users.find().select('-password');
    res.status(200).json({ success: true, data: findUsers });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticateToken, cacheMiddleware('users'), async (req, res, next) => {
  try {
    const userByDetail = await Users.findById(req.params.id).select('-password');
    res.status(200).json({ success: true, data: userByDetail });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['users:*', 'auditlogs:*']), async (req, res, next) => {
  try {
    const currentUser = await Users.findById(req.params.id);
    if (!currentUser) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });

    const updateData = { ...req.body };
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    } else {
      delete updateData.password;
    }

    const userUpdate = await Users.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' }).select('-password');
    const updatedFields = Object.keys(req.body).join(', ');
    await Audit.log({ level: 'INFO', email: req.user.email, location: 'USERS', proc_type: 'PUT', log: `${currentUser?.email || req.params.id} Kullanıcısının Şu Alanları Güncellendi: ${updatedFields}` });
    res.status(200).json({ success: true, data: userUpdate });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['users:*', 'auditlogs:*']), async (req, res, next) => {
  try {
    const userDelete = await Users.findByIdAndDelete(req.params.id);
    await Audit.log({ level: 'INFO', email: req.user.email, location: 'USERS', proc_type: 'DELETE', log: `${userDelete?.email || req.params.id} E-postalı Kullanıcı Silindi!` });
    res.status(200).json({ success: true, message: 'Kullanıcı Verisi Başarıyla Silindi' });
  } catch (err) {
    next(err);
  }
});

export default router;
