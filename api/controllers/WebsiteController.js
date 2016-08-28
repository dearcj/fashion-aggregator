/**
 * WebsiteController
 *
 * @description :: Server-side logic for managing websites
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var url = require('url');

module.exports = {


  addLink: function (websiteId, link) {
    Link.create({
      website: websiteId,
      link: link
    }, function (e, obj) {

    });
  },

  createFromLink: function (link) {
    var baseLinkObj = url.parse(link);
    var baseLink = baseLinkObj.protocol + '//' + baseLinkObj.host;

    var params = {};

    params.user = null;
    params.domain = baseLink;

    Website.create(params, function cb(e, obj) {
      if (!e) {
        Link.create({
          website: obj.id,
          link: link
        }, function (e, obj) {
        });
      }
    });
  },

  create: function (req, res, next) {
    if (!req.session.user) return next('No permissions');
    var params = req.query;
    params.user = req.session.user.id;
    Website.create(params, function cb(e, obj) {
      res.json(obj);
    });
  },


};

