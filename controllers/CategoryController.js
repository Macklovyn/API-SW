/* El código define un objeto controlador llamado `CategoryController` que contiene varios métodos
para manejar operaciones CRUD relacionadas con un modelo de `Category`. */
const { Category } = require('../models');

const CategoryController = {
    /**
     * Método para crear una nueva categoría.
     * @param {Object} req - Objeto de solicitud express.
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con la nueva categoría creada.
     */
    async create(req, res) {
        try {
            const { name } = req.body;

            // Crear una nueva categoría en la base de datos
            const newCategory = await Category.create({ name });

            // Respuesta con la nueva categoría creada
            res.status(201).json(newCategory);
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    /**
     * Método para obtener todas las categorías.
     * @param {Object} req - Objeto de solicitud express.
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con todas las categorías.
     */
    async getAll(req, res) {
        try {
            // Obtener todas las categorías de la base de datos
            const categories = await Category.findAll();

            // Respuesta con todas las categorías
            res.json(categories);
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    /**
     * Método para actualizar una categoría existente por su ID.
     * @param {Object} req - Objeto de solicitud express con parámetro de ruta (id).
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con la categoría actualizada.
     */
    async update(req, res) {
        try {
            // Obtener el ID de la categoría desde los parámetros de la ruta
            const { id } = req.params;
            const { name } = req.body;

            // Buscar la categoría por su ID
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Categoría no encontrada.' });
            }

            // Actualizar el nombre de la categoría y guardar los cambios
            category.name = name;
            await category.save();

            // Respuesta con la categoría actualizada
            res.json(category);
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    /**
     * Método para mostrar detalles de una categoría por su ID.
     * @param {Object} req - Objeto de solicitud express con parámetro de ruta (id).
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con los detalles de la categoría.
     */
    async show(req, res) {
        try {
            // Obtener el ID de la categoría desde los parámetros de la ruta
            const { id } = req.params;

            // Buscar la categoría por su ID
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Categoría no encontrada.' });
            }

            // Respuesta con los detalles de la categoría
            res.json(category);
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    /**
     * Método para eliminar una categoría por su ID.
     * @param {Object} req - Objeto de solicitud express con parámetro de ruta (id).
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con el estado de la operación.
     */
    async delete(req, res) {
        try {
            // Obtener el ID de la categoría desde los parámetros de la ruta
            const { id } = req.params;

            // Buscar la categoría por su ID
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Categoría no encontrada.' });
            }

            // Eliminar la categoría de la base de datos
            await category.destroy();

            // Respuesta de éxito
            res.json({ message: 'Categoría eliminada exitosamente.' });
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },
};

// Exportar el controlador `CategoryController`
module.exports = CategoryController;

