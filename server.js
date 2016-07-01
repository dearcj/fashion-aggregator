'use strict';
var grouper = require('./Backend/GC_Grouper.js');

var resource = "https://www.slimstore.com.ua";
var fs = require('fs');
var _ = require('underscore');
var url = require('url');
var https = require('https');
var http = require('http');

var imagesize = require('imagesize');

const sourceFromDisk = 1;
const sourceFromPhantom = 2;

var mode = sourceFromDisk;

var mysql = require('mysql');

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

function fastImageSize(uu, cb) {
	console.log('!!!!!!!!!!');
	var protocol = null;
	if (uu.indexOf('https:') == 0)
	protocol = https;

	if (uu.indexOf('http:') == 0)
	protocol = http;

	uu = encodeURI(uu);
	console.log(uu);
	if (protocol) {
		var request =	protocol.get(uu, function (response) {
			var chunks = [];
			imagesize(response, function (err, result) {
				// do something with result
				console.log('----', result.width);
				// we don't need more data
				request.abort();
			});


		});
	} else cb(false);
}


function callClassificator(body) {
	var gc_grouper = new grouper.gc_grouper();
	gc_grouper.updateInfoTree(body[0]);


	var element1 = $('.images1')[0];

	var imgs = gc_grouper.collectAllImages(body[0]);

	_.each(imgs, function(x) {
		var t = fastImageSize(x.attribs['src'], function (res) {
			console.log(JSON.stringify(res));

		});
	});

	var elementFail = $('.col-smb-12')[0];
	var element1 = $('.item-inner')[0];
	var element2 = $('.item-inner')[1];

	var res = gc_grouper.t2tSuperposition(element1, element2);
	console.log('real t2t: ' + res);


	var res = gc_grouper.t2tSuperposition(element1, elementFail);
	console.log('error t2t: ' + res);
}



