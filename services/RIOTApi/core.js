import fetch from 'isomorphic-fetch';
import { stringify } from 'querystring';
import { prop, composeP, merge } from 'ramda';
import { API_KEY } from 'secrets';
import bluebird from 'bluebird';
import { createWriteStream } from 'fs';

const output = createWriteStream(`${__dirname}/../../network.clog`, {
  flags: 'a',
});

const RIOT_API = `https://na.api.pvp.net/api/lol`;
const RIOT_STATIC_API = `https://global.api.pvp.net/api/lol/static-data`;

export const fetchFromRiot = createFetchFn(RIOT_API);
export const fetchStaticFromRiot = composeP(
  prop('data'),
  createFetchFn(RIOT_STATIC_API)
);

const fetchFromUrl = (url) => fetch(url)
  .then(checkStatus)
  .catch(retry);

function createFetchFn(baseAPIUrl) {
  return ({ region, url, query = {} }) => {
    const resourceUrl = `${baseAPIUrl}/${region}/${url}?${
      stringify(merge(query, { 'api_key': API_KEY }))
    }`;
    output.write(`${Date.now()}: ${resourceUrl}\n`);
    return fetchFromUrl(resourceUrl)
      .then(response => response.json());
  };
}

function retry(error) {
  const { status, url, headers } = error.response;
  switch (status) {
    case 429:
      const seconds = Number(headers.get('retry-after')[0]);
      return bluebird
        .delay(seconds * 1000)
        .then(() => fetchFromUrl(url));
    default:
      throw error;
  }
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 400) {
    return response;
  }
  throw Object.assign(
    new Error(response.statusText),
    { response }
  );
}
