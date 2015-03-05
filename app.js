var http = require('http');
var request = require('request');
var url = require('url');
var redis = require('redis');

var apiKey = Secret['api-key'];

// create redis client
var client = redis.createClient(6379, '127.0.0.1');

var server = http.createServer(function(req, res){
    var link = url.format({
        protocol: 'https',
        slashes: true,
        hostname: 'na.api.pvp.net',
        query: {
            api_key: apiKey
        },
        pathname: req.url
    });

    client.get(req.url, function(err, reply){
        if (reply) {
            res.end(reply);
            return;
        }

        request.get({url: link, json:false}, function(e, r, payload){
            client.set(req.url, payload, function(){
                client.expire(req.url, 24*60*60, function(){
                    res.end(payload);
                });
            });
        });
    });

});

client.on('error', function(err){
    console.log(err);
});

server.listen(9000, function(){
    console.log('Starting proxy on port 9000!');
});

server.on('close', function(){
    client.quit();
});
