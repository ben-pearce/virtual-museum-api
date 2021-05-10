const ObjectController = require('../../controllers/objectController');

/**
 * API object route endpoint definitions.
 */
module.exports = (fastify, opts, done) => {

  fastify.route({
    method: 'GET',
    url: '/object/:objectId',
    schema: {
      params: {
        objectId: { type: 'string' }
      },
    },
    handler: ObjectController.handleGetObject
  });

  done();
};