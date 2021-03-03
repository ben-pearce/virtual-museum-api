const UserFavouriteController = require('../../controllers/userFavouriteController');

module.exports = (fastify, opts, done) => {

  fastify.route({
    method: 'GET',
    url: '/favourite/object',
    preHandler: fastify.auth([
      fastify.authJwtVerify
    ]),
    schema: {
      params: {
        objectId: { type: 'string' }
      }
    },
    handler: UserFavouriteController.handleGetUserFavouriteObjects
  });

  fastify.route({
    method: 'GET',
    url: '/favourite/person',
    preHandler: fastify.auth([
      fastify.authJwtVerify
    ]),
    schema: {
      params: {
        personId: { type: 'string' }
      }
    },
    handler: UserFavouriteController.handleGetUserFavouritePeople
  });

  fastify.route({
    method: 'POST',
    url: '/favourite/object',
    preHandler: fastify.auth([
      fastify.authJwtVerify
    ]),
    schema: {
      body: {
        objectId: { type: 'string' }
      }
    },
    handler: UserFavouriteController.handleUserFavouriteObject
  });

  fastify.route({
    method: 'POST',
    url: '/favourite/person',
    preHandler: fastify.auth([
      fastify.authJwtVerify
    ]),
    schema: {
      body: {
        personId: { type: 'string' }
      }
    },
    handler: UserFavouriteController.handleUserFavouritePerson
  });

  fastify.route({
    method: 'DELETE',
    url: '/favourite/object/:objectId',
    preHandler: fastify.auth([
      fastify.authJwtVerify
    ]),
    schema: {
      params: {
        objectId: { type: 'string' }
      }
    },
    handler: UserFavouriteController.handleUserUnfavouriteObject
  });

  fastify.route({
    method: 'DELETE',
    url: '/favourite/person/:personId',
    preHandler: fastify.auth([
      fastify.authJwtVerify
    ]),
    schema: {
      params: {
        personId: { type: 'string' }
      }
    },
    handler: UserFavouriteController.handleUserUnfavouritePerson
  });

  done();
};