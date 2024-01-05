const { Property, Category } = require('../models');

const PropertyController = {
    async create(req, res) {
        try {
            const { categoryId, name, city, bathrooms, rooms, description, image } = req.body;

            // Verifica si la categoría existe
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Categoría no encontrada.' });
            }

            const newProperty = await Property.create({
                categoryId,
                name,
                city,
                bathrooms,
                rooms,
                description,
                image,
            });

            res.status(201).json(newProperty);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    async getAll(req, res) {
        try {
            const properties = await Property.findAll();

            res.json(properties);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;

            const property = await Property.findByPk(id);
            if (!property) {
                return res.status(404).json({ message: 'Propiedad no encontrada.' });
            }

            res.json(property);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { categoryId, name, city, bathrooms, rooms, description, image } = req.body;

            const property = await Property.findByPk(id);
            if (!property) {
                return res.status(404).json({ message: 'Propiedad no encontrada.' });
            }

            // Verifica si la nueva categoría existe
            const newCategory = await Category.findByPk(categoryId);
            if (!newCategory) {
                return res.status(404).json({ message: 'Nueva categoría no encontrada.' });
            }

            property.categoryId = categoryId;
            property.name = name;
            property.city = city;
            property.bathrooms = bathrooms;
            property.rooms = rooms;
            property.description = description;
            property.image = image;

            await property.save();

            res.json(property);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;

            const property = await Property.findByPk(id);
            if (!property) {
                return res.status(404).json({ message: 'Propiedad no encontrada.' });
            }

            await property.destroy();

            res.json({ message: 'Propiedad eliminada exitosamente.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },
};

module.exports = PropertyController;
