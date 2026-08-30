const { prisma } = require('../lib/prisma');
const { baseCookieOptions } = require('../config/cookieOptions');
const { hashToken } = require('../utils/passwordUtils');

const logoutController = async (req, res, next) => {
  // On frontend, delete the access token from memory
  const { cookies } = req;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  try {
    await prisma.refreshToken.deleteMany({
      where: { token: hashToken(refreshToken) }
    });

    res.clearCookie('jwt', baseCookieOptions);

    res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};

module.exports = { logoutController };
