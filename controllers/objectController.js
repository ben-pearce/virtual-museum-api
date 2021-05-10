const { Op } = require('sequelize');

const ObjectSerializer = require('../serializers/objectSerializer');
const ObjectResultSerializer = require('../serializers/objectResultSerializer');

/**
 * Object controller responsible for providing access to museum object data.
 */
class ObjectController { 

  /**
   * Finds an object based on url parameters.
   *
   * Data from related entities are joined using sequelize.
   *
   * Related objects are selected using sequelize by submitting multiple queries
   * for other objects matching specific attributes of the original object and
   * selecting the first four closest matches.
   *
   * Reply is JSON-API serialized encoding of the object data.
   * 
   * If the ID does not exist then the reply is 404.
   *
   * @param {fastify.Request} req Fastify request instance.
   * @param {fastify.Reply} rep Fastify reply instance.
   */
  static async handleGetObject(req, rep) {
    // Find object in datastore and join all the related entities.
    const object = await this.models.collectionsObject.findOne({
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
      const relatedObjectsIncludes = [];

      // Include objects with the same makers.
      for(const maker of object.collectionsObjectMakers) {
        relatedObjectsIncludes.push({
          model: this.models.collectionsObjectMaker,
          as: 'collectionsObjectMakers',
          where: {
            personId: maker.personId
          }
        });
      }

      // Include objects with the same related people.
      for(const person of object.collectionsObjectPeople) {
        relatedObjectsIncludes.push({
          model: this.models.collectionsObjectPerson,
          as: 'collectionsObjectPeople',
          where: {
            personId: person.personId
          }
        });
      }

      // Include objects with the same place.
      for(const place of object.collectionsObjectPlaces) {
        relatedObjectsIncludes.push({
          model: this.models.collectionsObjectPlace,
          as: 'collectionsObjectPlaces',
          where: {
            placeId: place.placeId
          }
        });
      }

      const relatedObjectsQueries = [];
      // Submit all queries for each attribute match query.
      for(const include of relatedObjectsIncludes) {
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

      // Submit seperate query for only objects which match in category.
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

      // Collect all results asynchronously.
      const queryResults = await Promise.all(relatedObjectsQueries);

      // Return the four best matching results.
      const relatedObjects = queryResults.flat().filter((object, index, self) => 
        index === self.findIndex((o) => (
          o.id === object.id
        ))
      ).slice(0, 4);

      let serializedObject = ObjectSerializer.serialize(object);

      serializedObject = {
        ...serializedObject,
        meta: {
          relatedObjects: ObjectResultSerializer.serialize(relatedObjects)
        }
      };

      rep.send(serializedObject);
    }
  }
}

module.exports = ObjectController;