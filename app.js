var http = require('http');
var url = require('url');
var express = require('express');

var bluebird = require('bluebird');
var redis = bluebird.promisifyAll(require('redis'), {suffix: '$'});
var request = bluebird.promisifyAll(require('request'), {suffix: '$'});

var apiKey = Secret['api-key'];

// create redis client
var client  = redis.createClient(6379, '127.0.0.1');

var app     = express();
var server  = http.createServer(app);

app.use('/assets/dragon', express.static('./public/dragon/5.6.1'));

app.use(function(req, res){

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var URL = url.parse(req.url, true);

    // if we get ?refresh=1 or ?refresh=true or ?refresh, hit the RIOT API directly
    // else, hit our cache instead
    var awaitResponse = (~['true', '1', ''].indexOf(URL.query.refresh))
        ?   fetchData(URL.pathname, 24*60*60)
        :   checkCache(URL.pathname)
                .then(function(response){
                    return response || fetchData(URL.pathname, 24*60*60);
                });

    awaitResponse
        .then(function(response){
            res.statusCode = response.statusCode;
            res.end(response.body);
        })
        .catch(function(){
            console.log.apply(console, arguments);

            res.statusCode = 500;
            res.end(JSON.stringify({
                error: {
                    title: 'LOLQueen server Error!',
                    message: 'An error occured while fetching data from the RIOT API.'
                }
            }));
        });
});

function checkCache(pathname){
    return client.get$(pathname)
        .then(function(reply){
            return reply && {
                statusCode:200,
                body:reply
            };
        });
}

function fetchData(pathname, expire){

    var link = url.format({
        protocol: 'https',
        slashes: true,
        hostname: 'na.api.pvp.net',
        query: {
            api_key: apiKey
        },
        pathname: pathname
    });

    // will hold the eventual response
    var response = null;

    // start fetching data
    return request.get$({url: link, json: false})
        .then(function(results){
            response = results[0];

            // don't save to cache if error was sent by api
            if (String(response.statusCode)[0] !== '2') {
                throw 'RIOT API sent an error!';
            }

            return client.set$(pathname, response.body);
        })
        .then(function(){
            return client.expire$(pathname, expire);
        })
        .catch(console.log)
        .then(function(){
            return response;
        });
}

client.on('error', function(err){
    console.log(err);
});

server.listen(9000, function(){
    console.log('Starting proxy on port 9000!');
});

server.on('close', function(){
    client.quit();
});
