(function() {

	function handler(opt) {
		// Default options.
		var defaults = {
			credentials: true,
			headers: ['Accept', 'Authorization', 'Content-Type', 'ETag', 'Origin', 'X-API-Version', 'X-HTTP-Method-Override', 'X-Requested-With'],
			log: false,
			maxAge: '86400', // 24 hours
			methods: 'POST, GET, PUT, DELETE, OPTIONS',
			origin: '*'
		}

		// Merge given options with defaults.
		var options = opt || defaults;
		for (prop in defaults) { 
			if (prop in options) { continue; }
			options[prop] = defaults[prop];
		}

		return function(req, res, next) {
			// Handle OPTIONS method.
			if (req.method === 'OPTIONS') {
				if (options.log) console.log('Incoming OPTIONS');

				// IE8 does not allow domains to be specified for 'Access-Control-Allow-Origin'.
				// Only * is allowed.

				var headers = {};
				headers["Access-Control-Allow-Origin"] = options.origin;
				headers["Access-Control-Allow-Methods"] = options.methods;
				headers["Access-Control-Allow-Credentials"] = options.credentials ? 'true' : 'false';
				headers["Access-Control-Max-Age"] = options.maxAge;
				headers["Access-Control-Allow-Headers"] = options.headers.join(", ");
				headers["Access-Control-Expose-Headers"] = options.headers.join(", ");
				res.writeHead(200, headers);
				res.end();

				if (options.log) { console.log('Sent headers:'); console.log(headers); }

				return;
			}

			// All other requests.

			// Save the original writeHead function.
			var writeHead = res.writeHead;

			// Wrap writeHead to update response headers.
			res.writeHead = function(code, headers) {
				// Put the original back.
				res.writeHead = writeHead;

				// Modify the headers.
				headers = headers || {};
				headers["Access-Control-Allow-Origin"] = options.origin;
				headers["Access-Control-Allow-Methods"] = options.methods;
				headers["Access-Control-Allow-Credentials"] = options.credentials ? 'true' : 'false';
				headers["Access-Control-Max-Age"] = options.maxAge;
				headers["Access-Control-Allow-Headers"] = options.headers.join(", ");
				headers["Access-Control-Expose-Headers"] = options.headers.join(", ");

				// Call the original.
				res.writeHead(code, headers);

				if (options.log) { console.log('Sent headers:'); console.log(headers); }
			};

			next();
		}
	}

	module.exports = handler;

})();
