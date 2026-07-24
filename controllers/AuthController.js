import userRepository from '../repositories/UserRepository.js';
import Audit from '../lib/audit.js';
import JWT from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, first_name, last_name, phone_number, avatar, banner } = req.body;
      const user = await userRepository.findByEmail(email);
      if (user) {
        return res.status(400).json({ success: false, message: 'Bu E-Posta Sistemimizde Kayıtlı!' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await userRepository.create({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        phone_number,
        avatar,
        banner
      });
      await Audit.log({
        level: 'INFO',
        email: newUser.email,
        location: 'AUTH',
        proc_type: 'REGISTER',
        log: `Yeni Kullanıcı Kayıt Oldu ${newUser.email}`
      });
      res.status(201).json({
        success: true,
        message: 'Kullanıcı Başarıyla Oluşturuldu',
        data: { id: newUser._id, email: newUser.email }
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Geçersiz E-Posta Veya Şifre!' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Geçersiz E-Posta Veya Şifre!' });
      }
      const payLoad = { id: user._id, email: user.email };
      const token = JWT.sign(payLoad, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });
      await Audit.log({
        level: 'INFO',
        email: user.email,
        location: 'AUTH',
        proc_type: 'LOGIN',
        log: `Kullanıcı Sisteme Giriş Yaptı: ${user.email}`
      });
      res.status(200).json({
        success: true,
        token: `Bearer ${token}`,
        user: {
          id: user._id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          avatar: user.avatar,
          banner: user.banner
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
