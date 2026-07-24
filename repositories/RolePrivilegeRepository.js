import RolePrivileges from '../db/models/rolePrivileges.js';

class RolePrivilegeRepository {
  async create(data) {
    return await RolePrivileges.create(data);
  }

  async findAll() {
    return await RolePrivileges.find().lean();
  }

  async findById(id) {
    return await RolePrivileges.findById(id).lean();
  }

  async updateById(id, updateData) {
    return await RolePrivileges.findByIdAndUpdate(id, updateData, { returnDocument: 'after' }).lean();
  }

  async deleteById(id) {
    return await RolePrivileges.findByIdAndDelete(id).lean();
  }
}

export default new RolePrivilegeRepository();
