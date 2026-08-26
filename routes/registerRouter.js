const { Router } = require('express');
const { postNewUser } = require('../controllers/registerController');

const registerRouter = Router();

registerRouter.post('/', postNewUser);

module.exports = {
  registerRouter,
};
