import request from 'request';
import bluebird from 'bluebird';
import {expect} from 'chai';
import {prop} from 'ramda';
import {API_KEY} from 'secrets';
import winston from 'winston';

const $request = bluebird.promisify(request);

const BASE_URL = `https://na.api.pvp.net`;
const STATIC_BASE_URL = `https://global.api.pvp.net`;

function fetch(base) {
  return function({region, url}) {
    expect(region).to.be.ok;
    expect(url).to.be.a('string');
    winston.log(`${base}/${region}/${url}`);

    return $request({
      method: 'GET',
      uri: `${base}/${region}/${url}`,
      qs: {
        'api_key': API_KEY,
      },
    })
      .then(prop(1))  // obtain the response body
      .then(JSON.parse);
  };
}

export const fetchFromRiot = fetch(`${BASE_URL}/api/lol`);
export const fetchStaticFromRiot =
fetch(`${STATIC_BASE_URL}/api/lol/static-data`);
