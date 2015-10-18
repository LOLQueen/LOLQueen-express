import ExpressRedisCache from 'express-redis-cache';

const TEN_MINUTES = 60 * 10;

const RedisCache = ExpressRedisCache({
  expire: TEN_MINUTES,
});

export default RedisCache;
export const cache = ::RedisCache.route;
