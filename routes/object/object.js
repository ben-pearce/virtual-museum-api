var { Op } = require('sequelize');
var ObjectSerializer = require('../../serializers/objectSerializer');
var ObjectResultSerializer = require('../../serializers/objectResultSerializer');


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
          isThumb: false
        },
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