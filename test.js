/**
 * Created by KURWINDALLAS on 19.07.2016.
 */
'use strict';
var _ = require('underscore');
var dict = require('./Backend/BTreeDictionary/BTDictionary.js');
var FCategory = require('./Backend/Features/FCategory.js').FCategory;
var FPrice = require('./Backend/Features/FPrice.js').FPrice;

var AppClass = require('./Backend/App.js');
var gcapp = new AppClass.App();
var Classify = require('./Backend/Classify.js').Classify;
var d = new dict.BTDictionary();


function pgq (q, params, cb) {
  User.query({text: q, values: params}, function(err, results) {

    var rows = null;
    if (results) rows = results.rows;
    cb(err, rows);
  });
}


module.exports = {
  runTest: function () {
    d.addWord('adobe', true, '123');
    d.addWord('ax', true, null);
    d.addWord('axa', true, null);

    d.addWord('bobbyy', false);
    d.removeWord('adobe', true, '123');

    //  d.addWordWithId('bobbyy', true, 1232);

    var x = d.save();
    console.log(x);
    d.load(x);
    console.log(d.save());

    d.removeWord('adobe');

    var x = d.save();
    d.load(x);

    gcapp.parse('https://marketplace.asos.com/men/shirts', function cb(res) {
      var alldata = [];
      for (var i = 0; i < res.length; ++i) {
        if (res[i][0]) {
          alldata = alldata.concat(res[i][0]);
        }
      }

      var cl = new Classify(pgq, gcapp.images);

      cl.loadFeatures(function complete (){
        var r = cl.analyzeList(alldata);
      });
    });
  }
}
