var _ = require('underscore');

module.export = {
  ROLE_USER: 2,
  ROLE_ADMIN: 4,


  containRole: function (fullrole, r) {
    return fullrole & r;
  },

  rolePolicy: function (rolesArr) {
    return function (req, res, next) {
      var err = 'no access';
      if (req.session.user) {
        _.each(rolesArr, function (x) {
          if (req.session.user.roles & x) {
            next();
            return;
          }
        });
      } else next(err);

      next(err);
    }
  }
}
