/**
 * Websites.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */



var Websites = {
  schema: true,
  table_name: 'websites',
  attributes: {
    domain: {type: 'string', required: true},
    user: {model: 'User', columnName: 'user_id'},
  },
};

module.exports = Websites;
