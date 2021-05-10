const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return CollectionsFacility.init(sequelize, DataTypes);
};

/**
 * Sequelize model for `collections_facility` table.
 */
class CollectionsFacility extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init({
      id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Facility unique ID',
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Facility name'
      }
    }, {
      sequelize,
      tableName: 'collections_facility',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'collections_facility_pkey',
          unique: true,
          fields: [
            { name: 'id' },
          ]
        },
      ]
    });
    return CollectionsFacility;
  }
}
