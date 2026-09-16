import { Router } from 'express';
import { refreshController } from '../controllers/refreshController';
import { refreshLimiter } from '../middleware/rateLimiters';

const refreshRouter = Router();
refreshRouter.post('/', refreshLimiter, refreshController);

export { refreshRouter };
