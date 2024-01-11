'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

// Obtener el nombre del archivo actual
const basename = path.basename(__filename);

// Obtener el entorno de ejecución o establecerlo como 'development' si no está definido
const env = process.env.NODE_ENV || 'development';

// Obtener la configuración de la base de datos correspondiente al entorno actual
const config = require(__dirname + '/../config/config.json')[env];

// Objeto para almacenar todos los modelos de la base de datos
const db = {};

let sequelize;

// Crear una instancia de Sequelize para la conexión a la base de datos
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Leer todos los archivos en el directorio actual
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    // Importar cada modelo y agregarlo al objeto 'db'
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Asociar modelos si hay asociaciones definidas en los modelos
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Agregar la instancia de Sequelize y el constructor Sequelize al objeto 'db'
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; // Exportar el objeto 'db' que contiene los modelos y la conexión a la base de datos

