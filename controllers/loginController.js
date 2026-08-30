const { validationResult } = require('express-validator');
const { prisma } = require('../lib/prisma');
const { validPassword, issueJWT } = require('../utils/passwordUtils');
const { validateLogin } = require('../utils/validations');
const { refreshCookieOptions } = require('../config/cookieOptions');

const loginController = [
  validateLogin,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: req.body.username
        }
      });

      if (!user) {
        return res
          .status(401)
          .json({ success: false, msg: 'incorrect username or password' });
      }

      const isValid = validPassword(req.body.password, user.hash, user.salt);

      if (!isValid) {
        return res
          .status(401)
          .json({ success: false, msg: 'incorrect username or password' });
      }
      const { accessToken, refreshToken } = issueJWT(user);

      await prisma.refreshToken.create({
        data: {
          token: refreshToken.token,
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
    } catch (err) {
      return next(err);
    }
  }
];

module.exports = {
  loginController
};
