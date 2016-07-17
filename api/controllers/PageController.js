
module.exports = {

  render: function (page, rolesCheck) {
    return function (req, res) {
      if (!rolesCheck)
        return res.view(page);

      if (rolesCheck(req, res, function next(err) {
          if (err)
          res.forbidden(err); else
          res.view(page);
        })) {
      }
    }
  }

}

