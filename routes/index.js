import express from 'express';
import config from '../config/index.js';
import authRouter from '../routes/auth.js';
import AuditLogs from '../db/models/auditlogs.js';
import Users from '../db/models/users.js';
import Roles from '../db/models/roles.js';
import Categories from '../db/models/categories.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ Message: 'Hoşgeldiniz...' });
});

router.get('/config-test', (req, res) => {
  res.json({ success: true, data: config });
});

router.get('/public-stats', async (req, res, next) => {
  try {
    const [totalLogs, totalUsers, totalRoles, totalCategories] = await Promise.all([
      AuditLogs.countDocuments({}),
      Users.countDocuments({}),
      Roles.countDocuments({}),
      Categories.countDocuments({})
    ]);

    const now = new Date();
    const DAYS_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    const buckets = Array.from({ length: 8 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (7 - i));
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return {
        dateStr: `${year}-${month}-${day}`,
        dayName: DAYS_TR[d.getDay()],
        count: 0
      };
    });

    const eightDaysAgo = new Date(now);
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 7);
    eightDaysAgo.setHours(0, 0, 0, 0);

    const recentLogs = await AuditLogs.find({ createdAt: { $gte: eightDaysAgo } }).select('createdAt').lean();
    recentLogs.forEach(log => {
      const d = new Date(log.createdAt);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const bucket = buckets.find(b => b.dateStr === dateStr);
      if (bucket) bucket.count++;
    });

    res.json({
      success: true,
      data: {
        totalLogs,
        totalUsers,
        totalRoles,
        totalCategories,
        chartBuckets: buckets
      }
    });
  } catch (err) {
    next(err);
  }
});

router.use('/auth', authRouter);

export default router;
