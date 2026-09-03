const asyncHandler = require('express-async-handler');
const { prisma } = require('../lib/prisma');
const {
  validPassword,
  issueJWT,
  hashToken
} = require('../utils/passwordUtils');
const { validateLogin } = require('../utils/validations');
const { handleValidation } = require('../middleware/handleValidation');
const { refreshCookieOptions } = require('../config/cookieOptions');
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

    if (!user || !validPassword(req.body.password, user.hash)) {
      throw new CustomUnauthorizedError('incorrect username or password');
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
