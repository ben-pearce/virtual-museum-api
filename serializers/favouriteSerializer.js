const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const FavouriteObjectSerializer = new JSONAPISerializer('favouriteObject', {
  attributes: [
    'userId',
    'objectId',
    'object'
  ],
  object: {
    ref: 'id',
    attributes: [
      'name'
    ]
  },
  keyForAttribute: 'camelCase'
});

const FavouritePersonSerializer = new JSONAPISerializer('favouritePerson', {
  attributes: [
    'userId',
    'personId',
    'person'
  ],
  person: {
    ref: 'id',
    attributes: [
      'name'
    ]
  },
  keyForAttribute: 'camelCase'
});

module.exports = { FavouriteObjectSerializer, FavouritePersonSerializer };