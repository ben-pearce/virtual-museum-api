const SearchController = require('../../controllers/searchController');

/**
 * API search route endpoint definitions.
 */
module.exports = (fastify, opts, done) => {

  fastify.route({
    method: 'GET',
    url: '/search',
    schema: {
      queryparams: {
        'page[number]': { type: 'integer' },
        'page[size]': { type: 'integer' },
        query: { type: 'string' },
        image: { type: 'integer' },
        category: { type: 'integer' },
        maker: { type: 'string' },
        place: { type: 'string' },
        facility: { type: 'string' },
        creationEarliest: { type: 'integer' },
        creationLatest: { type: 'integer' },
        sort: { type: 'integer' }
      },
    },
    handler: SearchController.handleSearchQuery
  });

  done();
};