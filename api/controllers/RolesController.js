var _ = require('underscore');

module.exports = {
  ROLE_USER: 2,
  ROLE_ADMIN: 4,
  ROLE_PROVIDER: 8,
  ROLE_NOBODY: 32768,

  containRole: function (fullrole, r) {
    return fullrole & r;
  },

  rolePolicy: function (rolesArr) {
    return function (req, res, next) {
      var err = 'no access';
      if (req.session.user) {
        var l = rolesArr.length;
        for (var i = 0; i < l; ++i) {
          if (req.session.user.roles & rolesArr[i]) {
            next();
            return;
          }
       }
        next(err);
      } else {
        next(err);
      }
    }
  }
}
