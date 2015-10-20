import {merge} from 'ramda';
const DRAGON_URL = `http://ddragon.leagueoflegends.com/cdn/5.20.1/img`;

export async function transformChampion(champ) {
  return merge(champ, {
    imageUrl: `${DRAGON_URL}/champion/${champ.key}.png`
  });
}

export async function transformSummoner(summoner) {
  return {
    id: summoner.id,
    name: summoner.name,
    profileIcon: {
      id: summoner.profileIconId,
      imageUrl: `${DRAGON_URL}/profileicon/${summoner.profileIconId}.png`,
    },
    level: summoner.summonerLevel,
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
