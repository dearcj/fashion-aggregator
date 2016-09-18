var r = require('../api/controllers/RolesController');

module.exports.policies = {


  '*': ['passport'],

  LinksContoller: {
    '*': r.rolePolicy([r.ROLE_EVERYBODY, r.ROLE_ADMIN, r.ROLE_PROVIDER]),
  },

  ParserController: {
    '*': r.rolePolicy([r.ROLE_EVERYBODY, r.ROLE_ADMIN, r.ROLE_PROVIDER]),
  },
  UserController: {
    '*': r.rolePolicy([r.ROLE_ADMIN])
  },
  WebsiteController: {
    '*': r.rolePolicy([r.ROLE_ADMIN]),
  }

};
