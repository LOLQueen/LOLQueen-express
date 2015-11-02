import { merge } from 'ramda';
const DRAGON_URL = `http://ddragon.leagueoflegends.com/cdn/5.20.1/img`;

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
