const PersonSerializer = require('../serializers/personSerializer');
const ObjectResultSerializer = require('../serializers/objectResultSerializer');


class PersonController {

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