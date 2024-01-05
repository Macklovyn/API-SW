'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    resetToken: {
      type: DataTypes.STRING, // O el tipo de dato que estés usando
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};