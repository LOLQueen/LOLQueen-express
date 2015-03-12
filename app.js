var http = require('http');
var url = require('url');

var bluebird = require('bluebird');
var redis = bluebird.promisifyAll(require('redis'), {suffix: '$'});
var request = bluebird.promisifyAll(require('request'), {suffix: '$'});

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

    client.get$(req.url)
        .then(function(reply){
            var response = {
                statusCode: 200,
                body: reply
            };

            if (reply) { return response; }

            return request.get$({url: link, json: false})
                .then(function(results){
                    response = results[0];
                    return client.set$(req.url, results[1]);
                })
                .then(function(){
                    return client.expire$(req.url, 24*60*60);
                })
                .then(function(){
                    return response;
                });

        })
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

client.on('error', function(err){
    console.log(err);
});

server.listen(9000, function(){
    console.log('Starting proxy on port 9000!');
});

server.on('close', function(){
    client.quit();
});
