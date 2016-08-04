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
    d.addWord('adobe', true);
    d.addWord('ax', true);
    d.addWord('bobbyy', false);

    var x = d.save();
    d.load(x);

    d.removeWord('adobe');


   /* var f = new FBrand(pgq);
    f.initDictionary(function () {
      f.dict.addArray(brands);


      f.updateDictionary();
    });*/

   /* var f = new FCategory(pgq);
    f.initDictionary(function () {
      f.dict.addArray(cat2);
      f.dict.addArray(shoes);


      f.updateDictionary();
    });*/

   /* var f = new FPrice(pgq);
    f.initDictionary(function () {
      f.dict.addArray(prices);


      f.updateDictionary();
    });*/



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
