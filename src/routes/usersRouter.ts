import passport from 'passport';
import passportConfig from '../config/passport';
passportConfig(passport);
import { Router } from 'express';
import { checkIfAdmin, checkIfUserMatch } from '../middleware/auth';
import {
  listUsers,
  listUser,
  updateUser,
  deleteUser
} from '../controllers/usersController';

const usersRouter = Router();

usersRouter.all('*', passport.authenticate('jwt', { session: false }));
usersRouter.get('/', checkIfAdmin, listUsers);
usersRouter.use('/:userId', checkIfUserMatch);
usersRouter.get('/:userId', listUser);
usersRouter.put('/:userId', updateUser);
usersRouter.delete('/:userId', deleteUser);

export { usersRouter };
