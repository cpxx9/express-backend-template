const asyncHandler = require('express-async-handler');
const { prisma } = require('../lib/prisma');
const { genPassword, issueJWT, hashToken } = require('../utils/passwordUtils');
const { validateUser } = require('../utils/validations');
const { handleValidation } = require('../middleware/handleValidation');
const { refreshCookieOptions } = require('../config/cookieOptions');

const postNewUser = [
  validateUser,
  handleValidation,
  asyncHandler(async (req, res) => {
    const { hash } = genPassword(req.body.password);

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
  })
];

module.exports = {
  postNewUser
};
