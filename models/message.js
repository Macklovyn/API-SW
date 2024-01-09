'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  // Define la clase `Message` que extiende de la clase `Model` de Sequelize
  class Message extends Model {
    // Define el método estático `associate` para establecer asociaciones con otros modelos
    static associate(models) {
      // Establece una relación de pertenencia (belongsTo) con el modelo `User`
      Message.belongsTo(models.User, { foreignKey: 'idUser', as: 'user' });
      
      // Establece una relación de pertenencia (belongsTo) con el modelo `Property`
      Message.belongsTo(models.Property, { foreignKey: 'idProperty', as: 'property' });
    }
  }

  // Inicializa el modelo `Message` con los campos y opciones definidos
  Message.init({
    idUser: DataTypes.INTEGER,
    idProperty: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    status: DataTypes.STRING,
    response: DataTypes.TEXT
  }, {
    sequelize, // Instancia de Sequelize para la conexión a la base de datos
    modelName: 'Message', // Nombre del modelo en singular
  });

  // Asegúrate de llamar al método `associate` después de inicializar el modelo
  Message.associate = (models) => {
    // Establece las mismas relaciones de pertenencia definidas anteriormente
    Message.belongsTo(models.User, { foreignKey: 'idUser', as: 'user' });
    Message.belongsTo(models.Property, { foreignKey: 'idProperty', as: 'property' });
  };

  // Devuelve el modelo `Message` configurado y listo para su uso
  return Message;
};
