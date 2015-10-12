require('babel-core/polyfill');
require('babel-core/register')({
  experimental: true,
});

require('app-module-path').addPath(__dirname);

// start server
require('./server.js');
