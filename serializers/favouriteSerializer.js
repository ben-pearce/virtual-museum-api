const JSONAPISerializer = require('jsonapi-serializer').Serializer;

/**
 * Favourite object JSON-API serializer instance.
 */
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

/**
 * Favourite person JSON-API serializer instance.
 */
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