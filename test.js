/**
 * Created by KURWINDALLAS on 19.07.2016.
 */
'use strict';
var _ = require('underscore');
var dict = require('./Backend/BTreeDictionary/BTDictionary.js');

var AppClass = require('./Backend/App.js');
var gcapp = new AppClass.App();
var Classify = require('./Backend/Classify.js').Classify;
var d = new dict.BTDictionary();


function pgq (q, params, cb) {
  User.query({text: q, values: params}, function(err, results) {
    cb(err, results.rows);
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

    console.log(d.checkWord('adobe', true));
    console.log(d.checkWord('adob', true));

    var x = d.save();
    d.load(x);

    gcapp.parse('http://www.asos.com/men/new-in-clothing/cat/pgecategory.aspx?cid=6993&via=top#parentID=-1&pge=:page&pgeSize=36&sort=-1', function cb(res) {
      var alldata = [];
      for (var i = 0; i < res.length; ++i) {
        if (res[i][0]) {
          alldata = alldata.concat(res[i][0]);
        }
      }



      var cl = new Classify(pgq);

      var complete = function complete (){
        var r = cl.analyzeList(alldata);
        console.log(r);
      };
      
      cl.loadFeatures(complete);


      console;
      });

  }
}
