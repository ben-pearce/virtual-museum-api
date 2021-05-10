const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return CollectionsObjectImage.init(sequelize, DataTypes);
};

/**
 * Sequelize model for `collections_object_image` table.
 */
class CollectionsObjectImage extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init({
      objectId: {
        field: 'object_id',
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Related object ID',
        primaryKey: true,
        references: {
          model: 'collections_object',
          key: 'id'
        }
      },
      imagePublicPath: {
        field: 'image_public_path',
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Path to public image',
        primaryKey: true
      },
      isThumb: {
        field: 'is_thumb',
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is image a thumbnail?'
      }
    }, {
      sequelize,
      tableName: 'collections_object_image',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'collections_object_image_pkey',
          unique: true,
          fields: [
            { name: 'image_public_path' },
            { name: 'object_id' },
          ]
        },
      ]
    });
    return CollectionsObjectImage;
  }
}
