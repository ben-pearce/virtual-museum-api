var { Op } = require('sequelize');
var JSONAPISerializer = require('jsonapi-serializer').Serializer;

module.exports = (fastify, opts, done) => {

  fastify.get('/search', async function (req, rep) {
    var page = req.query.page ? req.query.page : 0;
    var limit = req.query.limit ? req.query.limit : 10;
    var query = req.query.q;

    var queryOptions = {
      offset: page * limit,
      limit: limit,
      include: [{
        model: this.models.collectionsObjectImage, 
        as: 'collectionsObjectImages',
        where: {
          is_thumb: true
        }
      }, {
        model: this.models.collectionsObjectCategory,
        as: 'category'
      }],
      where: {}
    };
    
    if(query) {
      Object.assign(queryOptions.where, {
        [Op.or]: [
          { name: {[Op.iLike]: `%${query}%`} }, 
          { description: {[Op.iLike]: `%${query}%`}}
        ]
      });
    }

    var objects = await this.models.collectionsObject.findAndCountAll(queryOptions);

    var ObjectSerializer = new JSONAPISerializer('object', {
      attributes: [
        'name', 
        'creationEarliest',
        'creationLatest',
        'collectionsObjectImages',
        'onDisplayAt',
        'category'
      ],
      collectionsObjectImages: {
        ref: (object, image) => 
          `${object.id}/${object.collectionsObjectImages.indexOf(image)}`,
        attributes: [
          'imagePublicPath',
          'isThumb'
        ]
      },
      keyForAttribute: 'camelCase',
      meta: {
        count: objects.count
      }
    });

    var serializedObjects = ObjectSerializer.serialize(objects.rows);
    rep.send(serializedObjects);
  });

  done();
};