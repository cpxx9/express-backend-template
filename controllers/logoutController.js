const asyncHandler = require('express-async-handler');
const { prisma } = require('../lib/prisma');
const { baseCookieOptions } = require('../config/cookieOptions');
const { hashToken } = require('../utils/passwordUtils');

const logoutController = asyncHandler(async (req, res) => {
  const { cookies } = req;
  if (!cookies?.jwt) return res.sendStatus(204);

  await prisma.refreshToken.deleteMany({
    where: { token: hashToken(cookies.jwt) }
  });

  res.clearCookie('jwt', baseCookieOptions);
  res.sendStatus(204);
});

module.exports = { logoutController };
