import { fetchSummoners } from 'services/RIOTApi';
import { makeRouter, handleErrors } from 'utils';

const toArray = x => Array.isArray(x) ? x : [x];

export default makeRouter()
  .get('/', async (request, response) => {
    const region = request.params.region;
    const names = toArray(request.query.names);

    try {
      const body = await fetchSummoners({
        names, region,
      });
      response.send(body);
    } catch (ex) {
      handleErrors(response, {
        error: ex,
      });
    }
  }
);
