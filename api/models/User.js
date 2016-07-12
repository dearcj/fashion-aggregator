var User = {
  schema: true,
  connection: 'pg',
  table_name: 'user',
  attributes: {
    name  : { type: 'string', unique: true },
    email     : { type: 'email',  unique: true },
    passports : { collection: 'Passport', via: 'user' }
  }
};

module.exports = User;
