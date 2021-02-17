var DataTypes = require('sequelize').DataTypes;
var _collectionsFacility = require('./collectionsFacility');
var _collectionsObject = require('./collectionsObject');
var _collectionsObjectCategory = require('./collectionsObjectCategory');
var _collectionsObjectImage = require('./collectionsObjectImage');
var _collectionsObjectMaker = require('./collectionsObjectMaker');
var _collectionsObjectPerson = require('./collectionsObjectPerson');
var _collectionsObjectPlace = require('./collectionsObjectPlace');
var _collectionsPerson = require('./collectionsPerson');
var _collectionsPlace = require('./collectionsPlace');
var _user = require('./user');

function initModels(sequelize) {
  var collectionsFacility = _collectionsFacility(sequelize, DataTypes);
  var collectionsObject = _collectionsObject(sequelize, DataTypes);
  var collectionsObjectCategory = _collectionsObjectCategory(sequelize, DataTypes);
  var collectionsObjectImage = _collectionsObjectImage(sequelize, DataTypes);
  var collectionsObjectMaker = _collectionsObjectMaker(sequelize, DataTypes);
  var collectionsObjectPerson = _collectionsObjectPerson(sequelize, DataTypes);
  var collectionsObjectPlace = _collectionsObjectPlace(sequelize, DataTypes);
  var collectionsPerson = _collectionsPerson(sequelize, DataTypes);
  var collectionsPlace = _collectionsPlace(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  collectionsObject.belongsToMany(collectionsPerson, { through: collectionsObjectPerson, foreignKey: 'object_id', otherKey: 'person_id' });
  collectionsObject.belongsToMany(collectionsPlace, { through: collectionsObjectPlace, foreignKey: 'object_id', otherKey: 'place_id' });
  collectionsPerson.belongsToMany(collectionsObject, { through: collectionsObjectPerson, foreignKey: 'person_id', otherKey: 'object_id' });
  collectionsPlace.belongsToMany(collectionsObject, { through: collectionsObjectPlace, foreignKey: 'place_id', otherKey: 'object_id' });
  collectionsObjectImage.belongsTo(collectionsObject, { as: 'object', foreignKey: 'object_id'});
  collectionsObject.hasMany(collectionsObjectImage, { as: 'collectionsObjectImages', foreignKey: 'object_id'});
  collectionsObjectMaker.belongsTo(collectionsObject, { as: 'object', foreignKey: 'object_id'});
  collectionsObject.hasMany(collectionsObjectMaker, { as: 'collectionsObjectMakers', foreignKey: 'object_id'});
  collectionsObjectPerson.belongsTo(collectionsObject, { as: 'object', foreignKey: 'object_id'});
  collectionsObject.hasMany(collectionsObjectPerson, { as: 'collectionsObjectPeople', foreignKey: 'object_id'});
  collectionsObjectPlace.belongsTo(collectionsObject, { as: 'object', foreignKey: 'object_id'});
  collectionsObject.hasMany(collectionsObjectPlace, { as: 'collectionsObjectPlaces', foreignKey: 'object_id'});
  collectionsObject.belongsTo(collectionsObjectCategory, { as: 'category', foreignKey: 'category_id'});
  collectionsObjectCategory.hasMany(collectionsObject, { as: 'collectionsObjects', foreignKey: 'category_id'});
  collectionsObjectPerson.belongsTo(collectionsPerson, { as: 'person', foreignKey: 'person_id'});
  collectionsPerson.hasMany(collectionsObjectPerson, { as: 'collectionsObjectPeople', foreignKey: 'person_id'});
  collectionsObjectPlace.belongsTo(collectionsPlace, { as: 'place', foreignKey: 'place_id'});
  collectionsPlace.hasMany(collectionsObjectPlace, { as: 'collectionsObjectPlaces', foreignKey: 'place_id'});

  return {
    collectionsFacility: collectionsFacility,
    collectionsObject: collectionsObject,
    collectionsObjectCategory: collectionsObjectCategory,
    collectionsObjectImage: collectionsObjectImage,
    collectionsObjectMaker: collectionsObjectMaker,
    collectionsObjectPerson: collectionsObjectPerson,
    collectionsObjectPlace: collectionsObjectPlace,
    collectionsPerson: collectionsPerson,
    collectionsPlace: collectionsPlace,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
