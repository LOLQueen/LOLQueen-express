import {
  fetchGames,
  fetchChampion,
  fetchChampions,
  fetchSpell,
  fetchItem,
  fetchSummoner,
  fetchSummoners,
} from 'services/RIOTApi';
import {handleError, makeRouter} from 'utils';
import {map, propEq, clone, __, prop, compose, pluck, chain, objOf, merge}
from 'ramda';

import {cache} from 'services/RedisCache';

let router = makeRouter();

router.get('/',
  cache({type: 'application/json'}),
  async function(request, response) {
  const region = request.params.region;
  const summonerId = request.query['summoner-id'];

  try {
    const {games} = await fetchGames({ region, summonerId });
    response.send(await* map(transformGameToMatch)(
      await transformPlayersInGames(region, games)
    ));
  } catch (ex) {
    handleError(response, {
      error: ex
    });
  }
});

const isTeamPurple = propEq('teamId', 200);
const isTeamBlue = propEq('teamId', 100);
const extract = (property) => compose(
  chain(pluck(property)),
  pluck('fellowPlayers')
);

async function transformPlayersInGames(region, games) {
  const summonerIds = extract('summonerId')(games);
  const championIds = extract('championId')(games);

  const summoners = await fetchSummoners({region, ids: summonerIds});
  const champions = await fetchChampions({region});

  return games.map((game) => {
    const fellowPlayers = game.fellowPlayers;
    return merge(game, {
      fellowPlayers: fellowPlayers.map((player) => {
        return player && {
          summoner: summoners[player.summonerId],
          champion: champions[player.championId],
          teamId: player.teamId,
        };
      }),
    });
  });
}

async function transformGameToMatch(game) {
  const region = 'na';
  const purpleTeam = game.fellowPlayers.filter(isTeamPurple);
  const blueTeam = game.fellowPlayers.filter(isTeamBlue);
  const stuff = {
    info: {
      occurredAt: game.createDate,
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
      blue: blueTeam,
      purple: purpleTeam,
    },
    team: isTeamBlue(game) ? 'blue' : 'purple',
    stats: clone(game.stats)
  };
  return stuff;
}

export default router;
