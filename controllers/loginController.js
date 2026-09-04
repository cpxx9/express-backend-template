const asyncHandler = require('express-async-handler');
const { prisma } = require('../lib/prisma');
const {
  validPassword,
  issueJWT,
  hashToken
} = require('../utils/passwordUtils');
const { backoffMs } = require('../utils/backoff');
const { validateLogin } = require('../utils/validations');
const { handleValidation } = require('../middleware/handleValidation');
const { refreshCookieOptions } = require('../config/cookieOptions');
const { LOGIN_FAIL_THRESHOLD } = require('../lib/constants');
const CustomUnauthorizedError = require('../errors/CustomUnauthorizedError');

const loginController = [
  validateLogin,
  handleValidation,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username
      }
    });

    const failMsg = 'incorrect username or password';

    if (!user) {
      throw new CustomUnauthorizedError(failMsg);
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new CustomUnauthorizedError(failMsg);
    }

    const isValid = validPassword(req.body.password, user.hash);

    if (!isValid) {
      const failedAttempts = user.failedAttempts + 1;
      const data = { failedAttempts };
      if (failedAttempts > LOGIN_FAIL_THRESHOLD) {
        data.lockedUntil = new Date(Date.now() + backoffMs(failedAttempts));
      }
      await prisma.user.update({ where: { id: user.id }, data });
      throw new CustomUnauthorizedError(failMsg);
    }

    if (user.failedAttempts !== 0 || user.lockedUntil !== null) {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedAttempts: 0, lockedUntil: null }
      });
    }

    const { accessToken, refreshToken } = issueJWT(user);

    await prisma.refreshToken.create({
      data: {
        token: hashToken(refreshToken.token),
        userId: user.id,
        expiresAt: refreshToken.expiresAt
      }
    });

    res.cookie('jwt', refreshToken.token, refreshCookieOptions);

    return res.status(200).json({
      success: true,
      token: accessToken.token,
      expiresIn: accessToken.expires
    });
  })
];

module.exports = {
  loginController
};
