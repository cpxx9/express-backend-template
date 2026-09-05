require('dotenv/config');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { prisma } = require('../lib/prisma');
const { issueJWT, hashToken } = require('../utils/passwordUtils');
const { refreshCookieOptions } = require('../config/cookieOptions');
const CustomUnauthorizedError = require('../errors/CustomUnauthorizedError');
const CustomForbiddenError = require('../errors/CustomForbiddenError');

const refreshController = asyncHandler(async (req, res) => {
  const { cookies } = req;
  if (!cookies?.jwt) {
    throw new CustomUnauthorizedError('no token present in request');
  }

  const refreshToken = cookies.jwt;
  const tokenHash = hashToken(refreshToken);

  const session = await prisma.refreshToken.findUnique({
    where: { token: tokenHash },
    include: { user: true }
  });

  if (!session) {
    throw new CustomForbiddenError('incorrect token');
  }

  if (session.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: session.id } });
    throw new CustomForbiddenError('token expired');
  }

  const { user } = session;
  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  } catch (err) {
    throw new CustomForbiddenError('invalid token');
  }

  if (user.id !== decoded.sub) {
    throw new CustomForbiddenError('invalid token');
  }

  const { accessToken, refreshToken: newRefresh } = issueJWT(user);

  await prisma.refreshToken.update({
    where: { id: session.id },
    data: {
      token: hashToken(newRefresh.token),
      expiresAt: newRefresh.expiresAt
    }
  });

  res.cookie('jwt', newRefresh.token, refreshCookieOptions);

  return res.status(200).json({
    success: true,
    token: accessToken.token,
    expiresIn: accessToken.expires
  });
});

module.exports = { refreshController };
