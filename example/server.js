var connect = require('connect');
var cors = require('../lib/connect-cors.js');
var http = require('http');

var app = connect()
	.use(cors({log: true}))
	.use(function(req, res){
		res.end('Hello World!\n');
	});

http.createServer(app).listen(8080);
