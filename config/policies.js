var rolePolicy = function (rolesArr) {
  return function (req, res, next) {
    if (Math.random() > 0.5) return next('zalupa'); else next();
  }
};

module.exports.policies = {

  '*': ['passport']
 /* MenuController: {
    findOne: rolePolicy(['admin', 'user']),
  },
  UserController: {
  }*/
};
