const ObjectController = require('../../controllers/objectController');

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