var PersonSerializer = require('../../serializers/personSerializer');
var ObjectResultSerializer = require('../../serializers/objectResultSerializer');

module.exports = (fastify, opts, done) => {

  fastify.get('/person/:personId', async function (req, rep) {
    var person = await this.models.collectionsPerson.findOne({
      where: {
        id: req.params.personId
      }
    });

    if(person === null) {
      rep
        .code(404)
        .send('Not found');
    } else {
      var relatedObjectsIncludes = [{
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
  
      var relatedObjectsQueries = [];
  
      for(var include of relatedObjectsIncludes) {
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
      
      var queryResults = await Promise.all(relatedObjectsQueries);
  
      var relatedObjects = queryResults.flat().filter((object, index, self) => 
        index === self.findIndex((o) => (
          o.id === object.id
        ))
      ).slice(0, 4);

      var serializedObject = PersonSerializer.serialize(person);

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