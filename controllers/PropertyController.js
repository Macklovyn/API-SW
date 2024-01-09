// Importación de modelos necesarios
const { Property, Category } = require('../models');

// Controlador para la gestión de propiedades
const PropertyController = {
    /**
     * Método para crear una nueva propiedad.
     * @param {Object} req - Objeto de solicitud express.
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con la propiedad creada o un mensaje de error.
     */
    async create(req, res) {
        try {
            // Extraer datos de la solicitud
            const { categoryId, name, city, bathrooms, rooms, description, image } = req.body;

            // Verificar si la categoría existe
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Categoría no encontrada.' });
            }

            // Crear una nueva propiedad
            const newProperty = await Property.create({
                categoryId,
                name,
                city,
                bathrooms,
                rooms,
                description,
                image,
            });

            // Respuesta de éxito con la propiedad creada
            res.status(201).json(newProperty);
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    /**
     * Método para obtener todas las propiedades.
     * @param {Object} req - Objeto de solicitud express.
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con todas las propiedades o un mensaje de error.
     */
    async getAll(req, res) {
        try {
            // Obtener todas las propiedades
            const properties = await Property.findAll();

            // Respuesta con todas las propiedades
            res.json(properties);
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    /**
     * Método para obtener una propiedad por su ID.
     * @param {Object} req - Objeto de solicitud express con parámetro de ruta (id).
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con la propiedad solicitada o un mensaje de error.
     */
    async getById(req, res) {
        try {
            // Obtener el ID de la propiedad desde los parámetros de la ruta
            const { id } = req.params;

            // Buscar la propiedad por su ID
            const property = await Property.findByPk(id);
            if (!property) {
                return res.status(404).json({ message: 'Propiedad no encontrada.' });
            }

            // Respuesta con la propiedad encontrada
            res.json(property);
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    /**
     * Método para actualizar una propiedad por su ID.
     * @param {Object} req - Objeto de solicitud express con parámetro de ruta (id).
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con la propiedad actualizada o un mensaje de error.
     */
    async update(req, res) {
        try {
            // Obtener el ID de la propiedad desde los parámetros de la ruta
            const { id } = req.params;
            // Extraer datos de la solicitud
            const { categoryId, name, city, bathrooms, rooms, description, image } = req.body;

            // Buscar la propiedad por su ID
            const property = await Property.findByPk(id);
            if (!property) {
                return res.status(404).json({ message: 'Propiedad no encontrada.' });
            }

            // Verificar si la nueva categoría existe
            const newCategory = await Category.findByPk(categoryId);
            if (!newCategory) {
                return res.status(404).json({ message: 'Nueva categoría no encontrada.' });
            }

            // Actualizar los datos de la propiedad
            property.categoryId = categoryId;
            property.name = name;
            property.city = city;
            property.bathrooms = bathrooms;
            property.rooms = rooms;
            property.description = description;
            property.image = image;

            // Guardar los cambios en la base de datos
            await property.save();

            // Respuesta con la propiedad actualizada
            res.json(property);
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    /**
     * Método para eliminar una propiedad por su ID.
     * @param {Object} req - Objeto de solicitud express con parámetro de ruta (id).
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con mensaje de éxito o un mensaje de error.
     */
    async delete(req, res) {
        try {
            // Obtener el ID de la propiedad desde los parámetros de la ruta
            const { id } = req.params;

            // Buscar la propiedad por su ID
            const property = await Property.findByPk(id);
            if (!property) {
                return res.status(404).json({ message: 'Propiedad no encontrada.' });
            }

            // Eliminar la propiedad de la base de datos
            await property.destroy();

            // Respuesta de éxito
            res.json({ message: 'Propiedad eliminada exitosamente.' });
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },
};

// Exportar el controlador para su uso en otras partes de la aplicación
module.exports = PropertyController;
