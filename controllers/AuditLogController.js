import auditLogRepository from '../repositories/AuditLogRepository.js';

class AuditLogController {
  async createAuditLog(req, res, next) {
    try {
      const addAuditLog = await auditLogRepository.create(req.body);
      res.status(201).json({ success: true, data: addAuditLog });
    } catch (err) {
      next(err);
    }
  }

  async getAllAuditLogs(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const { search, location, proc_type, startDate, endDate } = req.query;

      const filter = {};

      if (location) filter.location = location;
      if (proc_type) filter.proc_type = proc_type;

      if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [
          { email: regex },
          { log: regex },
          { location: regex }
        ];
      }

      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) {
          filter.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          filter.createdAt.$lte = end;
        }
      }

      const result = await auditLogRepository.findPaginated({ page, limit, filter });
      const stats = await auditLogRepository.getStats();

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        stats
      });
    } catch (err) {
      next(err);
    }
  }

  async getAuditLogById(req, res, next) {
    try {
      const auditLogByDetail = await auditLogRepository.findById(req.params.id);
      res.status(200).json({ success: true, data: auditLogByDetail });
    } catch (err) {
      next(err);
    }
  }

  async updateAuditLog(req, res, next) {
    try {
      const auditLogUpdate = await auditLogRepository.updateById(req.params.id, req.body);
      res.status(200).json({ success: true, data: auditLogUpdate });
    } catch (err) {
      next(err);
    }
  }

  async deleteAuditLog(req, res, next) {
    try {
      const auditLogDelete = await auditLogRepository.deleteById(req.params.id);
      res.status(200).json({ success: true, message: 'Sistem Günlüğü Başarıyla Silindi' });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuditLogController();
