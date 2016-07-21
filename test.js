/**
 * Created by KURWINDALLAS on 19.07.2016.
 */
'use strict';
var _ = require('underscore');
var dict = require('./Backend/BTreeDictionary/BTDictionary.js');

var AppClass = require('./Backend/App.js');
var gcapp = new AppClass.App();

var d = new dict.BTDictionary();

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
/*  gcapp.parse('https://www.slimstore.com.ua/clothes/all1/jackets', function cb(err, res) {
    next(err)
  }); */


gcapp.parse('http://www.asos.com/men/new-in-clothing/cat/pgecategory.aspx?cid=6993&via=top#parentID=-1&pge=:page&pgeSize=36&sort=-1', function cb(res) {
  console.log(res);
///  next(res)
});
