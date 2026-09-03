const { validationResult } = require('express-validator');
const CustomBadRequestError = require('../errors/CustomBadRequestError');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomBadRequestError('Validation failed', errors.array());
  }
  next();
};

module.exports = { handleValidation };
