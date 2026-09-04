const passport = require('passport');
require('../config/passport')(passport);
const { Router } = require('express');
const { checkIfAdmin, checkIfUserMatch } = require('../middleware/auth');
const {
  listUsers,
  listUser,
  updateUser,
  deleteUser,
} = require('../controllers/usersController');

const usersRouter = Router();

usersRouter.all('*', passport.authenticate('jwt', { session: false }));
usersRouter.get('/', checkIfAdmin, listUsers);
usersRouter.use('/:userId', checkIfUserMatch);
usersRouter.get('/:userId', listUser);
usersRouter.put('/:userId', updateUser);
usersRouter.delete('/:userId', deleteUser);

module.exports = { usersRouter };
