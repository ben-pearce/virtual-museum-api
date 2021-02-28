var PersonSerializer = require('../../serializers/personSerializer');
var ObjectResultSerializer = require('../../serializers/objectResultSerializer');

module.exports = (fastify, opts, done) => {

  fastify.get('/person/:personId', async function (req, rep) {
    var object = await this.models.collectionsPerson.findOne({
      where: {
        id: req.params.personId
      }
    });

    if(object === null) {
      rep
        .code(404)
        .send('Not found');
    } else {
      var serializedObject = PersonSerializer.serialize(object);
      rep.send(serializedObject);
    }
  });

  done();
};