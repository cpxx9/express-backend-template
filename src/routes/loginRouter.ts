import { Router } from 'express';
import { authLimiter } from '../middleware/rateLimiters';
import { loginController } from '../controllers/loginController';

export const loginRouter = Router();

loginRouter.post('/', authLimiter, loginController);
