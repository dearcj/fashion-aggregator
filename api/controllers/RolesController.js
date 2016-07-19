var _ = require('underscore');

module.exports = {
  ROLE_EVERYBODY: 1,
  ROLE_USER: 2,
  ROLE_ADMIN: 4,
  ROLE_PROVIDER: 8,
  ROLE_NOBODY: 32768,

  containRole: function (fullrole, r) {
    return fullrole & r;
  },

  rolePolicy: function (rolesArr) {
    var self = this;

    return function (req, res, next) {
      var err = 'no access';
        var l = rolesArr.length;
        for (var i = 0; i < l; ++i) {
          if ((rolesArr[i] == self.ROLE_EVERYBODY) || (req.session.user && req.session.user.roles & rolesArr[i] > 0)) {
            next();
            return;
          }
       }
        next(err);
    }
  }
}
