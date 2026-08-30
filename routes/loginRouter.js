const { Router } = require('express');
const { authLimiter } = require('../middleware/rateLimiters');
const { loginController } = require('../controllers/loginController');

const loginRouter = Router();

loginRouter.post('/', authLimiter, loginController);

module.exports = {
  loginRouter
};
