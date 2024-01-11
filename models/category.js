'use strict';
const {
  Model
} = require('sequelize');

// Definición del modelo Category
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Método auxiliar para definir asociaciones.
     * Este método no es parte del ciclo de vida de Sequelize.
     * El archivo `models/index` llamará a este método automáticamente.
     */
    static associate(models) {
      // Definir asociaciones aquí si es necesario
    }
  }

  // Inicializar el modelo Category
  Category.init(
    {
      name: DataTypes.STRING, // Campo 'name' de tipo STRING
    },
    {
      sequelize,             // Instancia de Sequelize
      modelName: 'Category', // Nombre del modelo en Sequelize
    }
  );

  return Category; // Devolver el modelo Category
};

