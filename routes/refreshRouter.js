const { Router } = require('express');
const { refreshController } = require('../controllers/refreshController');

const refreshRouter = Router();
refreshRouter.get('/', refreshController);

module.exports = { refreshRouter };
