'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, { foreignKey: 'idUser', as: 'user' });
      Message.belongsTo(models.Property, { foreignKey: 'idProperty', as: 'property' });
    }
  }
  Message.init({
    idUser: DataTypes.INTEGER,
    idProperty: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    status: DataTypes.STRING,
    response: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Message',
  });

  // Asegúrate de llamar al método `associate` después de inicializar el modelo
  Message.associate = (models) => {
    Message.belongsTo(models.User, { foreignKey: 'idUser', as: 'user' });
    Message.belongsTo(models.Property, { foreignKey: 'idProperty', as: 'property' });
  };

  return Message;
};
