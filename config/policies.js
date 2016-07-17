var r = require('../api/controllers/RolesController');

module.exports.policies = {


  '*': ['passport'],
  
  ParserController: {
    '*': r.rolePolicy([r.ROLE_ADMIN, r.ROLE_PROVIDER]),
  },
  UserController: {
    '*': r.rolePolicy([r.ROLE_ADMIN])
  },
  WebsitesController: {
    '*': r.rolePolicy([r.ROLE_ADMIN]),
  }

};
