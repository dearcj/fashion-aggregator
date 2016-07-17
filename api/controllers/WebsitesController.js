/**
 * WebsitesController
 *
 * @description :: Server-side logic for managing websites
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create: function (req, res, next) {
    if (!req.session.user) return next('No permissions');
    var params = req.query;
    params.user = req.session.user.id;
    Websites.create(params, function cb(e, obj) {
      res.json(obj);
    });
  },


};

