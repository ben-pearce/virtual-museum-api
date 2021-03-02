const { Sequelize, Op } = require('sequelize');
const ObjectResultSerializer = require('../serializers/objectResultSerializer');

class SearchController {

  static async handleSearchQuery(req, rep) {
    const page = req.query['page[number]'] ? req.query['page[number]'] : 0;
    const limit = req.query['page[size]'] ? req.query['page[size]'] : 10;
    const query = req.query.q;
    let image = req.query.image;
    let category = req.query.category;
    let maker = req.query.maker;
    let place = req.query.place;
    let facility = req.query.facility;
    const creationEarliest = req.query['creation[earliest]'];
    const creationLatest = req.query['creation[latest]'];

    const sort = req.query.sort;

    const filters = [];
    const relationshipFilters = [];
    
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
      const imageClause = [];
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
      const categoryClause = [];
      for(const categoryId of category) {
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

      const makerClause = [];
      for(const makerId of maker) {
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

      const placeClause = [];
      for(const placeId of place) {
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

      const facilityClause = [];
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

    const orderBy = [];
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

    const queryOptions = {
      offset: page * limit,
      limit: limit,
      include: [{
        model: this.models.collectionsObjectImage, 
        as: 'collectionsObjectImages',
        where: {
          isThumb: true
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

    const objects = await this.models.collectionsObject.findAndCountAll(queryOptions);
    let serializedObjects = ObjectResultSerializer.serialize(objects.rows);

    serializedObjects = {
      ...serializedObjects,
      meta: {
        count: objects.count
      }
    };
    rep.send(serializedObjects);
  }
}

module.exports = SearchController;