const ImageController = require('../../controllers/imageController');

module.exports = (fastify, opts, done) => {

  fastify.route({
    method: 'GET',
    url: '/image/:objectId/thumb',
    schema: {
      params: {
        objectId: { type: 'string' }
      },
    },
    handler: ImageController.handleGetObjectImageThumbnail
  });

  fastify.route({
    method: 'GET',
    url: '/image/:objectId/:imageId',
    schema: {
      params: {
        objectId: { type: 'string' },
        imageId: { type: 'integer' }
      },
    },
    handler: ImageController.handleGetObjectImage
  });

  done();
};