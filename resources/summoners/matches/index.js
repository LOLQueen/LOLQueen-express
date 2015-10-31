import { fetchGames } from 'services/RIOTApi';
import transformToMatches from './transform';

export async function httpGetSummonerMatches(request, response) {
  const { region, summonerId } = request.params;
  const { games } = await fetchGames({
    region, summonerId,
  });
  response.send(
    await transformToMatches(region, games)
  );
}
