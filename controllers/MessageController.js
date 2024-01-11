const { validationResult } = require('express-validator');
const { Message, User, Property } = require('../models');

// Función auxiliar para manejar errores de respuesta
const handleErrors = (res, status, message) => {
    res.status(status).json({ message });
};

// Controlador para la gestión de mensajes
const MessageController = {
    /**
     * Método para obtener todos los mensajes con información detallada del usuario y propiedad asociados.
     * @param {Object} req - Objeto de solicitud express.
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con todos los mensajes y detalles asociados.
     */
    async getAll (req, res) {
        try {
            // Obtener todos los mensajes con información detallada del usuario y propiedad
            const messages = await Message.findAll({
                include: [
                    { model: User, attributes: ['id', 'name'], as: 'user' },
                    { model: Property, attributes: ['id', 'name'], as: 'property' }
                ]
            });

            // Respuesta con todos los mensajes y detalles asociados
            res.json(messages);
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

    /**
     * Método para crear un nuevo mensaje asociado a un usuario y una propiedad.
     * @param {Object} req - Objeto de solicitud express.
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con el estado de la operación.
     */
    async create (req, res) {
        try {
            // Validar campos de la solicitud
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return handleErrors(res, 400, 'Campos inválidos o faltantes.');
            }

            // Extraer datos de la solicitud
            const { propertyId, title, content } = req.body;

            // Obtener el usuario actual
            const user = await User.findOne({
                where: { email: req.user.email }
            });
            const userId = user.id;

            // Obtener la propiedad asociada al mensaje
            const senderUser = await Property.findByPk(propertyId);

            // Verificar existencia de usuario y propiedad
            if (!user || !senderUser) {
                return handleErrors(res, 400, 'Propiedad o usuario no encontrado.');
            }

            // Crear un nuevo mensaje asociado al usuario y la propiedad
            await Message.create({
                idUser: userId,
                idProperty: propertyId,
                message: content,
                status: 'CREADO'
            });

            // Respuesta de éxito
            return res.status(200).json({ status: 200, message: 'Enviado con éxito' });
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

    /**
     * Método para eliminar un mensaje por su ID.
     * @param {Object} req - Objeto de solicitud express con parámetro de ruta (messageId).
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con el estado de la operación.
     */
    async delete (req, res) {
        try {
            // Obtener el ID del mensaje desde los parámetros de la ruta
            const { messageId } = req.params;

            // Buscar el mensaje por su ID
            const message = await Message.findByPk(messageId);
            if (!message) {
                return handleErrors(res, 404, 'Mensaje no encontrado.');
            }

            // Eliminar el mensaje de la base de datos
            await message.destroy();

            // Respuesta de éxito
            res.json({ message: 'Mensaje eliminado exitosamente.' });
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

    /**
     * Método para marcar un mensaje como leído por su ID.
     * @param {Object} req - Objeto de solicitud express con parámetro de ruta (messageId).
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con el estado de la operación.
     */
    async markMessageAsRead (req, res) {
        try {
            // Obtener el ID del mensaje desde los parámetros de la ruta
            const { messageId } = req.params;

            // Buscar el mensaje por su ID
            const message = await Message.findByPk(messageId);
            if (!message) {
                return handleErrors(res, 404, 'Mensaje no encontrado.');
            }

            // Marcar el mensaje como leído y guardar los cambios
            message.status = 'LEIDO';
            await message.save();

            // Respuesta de éxito
            res.json({ message: 'Mensaje marcado como leído exitosamente.' });
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

    /**
     * Método para responder a un mensaje por su ID.
     * @param {Object} req - Objeto de solicitud express.
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con el estado de la operación.
     */
    async respondToMessage (req, res) {
        try {
            // Validar campos de la solicitud
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return handleErrors(res, 400, 'Campos inválidos o faltantes.');
            }

            // Extraer datos de la solicitud
            const { messageId, response } = req.body;

            // Buscar el mensaje por su ID
            const message = await Message.findByPk(messageId);
            if (!message) {
                return handleErrors(res, 404, 'Mensaje no encontrado.');
            }

            // Asignar respuesta al mensaje y marcar como respondido
            message.response = response;
            message.status = 'RESPONDIDO';
            await message.save();

            // Respuesta de éxito
            res.json({ message: 'Respuesta enviada exitosamente.' });
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },
};

module.exports = MessageController;

