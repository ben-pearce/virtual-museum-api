const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return user.init(sequelize, DataTypes);
};

class user extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'User unique ID',
        primaryKey: true
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'User first name'
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'User last name'
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'User email address'
      },
      password: {
        type: 'BYTEA',
        allowNull: true,
        comment: 'User password hash'
      },
      administrator: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is user administrator?'
      }
    }, {
      sequelize,
      tableName: 'user',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'user_email_uindex',
          unique: true,
          fields: [
            { name: 'email' },
          ]
        },
        {
          name: 'user_pkey',
          unique: true,
          fields: [
            { name: 'id' },
          ]
        },
      ]
    });
    return user;
  }
}
