var User = {
  schema: true,
  connection: 'pg',
  table_name: 'user',
  attributes: {
    roles     : { type: 'integer' },
    name      : { type: 'string' },
    email     : { type: 'email' },
    password  : { type: 'string' },
    passports : { collection: 'Passport', via: 'user' }
  }
};

module.exports = User;
