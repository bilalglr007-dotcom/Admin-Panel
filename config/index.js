export default {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  CONNECTION_STRING: process.env.CONNECTION_STRING || 'mongodb://127.0.0.1:27017/Admin_Panel',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || null,
  REDIS_TTL: process.env.REDIS_TTL || 300
};