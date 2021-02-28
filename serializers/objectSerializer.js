var JSONAPISerializer = require('jsonapi-serializer').Serializer;

var ObjectSerializer = new JSONAPISerializer('object', {
  attributes: [
    'name', 
    'description',
    'accession',
    'creationEarliest',
    'creationLatest',
    'collectionsObjectImages',
    'collectionsObjectMakers',
    'collectionsObjectPeople',
    'collectionsObjectPlaces',
    'facility',
    'category',
    'collectionsUrl'
  ],
  collectionsObjectImages: {
    ref: (object, image) => 
      `${object.id}/${object.collectionsObjectImages.indexOf(image)}`,
    attributes: [
      'imagePublicPath'
    ]
  },
  collectionsObjectMakers: {
    ref: 'personId',
    attributes: ['person']
  },
  collectionsObjectPeople: {
    ref: 'personId',
    attributes: ['person']
  },
  collectionsObjectPlaces: {
    ref: 'placeId',
    attributes: ['place']
  },
  keyForAttribute: 'camelCase'
});

module.exports = ObjectSerializer;