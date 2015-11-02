import { fetchGames } from 'services/RIOTApi';

export async function httpGetSummonerMatches(request, response) {
  const { region, summonerId } = request.params;
  response.send(await fetchGames({
    region, summonerId,
  }));
}
