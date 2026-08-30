const { Router } = require('express');
const { postNewUser } = require('../controllers/registerController');
const { authLimiter } = require('../middleware/rateLimiters');

const registerRouter = Router();

registerRouter.post('/', authLimiter, postNewUser);

module.exports = {
  registerRouter
};
