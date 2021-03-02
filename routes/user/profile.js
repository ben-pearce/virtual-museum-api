const UserController = require('../../controllers/userController');

module.exports = (fastify, opts, done) => {

  fastify.route({
    method: 'GET',
    url: '/profile',
    preHandler: fastify.auth([
      fastify.authJwtVerify
    ]),
    handler: UserController.handleGetUserProfile
  });

  done();
};