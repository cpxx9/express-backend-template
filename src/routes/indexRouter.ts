import { Router } from 'express';
import { loginRouter } from './loginRouter';
import { registerRouter } from './registerRouter';
import { refreshRouter } from './refreshRouter';
import { logoutRouter } from './logoutRouter';
import { usersRouter } from './usersRouter';

export const indexRouter = Router();

indexRouter.use('/register', registerRouter);
indexRouter.use('/login', loginRouter);
indexRouter.use('/users', usersRouter);
indexRouter.use('/refresh', refreshRouter);
indexRouter.use('/logout', logoutRouter);
