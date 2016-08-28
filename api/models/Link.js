var Link = {
  schema: true,
  table_name: 'links',
  attributes: {
    link: {type: 'string', required: true},
    website: {model: 'Website', required: true, columnName: 'website_id'},

  }
};

module.exports = Link;
