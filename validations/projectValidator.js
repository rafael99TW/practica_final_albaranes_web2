const { body, param } = require('express-validator');

// Valida los datos de un proyecto
exports.createProjectValidator = [
  body('name')
    .notEmpty().withMessage('El nombre del proyecto es obligatorio.')
    .isLength({ min: 3 }).withMessage('El nombre del proyecto debe tener al menos 3 caracteres.'),
  
  body('client')
    .notEmpty().withMessage('El cliente es obligatorio.')
    .isMongoId().withMessage('El ID del cliente no es válido.')
];

// Valida el ID del proyecto para obtenerlo o actualizarlo
exports.projectIdValidator = [
  param('id')
    .isMongoId().withMessage('ID de proyecto no válido.')
];
