import AuditLogs from '../db/models/auditlogs.js';

class AuditLogRepository {
  async create(auditLogData) {
    return await AuditLogs.create(auditLogData);
  }

  async findPaginated({ page = 1, limit = 10, filter = {} }) {
    const skip = (page - 1) * limit;
    
    const [data, totalCount] = await Promise.all([
      AuditLogs.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLogs.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return {
      data,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages
      }
    };
  }

  async getStats() {
    const [total, post, deleteCount, login] = await Promise.all([
      AuditLogs.countDocuments({}),
      AuditLogs.countDocuments({ proc_type: 'POST' }),
      AuditLogs.countDocuments({ proc_type: 'DELETE' }),
      AuditLogs.countDocuments({ proc_type: 'LOGIN' })
    ]);
    return { total, post, delete: deleteCount, login };
  }

  async findAllSortedByDateDesc() {
    return await AuditLogs.find().sort({ createdAt: -1 }).lean();
  }

  async findById(id) {
    return await AuditLogs.findById(id).lean();
  }

  async updateById(id, updateData) {
    return await AuditLogs.findByIdAndUpdate(id, updateData, { returnDocument: 'after' }).lean();
  }

  async deleteById(id) {
    return await AuditLogs.findByIdAndDelete(id).lean();
  }
}

export default new AuditLogRepository();
