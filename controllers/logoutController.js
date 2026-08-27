const { prisma } = require('../lib/prisma');
const { refreshCookieOptions } = require('../config/cookieOptions');

const logoutController = async (req, res, next) => {
  // On frontend, delete the access token from memory
  const { cookies } = req;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  try {
    const user = await prisma.user.findFirst({
      where: {
        refresh: refreshToken
      }
    });

    res.clearCookie('jwt', refreshCookieOptions);

    if (user) {
      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          refresh: ''
        }
      });
    }

    res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};

module.exports = { logoutController };
