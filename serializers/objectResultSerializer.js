const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const ObjectResultSerializer = new JSONAPISerializer('object', {
  attributes: [
    'name', 
    'creationEarliest',
    'creationLatest',
    'collectionsObjectImages',
    'onDisplayAt',
    'category'
  ],
  collectionsObjectImages: {
    ref: (object, image) => `${object.id}/${object.collectionsObjectImages.indexOf(image)}`,
    attributes: [
      'imagePublicPath',
      'isThumb'
    ]
  },
  keyForAttribute: 'camelCase'
});

module.exports = ObjectResultSerializer;