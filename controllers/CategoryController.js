const { Category } = require('../models');

const CategoryController = {
    async create(req, res) {
        try {
            const { name } = req.body;

            const newCategory = await Category.create({ name });

            res.status(201).json(newCategory);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    async getAll(req, res) {
        try {
            const categories = await Category.findAll();

            res.json(categories);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Categoría no encontrada.' });
            }

            category.name = name;
            await category.save();

            res.json(category);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    async show(req, res) {
        try {
            const { id } = req.params;

            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Categoría no encontrada.' });
            }

            res.json(category);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;

            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Categoría no encontrada.' });
            }

            await category.destroy();

            res.json({ message: 'Categoría eliminada exitosamente.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },
};

module.exports = CategoryController;
