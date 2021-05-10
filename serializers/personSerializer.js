const JSONAPISerializer = require('jsonapi-serializer').Serializer;

/**
 * Person JSON-API serializer instance.
 */
const PersonSerializer = new JSONAPISerializer('person', {
  attributes: [
    'name',
    'birthDate',
    'deathDate',
    'occupation',
    'note',
    'description',
    'nationality',
    'collectionsUrl'
  ]
});

module.exports = PersonSerializer;