import {fetchGames} from 'services/RIOTApi';
import {handleError, makeRouter} from 'utils';

let router = makeRouter();

router.get('/', async function(request, response){
  const region = request.params.region;
  const summonerId = request.query['summoner-id'];

  try {
    const matches = await fetchGames({region, summonerId});
    response.send(matches);

  } catch (ex) {
    handleError(response, {
      error: ex
    });
  }
});

export default router;