'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  // Define la clase `User` que extiende de la clase `Model` de Sequelize
  class User extends Model {
    /**
     * Método auxiliar para definir asociaciones.
     * Este método no es parte del ciclo de vida de Sequelize.
     * El archivo `models/index` llamará a este método automáticamente.
     */
    static associate(models) {
      // Define asociaciones aquí si es necesario en el futuro
    }
  }

  // Inicializa el modelo `User` con los campos y opciones definidos
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    resetToken: {
      type: DataTypes.STRING, // O el tipo de dato que se esté usando
      allowNull: true,
    },
  }, {
    sequelize, // Instancia de Sequelize para la conexión a la base de datos
    modelName: 'User', // Nombre del modelo en singular
  });

  // No se definieron asociaciones en este método, pero podrías hacerlo en el futuro si es necesario
  User.associate = (models) => {
    // Define asociaciones aquí si es necesario en el futuro
  };

  // Devuelve el modelo `User` configurado y listo para su uso
  return User;
};
