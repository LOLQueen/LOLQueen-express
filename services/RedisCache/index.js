import ExpressRedisCache from 'express-redis-cache';

const TWENTY_MINUTES = 60 * 20;

const RedisCache = ExpressRedisCache({
  expire: TWENTY_MINUTES,
});

export default RedisCache;
export const cache = ::RedisCache.route;
