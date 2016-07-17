'use strict';
var grouper = require('./Backend/GC_Grouper.js');
var config = require('./config/config.js');
var express    = require('express');
var app        = express();
var dict = require('./Backend/BTreeDictionary/BTDictionary.js');
var classify = require('./Backend/Classify.js');
var api = require('./Backend/API/api.js');
var resource = "https://www.slimstore.com.ua";
var _ = require('underscore');
var bodyParser = require('body-parser');

var AppClass = require('./Backend/App.js');

const sourceFromDisk = 1;
const sourceFromPhantom = 2;




/*var mode = sourceFromDisk;

var pg = require('pg');
var pool = new pg.Pool(config.pgconnection);

function pgq (q, params, cb) {
	pool.connect(function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}
		client.query(q, params, function(err, result) {
			done();

			if(err) {
				return console.error('error running query', err);
			}
			cb(err, result.rows);
		});
	});

}

pgq('SELECT * FROM features f where f.name = $1', ['image'], function (err, res) {
});
*/

var gcapp = new AppClass.App();
gcapp.loadTemplate('./templates/comfy_rows_example.html', callClassificator);

function pgq (q, params, cb) {
  User.query({text: q, values: params}, function(err, results) {
    cb(err, result.rows);

    if (err) return res.serverError(err);
    return res.ok(results.rows);
  });
}


function callClassificator(body, $) {
	var d = new dict.BTDictionary();

	d.addWord('adobe', true);
	d.addWord('ax', true);
	d.addWord('bobbyy', false);

	var x = d.save();
	d.load(x);
	console.log(d.checkWord('adobe', true));
	console.log(d.checkWord('adob', true));
	var gc_grouper = new grouper.GcGrouper($, body[0]);
	gc_grouper.updateInfoTree();

	var grouperResult = gc_grouper.findModel(function (res) {
		console.log(res);
		if (res) {
			var l = gc_grouper.getListByRules(res.ruleHead, res.ruleElements);
		}
	});

}


