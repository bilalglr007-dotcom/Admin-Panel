import Redis from 'ioredis';
import config from '../config/index.js';

let isConnected = false;

const redisClient = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD || undefined,
  lazyConnect: true,
  retryStrategy(times) {
    if (times > 3) {
      console.warn('⚠️ Redis sunucusuna bağlanılamadı. Önbellekleme devre dışı bırakıldı, veritabanından doğrudan okunacak.');
      return null;
    }
    return Math.min(times * 100, 2000);
  }
});

redisClient.on('connect', () => {
  isConnected = true;
  console.log('✅ Redis Bağlantısı Başarıyla Kuruldu!');
});

redisClient.on('error', (err) => {
  if (isConnected) {
    console.error('Redis Bağlantı Hatası:', err.message);
  }
  isConnected = false;
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    isConnected = false;
  }
})();

export class CacheService {
  static async get(key) {
    if (!isConnected) return null;
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(`Redis Get Hatası [${key}]:`, err.message);
      return null;
    }
  }

  static async set(key, data, ttl = config.REDIS_TTL) {
    if (!isConnected) return false;
    try {
      await redisClient.set(key, JSON.stringify(data), 'EX', ttl);
      return true;
    } catch (err) {
      console.error(`Redis Set Hatası [${key}]:`, err.message);
      return false;
    }
  }

  static async del(keys) {
    if (!isConnected) return false;
    try {
      const keyList = Array.isArray(keys) ? keys : [keys];
      if (keyList.length > 0) {
        await redisClient.del(...keyList);
      }
      return true;
    } catch (err) {
      console.error('Redis Del Hatası:', err.message);
      return false;
    }
  }

  static async clearPattern(pattern) {
    if (!isConnected) return false;
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
      return true;
    } catch (err) {
      console.error(`Redis Clear Pattern Hatası [${pattern}]:`, err.message);
      return false;
    }
  }
}

export default redisClient;