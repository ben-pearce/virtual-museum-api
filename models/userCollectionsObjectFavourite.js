const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return UserCollectionsObjectFavourite.init(sequelize, DataTypes);
};

/**
 * Sequelize model for `user_collections_object_favourite` table.
 */
class UserCollectionsObjectFavourite extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init({
      userId: {
        field: 'user_id',
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Liker user ID',
        primaryKey: true,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      objectId: {
        field: 'object_id',
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Liked object ID',
        primaryKey: true,
        references: {
          model: 'collections_object',
          key: 'id'
        }
      }
    }, {
      sequelize,
      tableName: 'user_collections_object_favourite',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'user_collections_object_favourite_pkey',
          unique: true,
          fields: [
            { name: 'user_id' },
            { name: 'object_id' },
          ]
        },
      ]
    });
    return UserCollectionsObjectFavourite;
  }
}
