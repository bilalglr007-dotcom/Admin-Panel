import Categories from '../db/models/categories.js';

class CategoryRepository {
  async create(categoryData) {
    return await Categories.create(categoryData);
  }

  async findAll() {
    return await Categories.find().lean();
  }

  async findById(id) {
    return await Categories.findById(id).lean();
  }

  async updateById(id, updateData) {
    return await Categories.findByIdAndUpdate(id, updateData, { returnDocument: 'after' }).lean();
  }

  async deleteById(id) {
    return await Categories.findByIdAndDelete(id).lean();
  }
}

export default new CategoryRepository();
