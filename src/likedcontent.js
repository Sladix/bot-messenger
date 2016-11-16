var http = require('http');

function MyLikesApi(){
	let options = {
		'9gag': {
		    host: '9gag.com',
		    path: '/u/lackmybills'
		},
		'imgur' : {
			host : 'imgur.com',
			path : '/user/sladix/favorites'
		}
	}
	
	// Define parsers
	
	this.getMyLikes = function(service){
		return new Promise(function(resolve,reject){
			let opts = options[service];
			if(!opts)
				reject("Bad service");
				
			let request = http.request(opts, function (res) {
			    let data = '';
			    res.on('data', function (chunk) {
			        data += chunk;
			    });
			    res.on('end', function () {
			        resolve(data);
			
			    });
			});
			request.on('error', function (e) {
			    reject(e.message);
			});
			request.end();
		})	
		
	}
	
	return this;
}

module.exports = { MyLikesApi }