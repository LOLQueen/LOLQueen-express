var requireDir = require('require-dir');
var path = require('path');

// setup global secrets folder
GLOBAL.Secret = requireDir('./secrets');

// start server
require('./app.js');
