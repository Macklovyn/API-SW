const { validationResult } = require('express-validator');
const { Message, User, Property } = require('../models');

const handleErrors = (res, status, message) => {
    res.status(status).json({ message });
};

const MessageController = {
    async getAll(req, res) {
        try {
            const messages = await Message.findAll();
            res.json(messages);
        } catch (error) {
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

    async create(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return handleErrors(res, 400, 'Campos inválidos o faltantes.');
            }

            const { propertyId, title, content } = req.body;
            const senderUserId = req.user.id;

            const property = await Property.findByPk(propertyId);
            const senderUser = await User.findByPk(senderUserId);

            if (!property || !senderUser) {
                return handleErrors(res, 400, 'Propiedad o usuario no encontrado.');
            }

            const message = await Message.create({ propertyId, title, content, senderUserId });
            res.json(message);
        } catch (error) {
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

    async delete(req, res) {
        try {
            const { messageId } = req.params;

            const message = await Message.findByPk(messageId);
            if (!message) {
                return handleErrors(res, 404, 'Mensaje no encontrado.');
            }

            await message.destroy();
            res.json({ message: 'Mensaje eliminado exitosamente.' });
        } catch (error) {
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

    async markMessageAsRead(req, res) {
        try {
            const { messageId } = req.params;

            const message = await Message.findByPk(messageId);
            if (!message) {
                return handleErrors(res, 404, 'Mensaje no encontrado.');
            }

            message.status = 'LEIDO';
            await message.save();

            res.json({ message: 'Mensaje marcado como leído exitosamente.' });
        } catch (error) {
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

    async respondToMessage(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return handleErrors(res, 400, 'Campos inválidos o faltantes.');
            }

            const { messageId, response } = req.body;

            const message = await Message.findByPk(messageId);
            if (!message) {
                return handleErrors(res, 404, 'Mensaje no encontrado.');
            }

            message.response = response;
            message.status = 'RESPONDIDO';
            await message.save();

            res.json({ message: 'Respuesta enviada exitosamente.' });
        } catch (error) {
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

};

module.exports = MessageController;