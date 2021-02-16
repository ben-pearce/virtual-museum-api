const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return CollectionsObjectPerson.init(sequelize, DataTypes);
};

class CollectionsObjectPerson extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init({
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
      },
      personId: {
        field: 'person_id',
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Unique person ID ',
        primaryKey: true,
        references: {
          model: 'collections_person',
          key: 'id'
        }
      }
    }, {
      sequelize,
      tableName: 'collections_object_person',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'collections_object_person_pkey',
          unique: true,
          fields: [
            { name: 'object_id' },
            { name: 'person_id' },
          ]
        },
      ]
    });
    return CollectionsObjectPerson;
  }
}
