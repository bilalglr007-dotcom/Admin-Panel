import { CacheService } from '../lib/redis.js';

export const cacheMiddleware = (keyPrefix, ttl = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `${keyPrefix}:${req.originalUrl || req.url}`;

    try {
      const cachedData = await CacheService.get(cacheKey);

      if (cachedData) {
        return res.status(200).json({
          ...cachedData,
          _cached: true
        });
      }

      const originalJson = res.json.bind(res);

      res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300 && body && body.success !== false) {
          CacheService.set(cacheKey, body, ttl);
        }
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error('Cache Middleware Hatası:', err.message);
      next();
    }
  };
};

export const invalidateCache = (patterns) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = async (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300 && body && body.success !== false) {
        const patternList = Array.isArray(patterns) ? patterns : [patterns];
        for (const pattern of patternList) {
          await CacheService.clearPattern(pattern);
        }
      }
      return originalJson(body);
    };

    next();
  };
};

export { CacheService };