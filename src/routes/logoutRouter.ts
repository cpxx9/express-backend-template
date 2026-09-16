import { Router } from 'express';
import { logoutController } from '../controllers/logoutController';

const logoutRouter = Router();
logoutRouter.post('/', logoutController);

export { logoutRouter };
