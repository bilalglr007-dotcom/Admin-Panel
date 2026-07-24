import UserRoles from '../db/models/userRoles.js';

class UserRoleRepository {
  async create(userRoleData) {
    return await UserRoles.create(userRoleData);
  }

  async findAll() {
    return await UserRoles.find().lean();
  }

  async findById(id) {
    return await UserRoles.findById(id).lean();
  }

  async updateById(id, updateData) {
    return await UserRoles.findByIdAndUpdate(id, updateData, { returnDocument: 'after' }).lean();
  }

  async deleteById(id) {
    return await UserRoles.findByIdAndDelete(id).lean();
  }
}

export default new UserRoleRepository();
