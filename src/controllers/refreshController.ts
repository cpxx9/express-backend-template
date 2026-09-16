import 'dotenv/config';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { issueJWT, hashToken } from '../utils/passwordUtils';
import { refreshCookieOptions } from '../config/cookieOptions';
import CustomUnauthorizedError from '../errors/CustomUnauthorizedError';
import CustomForbiddenError from '../errors/CustomForbiddenError';

export const refreshController = asyncHandler(
  async (req: Request, res: Response) => {
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
      decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET as string);
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

    res.status(200).json({
      success: true,
      token: accessToken.token,
      expiresIn: accessToken.expires
    });
  }
);
