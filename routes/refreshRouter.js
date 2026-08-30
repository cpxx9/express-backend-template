const { Router } = require('express');
const { refreshController } = require('../controllers/refreshController');
const { refreshLimiter } = require('../middleware/rateLimiters');

const refreshRouter = Router();
refreshRouter.get('/', refreshLimiter, refreshController);

module.exports = { refreshRouter };
