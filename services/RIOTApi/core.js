import fetch from 'isomorphic-fetch';
import {stringify} from 'querystring';
import {expect} from 'chai';
import {prop, composeP, invoker} from 'ramda';
import {API_KEY} from 'secrets';

const RIOT_API = `https://na.api.pvp.net/api/lol`;
const RIOT_STATIC_API = `https://global.api.pvp.net/api/lol/static-data`;

function createFetchFn(apiUrl) {
  return function({region, url}) {
    const tokenQS = stringify({'api_key': API_KEY});
    const location = `${apiUrl}/${region}/${url}?${tokenQS}`;

    return fetch(location)
      .then(checkStatus)
      .then(invoker(0, 'json'));
  };
}

export const fetchFromRiot = createFetchFn(RIOT_API);
export const fetchStaticFromRiot = composeP(
  prop('data'),
  createFetchFn(RIOT_STATIC_API)
);

function checkStatus(response) {
  if (response.status >= 200 && response.status < 400) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}
