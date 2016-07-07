'use strict';
var grouper = require('./Backend/GC_Grouper.js');

var resource = "https://www.slimstore.com.ua";
var _ = require('underscore');
var url = require('url');


var AppClass = require('./Backend/App.js');

const sourceFromDisk = 1;
const sourceFromPhantom = 2;


var app = new AppClass.App();
app.loadTemplate('./templates/test.html', callClassificator);


var mode = sourceFromDisk;

var mysql = require('mysql');

var connection = mysql.createConnection({
	host     : '127.0.0.1',
	user     : 'root',
	password : '',
	database : 'neuro_data'
});




function callClassificator(body, $) {
	var gc_grouper = new grouper.GcGrouper($);
	gc_grouper.updateInfoTree(body[0]);

	var element1 = $('.col-md-4')[2];

	var rule = gc_grouper.getRule(element1, body[0]);

	var obj = gc_grouper.getObjByRule(rule, body[0]);
	console.log;

	gc_grouper.findModel(body)


	var elementFail = $('.col-smb-12')[0];
	var element1 = $('.item-inner')[0];
	var element2 = $('.item-inner')[1];

	var res = gc_grouper.t2tSuperposition(element1, element2);
	console.log('real t2t: ' + res);


	var res = gc_grouper.t2tSuperposition(element1, elementFail);
	console.log('error t2t: ' + res);
}


