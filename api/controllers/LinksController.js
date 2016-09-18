module.exports = {

  all: function (req, res, next) {

    var skip = req.query.skip || 0;
    User.query({
      text: 'select l.id as linkid, w.id as website_id, w.domain, l.link, l.scan_date, l.big_scan_date from website w ' +
      'left join link l on l.website_id = w.id order by w.id DESC limit $1 offset $2 '
      , values: [skip, 20]
    }, function (err, results) {
      if (err) next(err); else
        res.json(results.rows);

      console.log(results.rows);
    });
  }

}

