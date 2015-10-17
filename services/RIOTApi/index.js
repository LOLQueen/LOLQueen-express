import {expect} from 'chai';
import {fetchStaticFromRiot, fetchFromRiot} from './core';
import {
  transformChampion,
  transformSummoner,
} from './transforms';

export async function fetchSummoners({names, region}) {
  expect(names).to.be.an('array');
  return fetchFromRiot({
    region, url: `v1.4/summoner/by-name/${names}`
  });
}

export async function fetchSummoner({region, id}) {
  const summoners = await fetchFromRiot({
    region, url: `v1.4/summoner/${id}`
  });
  return id && transformSummoner(summoners[id]);
}

export async function fetchGames({region, summonerId}) {
  return summonerId && await fetchFromRiot({
    region, url: `v1.3/game/by-summoner/${summonerId}/recent`
  });
}

export async function fetchChampion({region, id}) {
  return id && transformChampion(await fetchStaticFromRiot({
    region, url: `v1.2/champion/${id}`
  }));
}

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
