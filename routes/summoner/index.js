import { fetchSummoners } from 'services/RIOTApi';
import { makeRouter } from 'utils';

let router = makeRouter();

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