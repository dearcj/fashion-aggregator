'use strict';
var grouper = require('../../Backend/GC_Grouper.js');
var express    = require('express');
var app        = express();
var dict = require('../../Backend/BTreeDictionary/BTDictionary.js');
var classify = require('../../Backend/Classify.js');
var api = require('../../Backend/API/api.js');
var _ = require('underscore');
var bodyParser = require('body-parser');

var AppClass = require('../../Backend/App.js');

const sourceFromDisk = 1;
const sourceFromPhantom = 2;


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





module.exports = {

  parse: function (req, res, next){
    if (req.query.linkp) next('No link provided'); else {

      next();
    }
  }


}
