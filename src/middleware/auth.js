const asyncHandler = require('express-async-handler');
const { prisma } = require('../lib/prisma');
const CustomNotFoundError = require('../errors/CustomNotFoundError');
const CustomForbiddenError = require('../errors/CustomForbiddenError');

const notFound = asyncHandler(async (req, res, next) => {
  throw new CustomNotFoundError('This api route does not exist');
});

const checkIfAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    throw new CustomForbiddenError('Only admins can access this route');
  }
});

const checkIfUserMatch = asyncHandler(async (req, res, next) => {
  if (req.user.id === req.params.userId || req.user.admin) {
    next();
  } else {
    throw new CustomForbiddenError(
      'You must be logged in as this user to access this account'
    );
  }
});

module.exports = {
  // checkIfLoggedIn,
  notFound,
  checkIfAdmin,
  checkIfUserMatch
};
