const { validationResult } = require('express-validator');
const { prisma } = require('../lib/prisma');
const { genPassword, issueJWT } = require('../utils/passwordUtils');
const { validateUser } = require('../utils/validations');
const { prismaErrController } = require('../middleware/errorController');
const { refreshCookieOptions } = require('../config/cookieOptions');

const postNewUser = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { salt, hash } = genPassword(req.body.password);

    try {
      const user = await prisma.user.create({
        data: {
          username: req.body.username,
          email: req.body.email,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          hash,
          salt
        }
      });

      const { refreshToken, accessToken } = await issueJWT(user);

      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          refresh: refreshToken.token
        }
      });

      res.cookie('jwt', refreshToken.token, refreshCookieOptions);

      res.status(201).json({
        success: true,
        token: accessToken.token,
        expiresIn: accessToken.expires
      });
    } catch (err) {
      const newErr = prismaErrController(err);
      return next(newErr);
    }
  }
];

module.exports = {
  postNewUser
};
