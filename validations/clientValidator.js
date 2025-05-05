const { body, param } = require('express-validator');

// Valida los datos de un cliente
exports.createClientValidator = [
  body('name')
    .notEmpty().withMessage('El nombre del cliente es obligatorio.')
    .isLength({ min: 3 }).withMessage('El nombre del cliente debe tener al menos 3 caracteres.'),
  
  body('email')
    .notEmpty().withMessage('El email es obligatorio.')
    .isEmail().withMessage('El formato del email no es válido.')
];

// Valida el ID del cliente para obtenerlo o actualizarlo
exports.clientIdValidator = [
  param('id')
    .isMongoId().withMessage('ID de cliente no válido.')
];
