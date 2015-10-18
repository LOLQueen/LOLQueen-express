import ExpressRedisCache from 'express-redis-cache';

const RedisCache = ExpressRedisCache();

export default RedisCache;
export const cache = ::RedisCache.route;
