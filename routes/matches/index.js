import {
  fetchGames,
  fetchChampion,
  fetchSpell,
  fetchItem,
  fetchSummoner,
} from 'services/RIOTApi';
import {handleError, makeRouter} from 'utils';
import {map, propEq, clone} from 'ramda';

let router = makeRouter();

router.get('/', async function(request, response){
  const region = request.params.region;
  const summonerId = request.query['summoner-id'];

  try {
    const {games} = await fetchGames({ region, summonerId });
    response.send(await* map(transformGameToMatch)(games));
  } catch (ex) {
    handleError(response, {
      error: ex
    });
  }
});

const isTeamPurple = propEq('teamId', 200);
const isTeamBlue = propEq('teamId', 100);

async function transformTeam(region, team) {
  return await* team.map(async (player) => {
    return {
      champion: await fetchChampion({
        region, id: player.championId
      }),
      summoner: await fetchSummoner({
        region, id: player.summonerId
      }),
    };
  });
}

async function transformGameToMatch(game) {
  const region = 'na';
  const purpleTeam = game.fellowPlayers.filter(isTeamPurple);
  const blueTeam = game.fellowPlayers.filter(isTeamBlue);
  return {
    info: {
      occuredAt: game.createDate,
      queueType: game.subType,
      gameLength: null,
      didWin: game.stats.win,
    },
    champion: await fetchChampion({
      region, id: game.championId,
    }),
    spells: await* [1, 2].map(i => fetchSpell({
      region, id: game[`spell${i}`],
    })),
    items: await* [0, 1, 2, 3, 4, 5].map(i => fetchItem({
      region, id: game.stats[`item${i}`],
    })),
    trinket: await fetchItem({
      region, id: game.stats.item6,
    }),
    teams: {
      blue: await transformTeam(region, blueTeam),
      purple: await transformTeam(region, purpleTeam),
    },
    team: isTeamBlue(game) ? 'blue' : 'purple',
    stats: clone(game.stats)
  };
}

export default router;
