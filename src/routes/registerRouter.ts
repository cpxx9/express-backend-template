import { Router } from 'express';
import { postNewUser } from '../controllers/registerController';
import { authLimiter } from '../middleware/rateLimiters';

const registerRouter = Router();

registerRouter.post('/', authLimiter, postNewUser);

export { registerRouter };
