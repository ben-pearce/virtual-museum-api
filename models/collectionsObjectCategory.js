const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return CollectionsObjectCategory.init(sequelize, DataTypes);
};

/**
 * Sequelize model for `collections_object_category` table.
 */
class CollectionsObjectCategory extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init({
      id: {
        autoIncrement: true,
        type: DataTypes.SMALLINT,
        allowNull: false,
        comment: 'Unique category ID',
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Category name'
      }
    }, {
      sequelize,
      tableName: 'collections_object_category',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'collections_object_category_pkey',
          unique: true,
          fields: [
            { name: 'id' },
          ]
        },
      ]
    });
    return CollectionsObjectCategory;
  }
}
