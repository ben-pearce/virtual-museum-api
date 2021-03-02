const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return UserCollectionsPersonFavourite.init(sequelize, DataTypes);
};

class UserCollectionsPersonFavourite extends Sequelize.Model {
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
      personId: {
        field: 'person_id',
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Liked person ID',
        primaryKey: true,
        references: {
          model: 'collections_person',
          key: 'id'
        }
      }
    }, {
      sequelize,
      tableName: 'user_collections_person_favourite',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'user_collections_person_favourite_pkey',
          unique: true,
          fields: [
            { name: 'user_id' },
            { name: 'person_id' },
          ]
        },
      ]
    });
    return UserCollectionsPersonFavourite;
  }
}
