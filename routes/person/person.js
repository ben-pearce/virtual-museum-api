const PersonController = require('../../controllers/personController');

module.exports = (fastify, opts, done) => {

  fastify.route({
    method: 'GET',
    url: '/person/:personId',
    schema: {
      params: {
        personId: { type: 'string' }
      },
    },
    handler: PersonController.handleGetPerson
  });

  done();
};