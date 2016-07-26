'use strict';
var _ = require('underscore');

var AppClass = require('../../Backend/App.js');

var Classify = require('../../Backend/Classify.js').Classify;

/*
function pgq (q, params, cb) {
  sails.models.User.query({text: q, values: params}, function(err, results) {
      cb(err, results.rows);
  });
}

var cl = new Classify(pgq);
*/

module.exports = {

  parse: function (req, res, next){
    if (!req.query.linkp) next('No link provided'); else {

      var gcapp = new AppClass.App();
      gcapp.parse(req.query.linkp, function cb(err, res) {
        if (err)
        next(err); else {

        }
          res.json(res);
      })
    }
  }

}
