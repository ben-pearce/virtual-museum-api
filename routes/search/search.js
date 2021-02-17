var JSONAPISerializer = require('jsonapi-serializer').Serializer;

var ObjectSerializer = new JSONAPISerializer('object', {
  attributes: [
    'name', 
    'creationEarliest',
    'creationLatest',
    'collectionsObjectImages',
    'onDisplayAt'
  ],
  collectionsObjectImages: {
    ref: (object, image) => 
      `${object.id}/${object.collectionsObjectImages.indexOf(image)}`,
    attributes: [
      'imagePublicPath',
      'isThumb'
    ]
  },
  keyForAttribute: 'camelCase'
});

module.exports = (fastify, opts, done) => {

  fastify.get('/search', async function (req, rep) {
    var page = req.query.page ? req.query.page : 0;
    var limit = req.query.limit ? req.query.limit : 10;
    
    var objects = await this.models.collectionsObject.findAll({
      offset: page * limit,
      limit: limit,
      include: {
        model: this.models.collectionsObjectImage, 
        as: 'collectionsObjectImages',
        where: {
          is_thumb: true
        }
      }
    });

    var serializedObjects = ObjectSerializer.serialize(objects);
    rep.send(serializedObjects);
  });

  done();
};