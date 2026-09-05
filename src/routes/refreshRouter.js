const { Router } = require('express');
const { refreshController } = require('../controllers/refreshController');
const { refreshLimiter } = require('../middleware/rateLimiters');

const refreshRouter = Router();
refreshRouter.post('/', refreshLimiter, refreshController);

module.exports = { refreshRouter };
