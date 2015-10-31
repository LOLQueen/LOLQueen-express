import express from 'express';
import http from 'http';
import cors from 'cors';
import RedisCache from 'services/RedisCache';
import { green, red } from 'colors/safe';
import router from 'resources/router';

RedisCache.on('message', (message) => {
  console.log(`${green.bold('RedisCache Message:')} ${message}`);
});

RedisCache.on('error', (message) => {
  console.error(`${red.bold('RedisCache Message:')} ${message}`);
});

const server = http.createServer(
  express()
    .use(cors())
    .use(router)
);

server.listen(9000, ()=> {
  console.log(green.bold('Listening to port 9000!'));
});
