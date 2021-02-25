const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return collectionsObjectMaker.init(sequelize, DataTypes);
};

class collectionsObjectMaker extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init({
      objectId: {
        field: 'object_id',
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Object ID of relationship',
        primaryKey: true,
        references: {
          model: 'collections_object',
          key: 'id'
        }
      },
      personId: {
        field: 'person_id',
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Person ID of relationship',
        primaryKey: true,
        references: {
          model: 'collections_person',
          key: 'id'
        }
      }
    }, {
      sequelize,
      tableName: 'collections_object_maker',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'collections_object_maker_pkey',
          unique: true,
          fields: [
            { name: 'object_id' },
            { name: 'person_id' },
          ]
        },
      ]
    });
    return collectionsObjectMaker;
  }
}
