import { Router } from 'express';
import { authLimiter } from '../middleware/rateLimiters';
import { loginController } from '../controllers/loginController';

const loginRouter = Router();

loginRouter.post('/', authLimiter, loginController);

export { loginRouter };
