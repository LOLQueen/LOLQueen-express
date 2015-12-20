import {
  fetchChampion,
  fetchChampions,
  fetchSpell,
  fetchItem,
  fetchSummoners,
} from 'services/RIOTApi';

import { propEq, clone, compose, pluck, chain, merge, map, filter } from 'ramda';

const isTeamPurple = propEq('teamId', 200);
const isTeamBlue = propEq('teamId', 100);

function transformGameToMatch(region) {
  return async (game) => {
    const purpleTeam = game.fellowPlayers.filter(isTeamPurple);
    const blueTeam = game.fellowPlayers.filter(isTeamBlue);
    return {
      id: game.gameId,
      info: {
        occurredAt: game.createDate,
        queueType: game.subType,
        gameLength: game.stats.timePlayed * 1000,
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
      stats: clone(game.stats),
    };
  };
}

const extractSummonerIds = compose(
  chain(pluck('summonerId')),
  filter(Boolean),
  pluck('fellowPlayers')
);

async function transformPlayersInGames(region, games) {
  const summonerIds = extractSummonerIds(games);
  const summoners = await fetchSummoners({
    region, ids: summonerIds, fetchRanks: false,
  });
  const champions = await fetchChampions({ region });

  return games.map((game) => {
    const { fellowPlayers = [] } = game;
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

export default (region) => async (games) => {
  return await* map(
    transformGameToMatch(region),
    await transformPlayersInGames(region, games)
  );
};
