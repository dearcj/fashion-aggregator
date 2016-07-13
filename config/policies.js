var r = require('../api/controllers/RolesController');

console;

module.exports.policies = {

  '*': ['passport'],

  UserController: {
    findOne: rolePolicy([])
  }
  /* MenuController: {
    findOne: rolePolicy(['admin', 'user']),
  },
  UserController: {
  }*/
};
