var phantom = require('phantom');
var cheerio = require('cheerio');
var fs = require('fs');


//'http://www.endclothing.com/'
loadDynamicPage('http://www.endclothing.com/', function(){
	
	
	console.log("all ok");
	
	
});

function loadDynamicPage(url, endCB) {
	console.log('loading dynamic page with polyfill');

	var obj = [];
	var urls = [];
	var pg= null, ph = null;

	phantom.create(['--ignore-ssl-errors=yes', '--load-images=no'])//, '--proxy=127.0.0.1:8888'])
	.then(function (instance) {
		ph = instance;
		return ph.createPage();


	})
	.then(function(page){
		pg = page;
		return pg.property('viewportSize', {width: 1024, height: 768});


	}).then(function(){
		return pg.setting('userAgent', 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1b2) Gecko/20081201 Firefox/3.1b2')


	}).then(function(){
		return pg.property('customHeaders', {
			"Accept-Language": "en-US,en;q=0.5"
		});

	}).then(function(){
		return pg.on('onResourceRequested', false, function(requestData, networkRequest){
			urls.push(requestData.url); // this would push the url into the urls array above

		});

	}).then(function(){
		return pg.on('onInitialized', true, function(page){
			this.injectJs('./helpers/phantom/polyfill.js');

		});

	}).then(function(){
		return pg.open(url);

	}).then(function(status){
		if(status){
			setTimeout(function(){
				pg.evaluate(function () {
					window.scrollBy(0, 10000);
					return window.pageYOffset;

				}).then(function (r) {
					pg.property('content')
					.then(function (content) {
						console.log(content)

						var $ = cheerio.load(content);
						var body = $('body');

						pg.close();
						ph.exit();
						endCB(body[0]);
					});
				});

			}, 5000);

		}else{
			pg.close();
			ph.exit();
			endCB();
		}

	}).catch(function(error){
		console.log(error);

		pg.close();
		ph.exit();
		endCB();
	})

}