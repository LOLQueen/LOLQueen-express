import dirRequire from 'require-directory';
import { makeRouter } from 'utils';

const ROUTES = dirRequire(module, '.');
const ROUTE_NAMES = Object.keys(ROUTES);

const router = ROUTE_NAMES.reduce(function(router, name){
  router.use(`/${name}`, ROUTES[name].index);
  return router;
}, makeRouter());

export default router;