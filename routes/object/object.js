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


module.exports = (fastify, opts, done) => {

  fastify.get('/object/:objectId', async function (req, rep) {
    var object = await this.models.collectionsObject.findOne({
      where: {
        id: req.params.objectId
      },
      include: [{
        model: this.models.collectionsObjectImage, 
        as: 'collectionsObjectImages',
        where: {
          is_thumb: false
        }
      }, {
        model: this.models.collectionsObjectCategory,
        as: 'category'
      }, {
        model: this.models.collectionsObjectMaker,
        as: 'collectionsObjectMakers',
        include: {
          model: this.models.collectionsPerson,
          as: 'person'
        }
      }, {
        model: this.models.collectionsObjectPerson,
        as: 'collectionsObjectPeople',
        include: {
          model: this.models.collectionsPerson,
          as: 'person'
        }
      }, {
        model: this.models.collectionsObjectPlace,
        as: 'collectionsObjectPlaces',
        include: {
          model: this.models.collectionsPlace,
          as: 'place'
        }
      }, {
        model: this.models.collectionsFacility,
        as: 'facility'
      }]
    });

    if(object === null) {
      rep
        .code(404)
        .send('Not found');
    } else {
      var serializedObject = ObjectSerializer.serialize(object);
      rep.send(serializedObject);
    }
  });

  done();
};