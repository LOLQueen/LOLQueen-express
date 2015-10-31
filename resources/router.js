import { Router } from 'express';
import { handleErrors, wrap as $ } from './error-utils';
import { httpGetSummoners } from './summoners';
import { httpGetSummonerMatches } from './summoners/matches';
import { cache } from 'services/RedisCache';

const jsonCache = () => cache({ type: 'application/json' });

export default Router()
  .get('/:region/summoners', $(httpGetSummoners))
  .get('/:region/summoners/:summonerId/matches', jsonCache())
  .get('/:region/summoners/:summonerId/matches', $(httpGetSummonerMatches))
  .use(handleErrors);
