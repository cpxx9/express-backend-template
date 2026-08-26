const { prisma } = require('../lib/prisma');

const logoutController = async (req, res, next) => {
  // On frontend, delete the access token from memory
  const { cookies } = req;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt.split(' ')[1];
  try {
    const user = await prisma.user.findFirst({
      where: {
        refresh: refreshToken
      }
    });
    if (!user) {
      res.clearCookie('jwt', { httpOnly: true });
      return res.sendStatus(204);
    }
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        refresh: ''
      }
    });
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // add secure: true - https
    res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};

module.exports = { logoutController };
