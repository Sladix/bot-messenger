var http = require('http');
let cheerio = require('cheerio');

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

	this.getLikedContent = function(){
		let s = '9gag';
		
		return new Promise((resolve,reject) => {
			this.getMyLikes(s).then((html) => {
				let dom = cheerio.load(html);
				// On extrait tout le bazard
				let objects = [];

				dom('.badge-entry-collection article').each((i,elem) =>{
					let image = dom(this).find('img');
					console.log(image)
					let data = {
						title : image.attr('alt'),
						image_url : image.attr('src'),
						buttons : [
							{
								title : "voir",
								type : "web_url",
								url : dom(this).data('entry-url')
							}
						]
					}
					objects.push(data);
				});
				console.log(objects);
				// On forme un bouton ou un template de contenu

				// on resolve avec les objets json tout faits
				resolve(objects);
			}).catch((err) => {
				console.log("erreur parse");
				console.log(err);
			})

		});
	}
	
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