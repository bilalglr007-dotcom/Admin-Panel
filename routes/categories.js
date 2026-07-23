import Audit from '../lib/audit.js';
import Categories from '../db/models/categories.js';
import express from 'express';
import { authenticateToken, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, checkRole('ADMIN'), async (req, res, next) => {
  try {
    const addCategory = await Categories.create(req.body);
    await Audit.log({
      level: 'INFO',
      email: req.user.email,
      location: 'CATEGORIES',
      proc_type: 'POST',
      log: `${addCategory.name} Adında Bir Kategori Eklendi!`
    });
    res.status(201).json({ success: true, data: addCategory });
  } catch (err) {
    next(err);
  }
});

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const findCategories = await Categories.find();
    res.status(200).json({ success: true, data: findCategories });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const categoryByDetail = await Categories.findById(req.params.id);
    res.status(200).json({ success: true, data: categoryByDetail });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticateToken, checkRole('ADMIN'), async (req, res, next) => {
  try {
    const categoryUpdate = await Categories.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    await Audit.log({
      level: 'INFO',
      email: req.user.email,
      location: 'CATEGORIES',
      proc_type: 'PUT',
      log: `${categoryUpdate.name} Adında Bir Kategori Güncellendi`
    });
    res.status(200).json({ success: true, data: categoryUpdate });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticateToken, checkRole('ADMIN'), async (req, res, next) => {
  try {
    const categoryDelete = await Categories.findByIdAndDelete(req.params.id);
    await Audit.log({
      level: 'INFO',
      email: req.user.email,
      location: 'CATEGORIES',
      proc_type: 'DELETE',
      log: `${categoryDelete.name} Adında Bir Kategori Silindi`
    });
    res.status(200).json({ success: true, message: `${categoryDelete.name} Kategorisi Başarıyla Silindi` });
  } catch (err) {
    next(err);
  }
});

export default router;