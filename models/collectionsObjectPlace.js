const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return CollectionsObjectPlace.init(sequelize, DataTypes);
};

/**
 * Sequelize model for `collections_object_place` table.
 */
class CollectionsObjectPlace extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init({
      placeId: {
        field: 'place_id',
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Unique place ID',
        primaryKey: true,
        references: {
          model: 'collections_place',
          key: 'id'
        }
      },
      objectId: {
        field: 'object_id',
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Unique object ID',
        primaryKey: true,
        references: {
          model: 'collections_object',
          key: 'id'
        }
      }
    }, {
      sequelize,
      tableName: 'collections_object_place',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'collections_object_place_pkey',
          unique: true,
          fields: [
            { name: 'place_id' },
            { name: 'object_id' },
          ]
        },
      ]
    });
    return CollectionsObjectPlace;
  }
}
