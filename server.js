import express from 'express';
import http from 'http';

let app = express();

// requiring routes
import routes from 'routes';
app.use('/:region', routes);

let server = http.createServer(app);

server.listen(9000, ()=> {
  console.log('Listening to port 9000!');
});