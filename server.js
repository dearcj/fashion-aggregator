'use strict';
var grouper = require('./Backend/GC_Grouper.js');

var dict = require('./Backend/BTreeDictionary/BTDictionary.js');
var classify = require('./Backend/Classify.js');


var resource = "https://www.slimstore.com.ua";
var _ = require('underscore');

var AppClass = require('./Backend/App.js');

const sourceFromDisk = 1;
const sourceFromPhantom = 2;

var app = new AppClass.App();
app.loadTemplate('./templates/comfy_rows_example.html', callClassificator);

var mode = sourceFromDisk;

var pg = require('pg');

var config = {
	user: 'postgres',
	database: 'vagr',
	password: 'root',
	port: 5432,
	max: 10,
	idleTimeoutMillis: 30000,
};

var pool = new pg.Pool(config);

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

		var l = gc_grouper.getListByRules(res.ruleHead, res.ruleElements);
	});

	console;
	//slimstore case
	/*
	var element1 = $('.col-md-4')[2];
	var rule = gc_grouper.getRule(element1, body[0]);
	var obj = gc_grouper.getObjByRule(rule, body[0]);
	gc_grouper.findModel(body);

	var elementFail = $('.col-smb-12')[0];
	var element1 = $('.item-inner')[0];
	var element2 = $('.item-inner')[1];

	var res = gc_grouper.t2tSuperposition(element1, element2);


	var res = gc_grouper.t2tSuperposition(element1, elementFail);
	*/
}



