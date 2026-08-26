const { validationResult } = require('express-validator');
const { prisma } = require('../lib/prisma');
const { validPassword, issueJWT } = require('../utils/passwordUtils');
const { validateLogin } = require('../utils/validations');

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

      if (isValid) {
        delete user.hash;
        delete user.salt;
        const tokens = await issueJWT(user);
        const accessTokenObject = tokens.accessToken;
        const refreshToken = tokens.refreshToken.token.split(' ')[1];
        res.cookie('jwt', refreshToken, {
          httpOnly: true,
          sameSite: 'None',
          secure: true,
          maxAge: 24 * 60 * 60 * 1000
        });
        await prisma.user.update({
          where: {
            username: user.username
          },
          data: {
            refresh: refreshToken
          }
        });
        delete user.refresh;
        res.status(200).json({
          success: true,
          token: accessTokenObject.token,
          expiresIn: accessTokenObject.expires
        });
      } else {
        res
          .status(401)
          .json({ success: false, msg: 'incorrect username or password' });
      }
    } catch (err) {
      return next(err);
    }
  }
];

module.exports = {
  loginController
};
