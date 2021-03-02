const UserController = require('../../controllers/userController');

module.exports = (fastify, opts, done) => {

  fastify.route({
    method: 'POST',
    url: '/login',
    schema: {
      body: {
        email: { type: 'string' },
        password: { type: 'string' }
      },
    },
    handler: UserController.handleUserAuthentication
  });

  fastify.route({
    method: 'POST',
    url: '/signup',
    schema: {
      body: {
        first: { type: 'string' },
        last: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
      }
    },
    handler: UserController.handleUserSignUp
  });

  fastify.route({
    method: 'GET',
    url: '/logout',
    preHandler: fastify.auth([
      fastify.authJwtVerify
    ]),
    handler: UserController.handleUserLogout
  });

  done();
};