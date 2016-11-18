var http = require('http');
let cheerio = require('cheerio');

function MyLikesApi(){
	let options = {
		'9gag': {
		    host: '9gag.com',
		    path: '/u/lackmybills/likes'
		},
		'imgur' : {
			host : 'imgur.com',
			path : '/user/sladix/favorites'
		}
	}
	
	// Define parsers

	this.parse = function(service,html){
		if(service == '9gag')
		{
			return this.parse9gag(html)
		}else if(service == 'imgur'){
			return this.parseImgur(html);
		}
	}

	this.parseImgur = function(html){
		let dom = cheerio.load(html);
		let objects = [];

		dom('.thumbs a').slice(0,4).each((i,elem) => {
			let image = dom(elem).find('img').first();
			let data = {
				title : image.data('original-title'),
				image_url : image.attr('src'),
				buttons : [
					{
						title : "voir",
						type : "web_url",
						url : dom(elem).data('href')
					}
				]
			}
			objects.push(data)
		})

		return objects;
	}


	this.parse9gag = function(html){
		let dom = cheerio.load(html);
		// On extrait tout le bazard
		let objects = [];

		dom('.badge-entry-collection article').slice(0,4).each((i,elem) =>{
			let image = dom(elem).find('img').first();
			let data = {
				title : image.attr('alt'),
				image_url : image.attr('src'),
				buttons : [
					{
						title : "voir",
						type : "web_url",
						url : dom(elem).data('entry-url')
					}
				]
			}
			objects.push(data)
		});
		return objects;
	}

	this.getLikedContent = function(){
		let s = options[Math.floor(Math.random() * options.length)];
		console.log("Choosen service : "+s);
		
		return new Promise((resolve,reject) => {
			this.getMyLikes(s).then((html) => {
				// on resolve avec les objets json tout faits
				resolve(this.parse(s,html));
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