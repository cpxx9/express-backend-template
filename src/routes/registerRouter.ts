import { Router } from 'express';
import { postNewUser } from '../controllers/registerController';
import { authLimiter } from '../middleware/rateLimiters';

export const registerRouter = Router();

registerRouter.post('/', authLimiter, postNewUser);
