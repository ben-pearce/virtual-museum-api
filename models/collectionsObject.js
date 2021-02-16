const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return CollectionsObject.init(sequelize, DataTypes);
};

class CollectionsObject extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init({
      id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Unique museum identifier',
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Museum object title'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Museum object description'
      },
      categoryId: {
        field: 'category_id',
        type: DataTypes.SMALLINT,
        allowNull: false,
        comment: 'Type of object',
        references: {
          model: 'collections_object_category',
          key: 'id'
        }
      },
      creationEarliest: {
        field: 'creation_earliest',
        type: DataTypes.SMALLINT,
        allowNull: true,
        comment: 'Earliest creation date'
      },
      creationLatest: {
        field: 'creation_latest',
        type: DataTypes.SMALLINT,
        allowNull: true,
        comment: 'Latest creation date'
      },
      onDisplayAt: {
        field: 'on_display_at',
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Location of display unit'
      },
      collectionsUrl: {
        field: 'collections_url',
        type: DataTypes.TEXT,
        allowNull: true
      },
      accession: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Museum accession no.'
      }
    }, {
      sequelize,
      tableName: 'collections_object',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'collections_object_accession_uindex',
          unique: true,
          fields: [
            { name: 'accession' },
          ]
        },
        {
          name: 'collections_object_pkey',
          unique: true,
          fields: [
            { name: 'id' },
          ]
        },
        {
          name: 'collections_objects_id_uindex',
          unique: true,
          fields: [
            { name: 'id' },
          ]
        },
      ]
    });
    return CollectionsObject;
  }
}
