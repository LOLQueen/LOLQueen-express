import {
  fetchChampion,
  fetchChampions,
  fetchSpell,
  fetchItem,
  fetchSummoners,
} from 'services/RIOTApi';

import { propEq, clone, compose, pluck, chain, merge, map } from 'ramda';

const isTeamPurple = propEq('teamId', 200);
const isTeamBlue = propEq('teamId', 100);

async function transformGameToMatch(game) {
  const region = 'na';
  const purpleTeam = game.fellowPlayers.filter(isTeamPurple);
  const blueTeam = game.fellowPlayers.filter(isTeamBlue);
  return {
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
    stats: clone(game.stats),
  };
}

const extractSummonerIds = compose(
  chain(pluck('summonerId')),
  pluck('fellowPlayers')
);

async function transformPlayersInGames(region, games) {
  const summonerIds = extractSummonerIds(games);

  const summoners = await fetchSummoners({ region, ids: summonerIds });
  const champions = await fetchChampions({ region });

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

export default async function transform(region, games) {
  return await* map(
    transformGameToMatch,
    await transformPlayersInGames(region, games)
  );
}
