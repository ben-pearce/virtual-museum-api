const JSONAPISerializer = require('jsonapi-serializer').Serializer;

/**
 * User JSON-API serializer instance.
 */
const UserSerializer = new JSONAPISerializer('user', {
  attributes: [
    'id',
    'firstName',
    'lastName',
    'email',
    'administrator'
  ],
  keyForAttribute: 'camelCase'
});

module.exports = UserSerializer;