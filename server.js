'use strict';
var grouper = require('./GC_Grouper');
var utls = require('./Utils.js');

var x = utls.argmax(Math.sin, [Math.PI, 0, Math.PI/2, Math.PI / 4]);
x;

var resource = "https://www.slimstore.com.ua";
var fs = require('fs');


const sourceFromDisk = 1;
const sourceFromPhantom = 2;

var mode = sourceFromDisk;

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



if (mode == sourceFromPhantom) {
	var phantom = require('phantom');
	phantom.create().then(function (ph) {
		return ph.createPage().then(function (page) {
			page.open(resource).then(function (status) {
				console.log(page.content);
				page.evaluate(function () {
					window.scrollBy(0, 10000);
					return window.pageYOffset;
				}).then(function (r) {
					var x = page.property('content').then(function (content) {
						var $ = cheerio.load(content);
						var bod = $('body');
						callClassificator(bod);
					});
				});
			});
		});
	});
}




if (mode == sourceFromDisk) {
	var $ = cheerio.load(fs.readFileSync('./templates/test.html'));
	var bod = $('body');
	callClassificator(bod);
}


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

function callClassificator(body) {

	grouper.updateInfoTree(body[0]);
	var element1 = $('.col-smb-12')[0];
	var element2 = $('.col-xs-12')[1];

	console.log(grouper.el2elComparsion(element1, element2));
}



