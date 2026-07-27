import Redis from 'ioredis';
import config from '../config/index.js';

let isConnected = false;

const redisClient = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD || undefined,
  lazyConnect: true,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 1,
  connectTimeout: 2000,
  retryStrategy(times) {
    if (times > 1) {
      console.warn('⚠️ Redis sunucusuna bağlanılamadı. Önbellekleme devre dışı bırakıldı, veritabanından doğrudan okunacak.');
      return null;
    }
    return 100;
  }
});

redisClient.on('connect', () => {
  console.log('🔄 Redis Bağlantısı Kuruluyor...');
});

redisClient.on('ready', () => {
  isConnected = true;
  console.log('✅ Redis Bağlantısı Başarıyla Kuruldu!');
});

redisClient.on('error', () => {
  isConnected = false;
});

redisClient.on('close', () => {
  isConnected = false;
});

redisClient.on('end', () => {
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
    if (!isConnected || redisClient.status !== 'ready') return null;
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      return null;
    }
  }

  static async set(key, data, ttl = config.REDIS_TTL) {
    if (!isConnected || redisClient.status !== 'ready') return false;
    try {
      await redisClient.set(key, JSON.stringify(data), 'EX', ttl);
      return true;
    } catch (err) {
      return false;
    }
  }

  static async del(keys) {
    if (!isConnected || redisClient.status !== 'ready') return false;
    try {
      const keyList = Array.isArray(keys) ? keys : [keys];
      if (keyList.length > 0) {
        await redisClient.unlink(...keyList);
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  static async clearPattern(pattern) {
    if (!isConnected || redisClient.status !== 'ready') return false;
    try {
      const keys = await redisClient.keys(pattern);
      if (keys && keys.length > 0) {
        await redisClient.unlink(...keys);
      }
      return true;
    } catch (err) {
      return false;
    }
  }
}

export default redisClient;