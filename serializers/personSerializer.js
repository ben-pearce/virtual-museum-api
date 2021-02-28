var JSONAPISerializer = require('jsonapi-serializer').Serializer;

var PersonSerializer = new JSONAPISerializer('person', {
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