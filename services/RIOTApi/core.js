import fetch from 'isomorphic-fetch';
import { stringify } from 'querystring';
import { prop, composeP, invoker, merge } from 'ramda';
import { API_KEY } from 'secrets';
import bluebird from 'bluebird';

const RIOT_API = `https://na.api.pvp.net/api/lol`;
const RIOT_STATIC_API = `https://global.api.pvp.net/api/lol/static-data`;

function createFetchFn(apiUrl) {
  return function fetchFn({ region, url, query = {} }) {
    const qs = stringify(merge(query, { 'api_key': API_KEY }));
    const location = `${apiUrl}/${region}/${url}?${qs}`;

    return fetch(location)
      .then(checkStatus)
      .catch(retry)
      .then(invoker(0, 'json'));
  };
}

function retry(error) {
  const { status, url, headers } = error.response;
  switch (status) {
    case 429:
      const seconds = Number(headers.get('retry-after')[0]);
      return bluebird
        .delay(seconds * 1000)
        .then(() => fetch(url));
    default:
      throw error;
  }
}

export const fetchFromRiot = createFetchFn(RIOT_API);
export const fetchStaticFromRiot = composeP(
  prop('data'),
  createFetchFn(RIOT_STATIC_API)
);

function checkStatus(response) {
  if (response.status >= 200 && response.status < 400) {
    return response;
  }
  throw Object.assign(
    new Error(response.statusText),
    { response }
  );
}
