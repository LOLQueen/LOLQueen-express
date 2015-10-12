import {fetchGames} from 'services/RIOTApi';
import {handleError, makeRouter} from 'utils';
import fs from 'fs';

let router = makeRouter();

router.get('/', async function(request, response){
  const region = request.params.region;
  const summonerId = request.query['summoner-id'];

  try {
    const {games} = await fetchGames({ region, summonerId });
    
    response.send(games);

  } catch (ex) {
    handleError(response, {
      error: ex
    });
  }
});



async function transformGameToMatch(game) {
  return {
    info: {
      occuredAt: game.createDate,
      queueType: game.subType,
      gameLength: null,
      didWin: game.stats.win,
    },
    champion: {

    }
  }
}

export default router;