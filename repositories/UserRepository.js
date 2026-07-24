import Users from '../db/models/users.js';

class UserRepository {
  async create(userData) {
    return await Users.create(userData);
  }

  async findByEmail(email) {
    return await Users.findOne({ email }).lean();
  }

  async findById(id, selectFields = null) {
    const query = Users.findById(id);
    if (selectFields) {
      query.select(selectFields);
    }
    return await query.lean();
  }

  async findAll(selectFields = null) {
    const query = Users.find();
    if (selectFields) {
      query.select(selectFields);
    }
    return await query.lean();
  }

  async updateById(id, updateData, selectFields = null) {
    const query = Users.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    if (selectFields) {
      query.select(selectFields);
    }
    return await query.lean();
  }

  async deleteById(id) {
    return await Users.findByIdAndDelete(id).lean();
  }
}

export default new UserRepository();
