require('dotenv/config');
const jwt = require('jsonwebtoken');
const { prisma } = require('../lib/prisma');
const { issueJWT } = require('../utils/passwordUtils');

const refreshController = async (req, res, next) => {
  const { cookies } = req;
  if (!cookies?.jwt) {
    return res
      .status(401)
      .json({ success: false, msg: 'No token present in request' });
  }

  const refreshToken = cookies.jwt;

  try {
    const user = await prisma.user.findFirst({
      where: {
        refresh: refreshToken
      }
    });

    if (!user) {
      return res.status(403).json({ success: false, msg: 'Incorrect token' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.sub) {
        return res
          .status(403)
          .json({ success: false, msg: 'Invalid response' });
      }

      const { accessToken } = issueJWT(user);

      res.status(200).json({
        success: true,
        token: accessToken.token,
        expiresIn: accessToken.expires
      });
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { refreshController };
