const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return CollectionsPlace.init(sequelize, DataTypes);
};

class CollectionsPlace extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init({
      id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Unique place ID',
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Name of place'
      }
    }, {
      sequelize,
      tableName: 'collections_place',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'collections_place_pkey',
          unique: true,
          fields: [
            { name: 'id' },
          ]
        },
      ]
    });
    return CollectionsPlace;
  }
}
