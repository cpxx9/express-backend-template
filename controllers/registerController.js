const { validationResult } = require('express-validator');
const { prisma } = require('../lib/prisma');
const { genPassword, issueJWT, hashToken } = require('../utils/passwordUtils');
const { validateUser } = require('../utils/validations');
const { refreshCookieOptions } = require('../config/cookieOptions');

const postNewUser = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { hash } = genPassword(req.body.password);

    try {
      const user = await prisma.user.create({
        data: {
          username: req.body.username.toLowerCase().trim(),
          email: req.body.email,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          hash
        }
      });

      const { refreshToken, accessToken } = issueJWT(user);

      await prisma.refreshToken.create({
        data: {
          token: hashToken(refreshToken.token),
          userId: user.id,
          expiresAt: refreshToken.expiresAt
        }
      });

      res.cookie('jwt', refreshToken.token, refreshCookieOptions);

      res.status(201).json({
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
  postNewUser
};
