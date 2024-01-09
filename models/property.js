'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  // Define la clase `Property` que extiende de la clase `Model` de Sequelize
  class Property extends Model {
    /**
     * Método auxiliar para definir asociaciones.
     * Este método no es parte del ciclo de vida de Sequelize.
     * El archivo `models/index` llamará a este método automáticamente.
     */
    static associate(models) {
      // Define asociaciones aquí si es necesario en el futuro
    }
  }

  // Inicializa el modelo `Property` con los campos y opciones definidos
  Property.init({
    categoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    bathrooms: DataTypes.INTEGER,
    rooms: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    image: DataTypes.STRING
  }, {
    sequelize, // Instancia de Sequelize para la conexión a la base de datos
    modelName: 'Property', // Nombre del modelo en singular
  });

  // No se definieron asociaciones en este método, pero podrías hacerlo en el futuro si es necesario
  Property.associate = (models) => {
    // Define asociaciones aquí si es necesario en el futuro
  };

  // Devuelve el modelo `Property` configurado y listo para su uso
  return Property;
};
