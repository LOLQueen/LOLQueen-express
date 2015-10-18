import {expect} from 'chai';
import {fetchStaticFromRiot, fetchFromRiot} from './core';
import {
  transformChampion,
  transformSummoner,
} from './transforms';

import {prop, values} from 'ramda';

export async function fetchSummoners({names, region}) {
  expect(names).to.be.an('array');
  return fetchFromRiot({
    region, url: `v1.4/summoner/by-name/${names}`
  });
}

export async function fetchSummoner({region, id}) {
  return id && (await fetchFromRiot({
    region, url: `v1.4/summoner/${id}`
  }))[id];
}

export async function fetchGames({region, summonerId}) {
  return summonerId && await fetchFromRiot({
    region, url: `v1.3/game/by-summoner/${summonerId}/recent`
  });
}

async function fetchChampions({region}) {
  const response = await fetchStaticFromRiot({
    region, url: `v1.2/champion`
  });
  return values(response.data).reduce((map, champ) => (
    map[champ.id] = transformChampion(champ), map
  ), {});
}

export const fetchChampion = () => {
  const store = {};
  return async function fetch({region, id}) {
    store[region] = store[region] || fetchChampions({region});
    const champions = await store[region];
    return id && champions[id];
  };
}();

export async function fetchSpell({region, id}) {
  return id && fetchStaticFromRiot({
    region, url: `v1.2/summoner-spell/${id}`
  });
}

export async function fetchItem({region, id}) {
  return id && fetchStaticFromRiot({
    region, url: `v1.2/item/${id}`
  });
}
