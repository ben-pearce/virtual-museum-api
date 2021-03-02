const JSONAPISerializer = require('jsonapi-serializer').Serializer;

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