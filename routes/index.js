import dirRequire from 'require-directory';
import { makeRouter } from 'utils';

const ROUTES = dirRequire(module, '.');
const ROUTE_NAMES = Object.keys(ROUTES);

export default ROUTE_NAMES.reduce((router, name) => (
  router.use(`/${name}`, ROUTES[name].index)
), makeRouter());
