import request from 'request';
import bluebird from 'bluebird';
import {API_KEY} from '../secrets';
import {expect} from 'chai';
import {prop} from 'ramda';

const $request = bluebird.promisify(request);
const BASE_URL = `https://na.api.pvp.net`;

function fetchFromRiot({region, url}) {
  expect(region).to.be.ok;
  expect(url).to.be.a('string');
  return $request({
    method: 'GET',
    uri: `${BASE_URL}/api/lol/${region}/${url}`,
    qs: {
      api_key: API_KEY, 
    },
  }).then(prop(1));
}


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