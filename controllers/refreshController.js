require('dotenv/config');
const jwt = require('jsonwebtoken');
const { prisma } = require('../lib/prisma');
const { issueJWT } = require('../utils/passwordUtils');
const { refreshCookieOptions } = require('../config/cookieOptions');

const refreshController = async (req, res, next) => {
  const { cookies } = req;
  if (!cookies?.jwt) {
    return res
      .status(401)
      .json({ success: false, msg: 'No token present in request' });
  }

  const refreshToken = cookies.jwt;

  try {
    const session = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!session) {
      return res.status(403).json({ success: false, msg: 'Incorrect token' });
    }

    if (session.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: session.id } });
      return res.status(403).json({ success: false, msg: 'Token expired' });
    }

    const { user } = session;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET,
      async (err, decoded) => {
        if (err || user.id !== decoded.sub) {
          return res.status(403).json({ success: false, msg: 'Invalid token' });
        }

        const { accessToken, refreshToken: newRefresh } = issueJWT(user);

        await prisma.refreshToken.update({
          where: { id: session.id },
          data: {
            token: newRefresh.token,
            expiresAt: newRefresh.expiresAt
          }
        });

        res.cookie('jwt', newRefresh.token, refreshCookieOptions);

        return res.status(200).json({
          success: true,
          token: accessToken.token,
          expiresIn: accessToken.expires
        });
      }
    );
  } catch (err) {
    return next(err);
  }
};

module.exports = { refreshController };
