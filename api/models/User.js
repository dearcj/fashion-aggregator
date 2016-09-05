var User = {
  schema: true,
  table_name: 'user',
  attributes: {
    roles     : { type: 'integer' },
    name      : { type: 'string' },
    email     : { type: 'email' },
    password  : { type: 'string' },
    passports : { collection: 'Passport', via: 'user' },
    websites: {collection: 'Website', via: 'user'}
  }
};

module.exports = User;


