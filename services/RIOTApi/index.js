import { fetchStaticFromRiot, fetchFromRiot } from './core';
import {
  transformChampion,
  transformSummoner,
  transformSpell,
  transformItem,
} from './transforms';

import {
  prop,
  values,
  mergeAll,
  splitEvery,
  uniq,
  compose,
} from 'ramda';

const intoFourties = compose(splitEvery(40), uniq);

async function reindexWith(fn, key, data) {
  return values(data).reduce(async (map, item) => (
    (await map)[item[key]] = await fn(item), map
  ), {});
}

export async function fetchSummoners({ names, ids, region }) {
  const array = intoFourties(ids ? ids : names);
  return mergeAll(await* array.map(async (params) => {
    return reindexWith(
      transformSummoner, 'id', await fetchFromRiot({
        region, url: `v1.4/summoner/${ids ? params : `by-name/${params}`}`,
      })
    );
  }));
}

export async function fetchGames({ region, summonerId }) {
  return summonerId && await fetchFromRiot({
    region, url: `v1.3/game/by-summoner/${summonerId}/recent`,
  });
}

export async function fetchChampions({ region }) {
  return reindexWith(
    transformChampion, 'id', await fetchStaticFromRiot({
      region, url: `v1.2/champion`,
    })
  );
}

async function fetchSpells({ region }) {
  return reindexWith(
    transformSpell, 'id', await fetchStaticFromRiot({
      region, url: `v1.2/summoner-spell`,
    })
  );
}

async function fetchItems({ region }) {
  return reindexWith(
    transformItem, 'id', await fetchStaticFromRiot({
      region, url: `v1.2/item`,
    })
  );
}

export async function fetchSummoner({ region, id }) {
  return id && prop(
    id, await fetchSummoners({ region, ids: [id] })
  );
}

export async function fetchMatch({ region, id, timeline = true }) {
  return id && await fetchFromRiot({
    region, url: `v2.2/match/${id}`, query: {
      includeTimeline: timeline,
    },
  });
}

export const fetchChampion = fetchSingleWith(fetchChampions);
export const fetchSpell = fetchSingleWith(fetchSpells);
export const fetchItem = fetchSingleWith(fetchItems);

function fetchSingleWith(fn) {
  const store = {};
  return async function fetchFn({ region, id }) {
    store[region] = store[region] || fn({ region });
    const data = await store[region];
    return id && data[id];
  };
}
