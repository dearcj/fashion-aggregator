/**
 * Created by KURWINDALLAS on 19.07.2016.
 */
'use strict';
var _ = require('underscore');

var AppClass = require('./Backend/App.js');
var gcapp = new AppClass.App();



/*  gcapp.parse('https://www.slimstore.com.ua/clothes/all1/jackets', function cb(err, res) {
    next(err)
  }); */


gcapp.parse('http://www.asos.com/men/new-in-clothing/cat/pgecategory.aspx?cid=6993&via=top#parentID=-1&pge=0&pgeSize=36&sort=-1', function cb(res) {
  next(res)
});
