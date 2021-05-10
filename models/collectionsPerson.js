const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return CollectionsPerson.init(sequelize, DataTypes);
};

/**
 * Sequelize model for `collections_person` table.
 */
class CollectionsPerson extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init({
      id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Museum unique identifier',
        primaryKey: true
      },
      birthDate: {
        field: 'birth_date',
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Person date of birth'
      },
      deathDate: {
        field: 'death_date',
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Person date of death'
      },
      occupation: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Person occupation'
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Name of person'
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Person note'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Person description'
      },
      nationality: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Nationality of person'
      },
      collectionsUrl: {
        field: 'collections_url',
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Original collections URL'
      }
    }, {
      sequelize,
      tableName: 'collections_person',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'collections_people_id_uindex',
          unique: true,
          fields: [
            { name: 'id' },
          ]
        },
        {
          name: 'collections_person_pkey',
          unique: true,
          fields: [
            { name: 'id' },
          ]
        },
      ]
    });
    return CollectionsPerson;
  }
}
