var http = require('http');
var request = require('request');
var url = require('url');

var apiKey = Secret['api-key'];

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

    request.get(link)
        .pipe(res);
});

server.listen(9000, function(){
    console.log('Starting proxy on port 9000!');
});
