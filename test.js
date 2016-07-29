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

var categories = [
  'swim shorts',
  'shorts',
  'overshirt',
  'over-shirt',
  'shirt',
  'pants',
  'accessory',
  'costume'
  'knitwear',
  'tie',
  'sportswear',
  'top',
  'underwear',
  'V-neck',
  'uniform',
  'socks',
  'Baby Grow',
  'Bag',
  'Belt',
  'Bikini',
  'Blazer',
  'Blouse',
  'Boots',
  'Bow Tie',
  'Boxers',
  'Bra',
  'Briefs',
  'Camisole',
];

var cat2 = ["Cardigan","Cargos","Chemise","Coat","Cufflinks","Cummerbund","Dress","Corset","Dungarees","Fleece","Gloves","Hat","Hoody","Jacket","Jeans","Jewellery","Jogging pants","Jogging suit","Joggers","Jumper","Kaftan","Kilt","Knickers","Lingerie","Nightwear","Overall","Pashmina","Polo Shirt","Polo","Poncho","Pyjamas","Robe","Romper","Sandals","Scarf","Shawl","Shirt","Shellsuit","Shoes","Skirt","Slippers","Stockings","Suit","Sunglasses","Sweatwear","Sweatshirt","Swimming Costume","Swimming Trunks","Swimwear","T-Shirt","Tailcoat","Tights","top","Tracksuit","Trainers","Trousers","Vest","Vest Underwear","Waistcoat","Waterproof"];
var shoes = [
  "Ballet flat",
  "Sneakers",
  "Ballet shoe",
  "Brogues",
  "Derby",
  "Loafers",
  "Oxfords",
  "Slippers",
  "Oxford shoes",
  "Boots",
  "moccasins",
  "Fashion boots"
];


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

    });

  }
}
