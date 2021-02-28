var { Sequelize, Op } = require('sequelize');
var ObjectResultSerializer = require('../../serializers/objectResultSerializer');

module.exports = (fastify, opts, done) => {

  fastify.get('/search', async function (req, rep) {
    var page = req.query['page[number]'] ? req.query['page[number]'] : 0;
    var limit = req.query['page[size]'] ? req.query['page[size]'] : 10;
    var query = req.query.q;
    var image = req.query.image;
    var category = req.query.category;
    var maker = req.query.maker;
    var place = req.query.place;
    var facility = req.query.facility;
    var creationEarliest = req.query['creation[earliest]'];
    var creationLatest = req.query['creation[latest]'];

    var sort = req.query.sort;

    var filters = [];
    var relationshipFilters = [];
    
    if(query) {
      filters.push({
        [Op.or]: [
          { name: {[Op.iLike]: `%${query}%`} }, 
          { description: {[Op.iLike]: `%${query}%`}}
        ]
      });
    }

    if(image) {
      image = Array.from(image);
      var imageClause = [];
      if(image.includes('0')) {
        imageClause.push(Sequelize.where(Sequelize.col('collectionsObjectImages.object_id'), null));
      }
      if(image.includes('1')) {
        imageClause.push(Sequelize.where(Sequelize.col('collectionsObjectImages.object_id'), Op.not, null));
      }
      filters.push({ [Op.or]: imageClause });
    }

    if(category) {
      if(!Array.isArray(category)) {
        category = [category];
      }
      var categoryClause = [];
      for(let categoryId of category) {
        categoryClause.push({
          categoryId: categoryId
        });
      }
      filters.push({ [Op.or]: categoryClause });
    }

    if(maker) {
      if(!Array.isArray(maker)) {
        maker = [maker];
      }

      var makerClause = [];
      for(let makerId of maker) {
        makerClause.push({
          personId: makerId
        });
      }

      relationshipFilters.push({
        model: this.models.collectionsObjectMaker, 
        as: 'collectionsObjectMakers',
        where: {
          [Op.or]: makerClause
        }
      });
    }

    if(place) {
      if(!Array.isArray(place)) {
        place = [place];
      }

      var placeClause = [];
      for(let placeId of place) {
        placeClause.push({
          placeId: placeId
        });
      }

      relationshipFilters.push({
        model: this.models.collectionsObjectPlace,
        as: 'collectionsObjectPlaces',
        where: {
          [Op.or]: placeClause
        }
      });
    }

    if(facility) {
      if(!Array.isArray(facility)) {
        facility = [facility];
      }

      var facilityClause = [];
      for(let facilityId of facility) {
        if(facilityId === '0') {
          facilityId = null;
        }
        facilityClause.push({
          onDisplayAt: facilityId
        });
      }
      filters.push({ [Op.or]: facilityClause });
    }

    if(creationEarliest) {
      filters.push({
        creationEarliest: {
          [Op.gte]: creationEarliest
        }
      });
    }

    if(creationLatest) {
      filters.push({
        creationLatest: {
          [Op.lte]: creationLatest
        }
      });
    }

    var orderBy = [];
    if(sort === '1') {
      orderBy.push([
        'name', 'ASC'
      ]);
    } else if(sort === '2') {
      orderBy.push([
        'name', 'DESC'
      ]);
    } else if(sort === '3') {
      orderBy.push([
        'creationEarliest', 'ASC'
      ]);
      orderBy.push([
        'creationLatest', 'ASC'
      ]);
    } else if(sort === '4') {
      orderBy.push([
        'creationEarliest', 'DESC'
      ]);
      orderBy.push([
        'creationLatest', 'DESC'
      ]);
    }

    var queryOptions = {
      offset: page * limit,
      limit: limit,
      include: [{
        model: this.models.collectionsObjectImage, 
        as: 'collectionsObjectImages',
        where: {
          is_thumb: true
        },
        required: false
      }, {
        model: this.models.collectionsObjectCategory,
        as: 'category'
      }, ...relationshipFilters],
      where: {
        [Op.and]: filters
      },
      order: orderBy,
      subQuery: false
    };

    var objects = await this.models.collectionsObject.findAndCountAll(queryOptions);
    var serializedObjects = ObjectResultSerializer.serialize(objects.rows);

    serializedObjects = {
      ...serializedObjects,
      meta: {
        count: objects.count
      }
    };
    rep.send(serializedObjects);
  });

  done();
};