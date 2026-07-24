import Roles from '../db/models/roles.js';

class RoleRepository {
  async create(roleData) {
    return await Roles.create(roleData);
  }

  async findAll() {
    return await Roles.find().lean();
  }

  async findById(id) {
    return await Roles.findById(id).lean();
  }

  async updateById(id, updateData) {
    return await Roles.findByIdAndUpdate(id, updateData, { returnDocument: 'after' }).lean();
  }

  async deleteById(id) {
    return await Roles.findByIdAndDelete(id).lean();
  }
}

export default new RoleRepository();
