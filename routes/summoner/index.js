import { Router } from 'express';
import { fetchSummoners } from 'services/RIOTApi';

let router = Router({
  mergeParams: true
});

const toArray = x => Array.isArray(x) ? x : [x];

router.get('/', async function(request, response) {
  const region = request.params.region;
  const names = toArray(request.query.names);

  try {
    const body = await fetchSummoners({
      names, region
    });
    
    response.send(body);

  } catch (ex) {
    response.end('whoops');
  }

});

export default router;