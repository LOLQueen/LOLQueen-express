import {expect} from 'chai';
import {fetchStaticFromRiot, fetchFromRiot} from './helpers';

export function fetchSummoners({names, region}) {
  expect(names).to.be.an('array');
  return fetchFromRiot({
    region, url: `v1.4/summoner/by-name/${names}`
  });
}

export function fetchGames({region, summonerId}) {
  return fetchFromRiot({
    region, url: `v1.3/game/by-summoner/${summonerId}/recent`
  });
}

export function fetchChampion({region, id}) {
  return fetchStaticFromRiot({
    region, url: `/v1.2/champion/${id}`
  });
}