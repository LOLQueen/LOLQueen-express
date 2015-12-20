import { merge } from 'ramda';
import { fetchSummonerRanks } from '../index';

const DRAGON_URL = `http://ddragon.leagueoflegends.com/cdn/5.22.3/img`;

export async function transformChampion(champ) {
  return merge(champ, {
    imageUrl: `${DRAGON_URL}/champion/${champ.key}.png`,
  });
}

export function transformSummoner(region) {
  return async (summoner) => {
    return {
      id: summoner.id,
      name: summoner.name,
      ranks: await fetchSummonerRanks({ region, id: summoner.id }),
      region: region,
      level: summoner.summonerLevel,
      profileIcon: {
        id: summoner.profileIconId,
        imageUrl: `${DRAGON_URL}/profileicon/${summoner.profileIconId}.png`,
      },
    };
  };
}

export async function transformItem(item) {
  return merge(item, {
    imageUrl: `${DRAGON_URL}/item/${item.id}.png`,
  });
}

export async function transformSpell(spell) {
  return merge(spell, {
    imageUrl: `${DRAGON_URL}/spell/${spell.key}.png`,
  });
}

function createDivisionImageURL(tier, division) {
  return `/src/assets/tier-icons/${tier}_${division}.png`.toLowerCase();
}

export async function transformSummonerRank(rank) {
  const divisionInfo = rank.entries[0];
  return merge(divisionInfo, {
    name: rank.name,
    tier: {
      name: rank.tier,
      imageUrl: createDivisionImageURL(rank.tier, divisionInfo.division),
    },
    queue: rank.queue,
  });
}

export { default as transformGames } from './games';
