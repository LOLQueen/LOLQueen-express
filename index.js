require('babel-core/polyfill');
require('babel-core/register')({
  experimental: true,
  optional: ['asyncToGenerator'],
});

require('app-module-path').addPath(__dirname);

// start server
require('./server.js');
