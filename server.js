import express from 'express';
import http from 'http';
import cors from 'cors';
import RedisCache from 'services/RedisCache';
import { green, red } from 'colors/safe';

RedisCache.on('message', (message) => {
  console.log(`${green.bold('RedisCache Message:')} ${message}`);
});

RedisCache.on('error', (message) => {
  console.log(`${red.bold('RedisCache Message:')} ${message}`);
});

import routes from 'routes';

const server = http.createServer(
  express()
    .use(cors())
    .use('/:region', routes)
);

server.listen(9000, ()=> {
  console.log(green.bold('Listening to port 9000!'));
});
