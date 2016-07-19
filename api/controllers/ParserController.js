'use strict';
var _ = require('underscore');

var AppClass = require('../../Backend/App.js');

function pgq (q, params, cb) {
  User.query({text: q, values: params}, function(err, results) {
    cb(err, result.rows);

    if (err) return res.serverError(err);
    return res.ok(results.rows);
  });
}


module.exports = {

  parse: function (req, res, next){
    if (!req.query.linkp) next('No link provided'); else {

      var gcapp = new AppClass.App();
      gcapp.parse(req.query.linkp, function cb(err, res) {
        next(err)
      })
    }
  }

}
