
var grouper = require('./GC_Grouper');

var resource = "https://www.slimstore.com.ua";
var fs = require('fs');


var mysql      = require('mysql');

var connection = mysql.createConnection({
	host     : '127.0.0.1',
	user     : 'root',
	password : '',
	database : 'neuro_data'
});

//connection.connect();
var cheerio = require("cheerio");
var request = require("request");

var $ = cheerio.load(fs.readFileSync('./templates/test.html'));
var bod = $('body');

var phantom = require('phantom');
phantom.create().then(function(ph) {
	return ph.createPage().then(function(page) {
		return page.open(resource).then(function(status) {


				page.evaluate(function() {
					window.scrollBy( 0, 10000 );
					return window.pageYOffset;
				}).then(function(r){
					page.content;
					console.log(r);
				});
		});
	});
});


grouper.updateInfoTree(bod[0]);

var element1 = $('.col-smb-12')[0];
var element2 = $('.col-xs-12')[1];
console.log(grouper.el2elComparsion(element1, element2));




request({
	uri:resource,
}, function(error, response, body) {
	var $ = cheerio.load(body);

});
/*
http.get(options, function(res, b) {
	console.log("Got response: " + JSON.stringify(res));
}).on('error', function(e) {
	console.log("Got error: " + e.message);
});
*/

