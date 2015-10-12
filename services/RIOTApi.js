import request from 'request';
import bluebird from 'bluebird';
import {API_KEY} from '../secrets';
import {expect} from 'chai';
import {prop} from 'ramda';

const $request = bluebird.promisify(request);
const BASE_URL = `https://na.api.pvp.net`;


export function fetchSummoners({names, region}) {
  expect(names).to.be.an('array');
  
  return $request({
    method: 'GET',
    uri: `${BASE_URL}/api/lol/${region}/v1.4/summoner/by-name/${names}`,
    qs: {
      api_key: API_KEY, 
    },
  })
    .then(prop(1));
}