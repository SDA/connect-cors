// Start a server with CORS support.

var connect = require('connect');
var cors = require('../lib/connect-cors.js');
var http = require('http');

// Server configuration.
var ip = process.env.IP || '127.0.0.1';
var port = process.env.PORT || 8080;

var app = connect()
	.use(cors())
	.use(function(req, res){
		res.end('Hello World!\n');
	});

var server = http.createServer(app);
server.listen(port, ip);

// Test the server.

var assert = require('assert');
var request = require('request');
var seq = require('seq');

seq()
	.seq(function() {
		request({ uri: 'http://' + ip + ':' + port + '/', method: 'OPTIONS' }, this);
	})
	.seq(function(error, response) {
		if (!response) { response = error; error = null; }
		try {
			assert(response.statusCode === 200);
			assert(response.headers['access-control-allow-origin'] === '*');
			assert(response.headers['access-control-allow-methods'] === 'POST, GET, PUT, DELETE, OPTIONS');
			assert(response.headers['access-control-allow-credentials'] === 'true');
			assert(response.headers['access-control-max-age'] === '86400');
			assert(response.headers['access-control-allow-headers'] == 'Accept, Authorization, Content-Type, Origin, X-API-Version, X-HTTP-Method-Override, X-Requested-With');
		}
		catch (e) {
			console.log(e);
		}

		request({ uri: 'http://' + ip + ':' + port + '/', method: 'GET' }, this);
	})
	.seq(function(error, response, body) {
		if (!body) { body = response; response = error; error = null; }
		try {
			assert(response.statusCode === 200);
			assert(response.headers['access-control-allow-origin'] === '*');
			assert(response.headers['access-control-allow-methods'] === 'POST, GET, PUT, DELETE, OPTIONS');
			assert(response.headers['access-control-allow-credentials'] === 'true');
			assert(response.headers['access-control-max-age'] === '86400');
			assert(response.headers['access-control-allow-headers'] == 'Accept, Authorization, Content-Type, Origin, X-API-Version, X-HTTP-Method-Override, X-Requested-With');
		}
		catch (e) {
			console.log(e);
		}

		server.close();
	});
