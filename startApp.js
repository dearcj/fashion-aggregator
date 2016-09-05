/**
 * Created by KURWINDALLAS on 19.07.2016.
 */
'use strict';
var _ = require('underscore');
var dict = require('./Backend/BTreeDictionary/BTDictionary.js');
var FCategory = require('./Backend/Features/FCategory.js').FCategory;
var FPrice = require('./Backend/Features/FPrice.js').FPrice;
var FBrand = require('./Backend/Features/FBrand.js').FBrand;
var datainit = require('./datainit.js');
var ScanWorker = require('./Backend/ScanWorker.js').ScanWorker;

var AppClass = require('./Backend/App.js');
var gcapp = new AppClass.App();
var Classify = require('./Backend/Classify.js').Classify;
var d = new dict.BTDictionary();
var WebsitesController = require('./api/controllers/WebsiteController.js');

function pgq (q, params, cb) {
  User.query({text: q, values: params}, function(err, results) {

    var rows = null;
    if (results) rows = results.rows;
    cb(err, rows);
  });
}



module.exports = {
  runTest: function () {
    var sw = new ScanWorker(pgq, gcapp);
    // WebsitesController.createFromLink('https://www.lyst.com/shop/mens-knitwear/');

//      gcapp.parse('http://www.endclothing.com/us/clothing/blazers', function cb(res) {
//    gcapp.parse('https://marketplace.asos.com/men/shirts', function cb(res) {


    var link = 'https://www.lyst.com/shop/mens-knitwear/';
    /*  gcapp.parse(link, function cb(res) {

      var alldata = [];
      for (var i = 0; i < res.length; ++i) {
        if (res[i][0]) {
          alldata = alldata.concat(res[i][0]);
        }
      }

      var cl = new Classify(pgq, gcapp.images, link);

      cl.loadFeatures(function complete (){
        //cl.learnFeature('title', 'abracadabra');
        //   cl.revertHistory(historyId)
//        var x = cl.ft('category').dict.checkWord('blazer');
        var r = cl.analyzeList(alldata);
      });
     }); */
  }
}
