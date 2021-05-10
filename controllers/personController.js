const PersonSerializer = require('../serializers/personSerializer');
const ObjectResultSerializer = require('../serializers/objectResultSerializer');

/**
 * Person controller responsible for providing access to museum person data.
 */
class PersonController {

  /**
   * Finds an person based on url parameters.
   *
   * Data from related entities are joined using sequelize.
   *
   * Related objects are selected using sequelize by submitting multiple queries
   * for other objects matching specific attributes of the person and selecting
   * the first four closest matches.
   *
   * Reply is JSON-API serialized encoding of the person data.
   *
   * If the ID does not exist then the reply is 404.
   *
   * @param {fastify.Request} req Fastify request instance.
   * @param {fastify.Reply} rep Fastify reply instance.
   */
  static async handleGetPerson(req, rep) {
    const person = await this.models.collectionsPerson.findOne({
      where: {
        id: req.params.personId
      }
    });

    if(person === null) {
      rep
        .code(404)
        .send('Not found');
    } else {
      const relatedObjectsIncludes = [{
        model: this.models.collectionsObjectMaker,
        as: 'collectionsObjectMakers',
        where: {
          personId: person.id
        }
      }, {
        model: this.models.collectionsObjectPerson,
        as: 'collectionsObjectPeople',
        where: {
          personId: person.id
        }
      }];
  
      const relatedObjectsQueries = [];
  
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
          }, include]
        }));
      }
      
      const queryResults = await Promise.all(relatedObjectsQueries);
  
      const relatedObjects = queryResults.flat().filter((object, index, self) => 
        index === self.findIndex((o) => (
          o.id === object.id
        ))
      ).slice(0, 4);

      let serializedObject = PersonSerializer.serialize(person);

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

module.exports = PersonController;