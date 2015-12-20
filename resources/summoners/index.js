import { fetchSummoners } from 'services/RIOTApi';
const toArray = x => Array.isArray(x) ? x : [x];

export async function httpGetSummoners(request, response) {
  const region = request.params.region;
  const names = toArray(request.query.names);
  response.send(await fetchSummoners({
    names, region, fetchRanks: true,
  }));
}
