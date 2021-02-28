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
        required: false
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
      var relatedObjectsIncludes = [];

      for(var maker of object.collectionsObjectMakers) {
        relatedObjectsIncludes.push({
          model: this.models.collectionsObjectMaker,
          as: 'collectionsObjectMakers',
          where: {
            personId: maker.personId
          }
        });
      }

      for(var person of object.collectionsObjectPeople) {
        relatedObjectsIncludes.push({
          model: this.models.collectionsObjectPerson,
          as: 'collectionsObjectPeople',
          where: {
            personId: person.personId
          }
        });
      }

      for(var place of object.collectionsObjectPlaces) {
        relatedObjectsIncludes.push({
          model: this.models.collectionsObjectPlace,
          as: 'collectionsObjectPlaces',
          where: {
            placeId: place.placeId
          }
        });
      }

      var relatedObjectsQueries = [];
      for(let include of relatedObjectsIncludes) {
        relatedObjectsQueries.push(this.models.collectionsObject.findAll({
          limit: 4,
          include: [{
            model: this.models.collectionsObjectImage, 
            as: 'collectionsObjectImages',
            where: {
              isThumb: true
            },
            required: false
          }, {
            model: this.models.collectionsObjectCategory,
            as: 'category'
          }, include],
          where: {
            [Op.not]: {
              id: object.id
            }
          }
        }));
      }

      relatedObjectsQueries.push(this.models.collectionsObject.findAll({
        limit: 4,
        include: [{
          model: this.models.collectionsObjectImage, 
          as: 'collectionsObjectImages',
          where: {
            isThumb: true
          },
          required: false
        }, {
          model: this.models.collectionsObjectCategory,
          as: 'category'
        }],
        where: {
          categoryId: object.categoryId,
          [Op.not]: {
            id: object.id
          }
        }
      }));

      var queryResults = await Promise.all(relatedObjectsQueries);

      var relatedObjects = queryResults.flat().filter((object, index, self) => 
        index === self.findIndex((o) => (
          o.id === object.id
        ))
      ).slice(0, 4);

      var serializedObject = ObjectSerializer.serialize(object);

      serializedObject = {
        ...serializedObject,
        meta: {
          relatedObjects: ObjectResultSerializer.serialize(relatedObjects)
        }
      };

      rep.send(serializedObject);
    }
  });

  done();
};