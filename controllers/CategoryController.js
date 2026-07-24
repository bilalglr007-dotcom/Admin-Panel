import categoryRepository from '../repositories/CategoryRepository.js';
import Audit from '../lib/audit.js';

class CategoryController {
  async createCategory(req, res, next) {
    try {
      const addCategory = await categoryRepository.create(req.body);
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
  }

  async getAllCategories(req, res, next) {
    try {
      const findCategories = await categoryRepository.findAll();
      res.status(200).json({ success: true, data: findCategories });
    } catch (err) {
      next(err);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const categoryByDetail = await categoryRepository.findById(req.params.id);
      res.status(200).json({ success: true, data: categoryByDetail });
    } catch (err) {
      next(err);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const categoryUpdate = await categoryRepository.updateById(req.params.id, req.body);
      await Audit.log({
        level: 'INFO',
        email: req.user.email,
        location: 'CATEGORIES',
        proc_type: 'PUT',
        log: `${categoryUpdate?.name || req.params.id} Adında Bir Kategori Güncellendi`
      });
      res.status(200).json({ success: true, data: categoryUpdate });
    } catch (err) {
      next(err);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const categoryDelete = await categoryRepository.deleteById(req.params.id);
      await Audit.log({
        level: 'INFO',
        email: req.user.email,
        location: 'CATEGORIES',
        proc_type: 'DELETE',
        log: `${categoryDelete?.name || req.params.id} Adında Bir Kategori Silindi`
      });
      res.status(200).json({ success: true, message: `${categoryDelete?.name || 'Kategori'} Başarıyla Silindi` });
    } catch (err) {
      next(err);
    }
  }
}

export default new CategoryController();
