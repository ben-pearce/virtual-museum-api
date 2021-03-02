const DataTypes = require('sequelize').DataTypes;
const _collectionsFacility = require('./collectionsFacility');
const _collectionsObject = require('./collectionsObject');
const _collectionsObjectCategory = require('./collectionsObjectCategory');
const _collectionsObjectImage = require('./collectionsObjectImage');
const _collectionsObjectMaker = require('./collectionsObjectMaker');
const _collectionsObjectPerson = require('./collectionsObjectPerson');
const _collectionsObjectPlace = require('./collectionsObjectPlace');
const _collectionsPerson = require('./collectionsPerson');
const _collectionsPlace = require('./collectionsPlace');
const _user = require('./user');
const _userCollectionsObjectFavourite = require('./userCollectionsObjectFavourite');
const _userCollectionsPersonFavourite = require('./userCollectionsPersonFavourite');

function initModels(sequelize) {
  const collectionsFacility = _collectionsFacility(sequelize, DataTypes);
  const collectionsObject = _collectionsObject(sequelize, DataTypes);
  const collectionsObjectCategory = _collectionsObjectCategory(sequelize, DataTypes);
  const collectionsObjectImage = _collectionsObjectImage(sequelize, DataTypes);
  const collectionsObjectMaker = _collectionsObjectMaker(sequelize, DataTypes);
  const collectionsObjectPerson = _collectionsObjectPerson(sequelize, DataTypes);
  const collectionsObjectPlace = _collectionsObjectPlace(sequelize, DataTypes);
  const collectionsPerson = _collectionsPerson(sequelize, DataTypes);
  const collectionsPlace = _collectionsPlace(sequelize, DataTypes);
  const user = _user(sequelize, DataTypes);
  const userCollectionsObjectFavourite = _userCollectionsObjectFavourite(sequelize, DataTypes);
  const userCollectionsPersonFavourite = _userCollectionsPersonFavourite(sequelize, DataTypes);

  collectionsObject.belongsToMany(collectionsPerson, { through: collectionsObjectPerson, foreignKey: 'object_id', otherKey: 'person_id' });
  collectionsObject.belongsToMany(collectionsPlace, { through: collectionsObjectPlace, foreignKey: 'object_id', otherKey: 'place_id' });
  collectionsPerson.belongsToMany(collectionsObject, { through: collectionsObjectPerson, foreignKey: 'person_id', otherKey: 'object_id' });
  collectionsPlace.belongsToMany(collectionsObject, { through: collectionsObjectPlace, foreignKey: 'place_id', otherKey: 'object_id' });
  collectionsObject.belongsToMany(user, { through: userCollectionsObjectFavourite, foriegnKey: 'object_id', otherKey: 'user_id' });
  collectionsPerson.belongsToMany(user, { through: userCollectionsPersonFavourite, foreignKey: 'person_id', otherKey: 'user_id' });
  collectionsObjectImage.belongsTo(collectionsObject, { as: 'object', foreignKey: 'object_id'});
  collectionsObject.hasMany(collectionsObjectImage, { as: 'collectionsObjectImages', foreignKey: 'object_id'});
  collectionsObjectMaker.belongsTo(collectionsObject, { as: 'object', foreignKey: 'object_id'});
  collectionsObjectMaker.belongsTo(collectionsPerson, { as: 'person', foreignKey: 'person_id'});
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
  collectionsObject.belongsTo(collectionsFacility, { as: 'facility', foreignKey: 'on_display_at' });
  collectionsFacility.hasMany(collectionsObject, { as: 'collectionsObjects', foreignKey: 'on_display_at' });

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
    userCollectionsObjectFavourite: userCollectionsObjectFavourite,
    userCollectionsPersonFavourite: userCollectionsPersonFavourite
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
