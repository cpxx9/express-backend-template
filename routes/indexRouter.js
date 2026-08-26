const { Router } = require('express');
const { loginRouter } = require('./loginRouter');
const { registerRouter } = require('./registerRouter');
const { refreshRouter } = require('./refreshRouter');
const { logoutRouter } = require('./logoutRouter');
const { usersRouter } = require('./usersRouter');

const indexRouter = Router();

indexRouter.use('/register', registerRouter);
indexRouter.use('/login', loginRouter);
indexRouter.use('/users', usersRouter);
indexRouter.use('/refresh', refreshRouter);
indexRouter.use('/logout', logoutRouter);

module.exports = {
  indexRouter
};
