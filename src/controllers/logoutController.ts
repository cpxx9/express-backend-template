import asyncHandler from 'express-async-handler';
import { prisma } from '../lib/prisma';
import { baseCookieOptions } from '../config/cookieOptions';
import { hashToken } from '../utils/passwordUtils';
import { Request, Response } from 'express';

export const logoutController = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { cookies } = req;
    if (!cookies?.jwt) return res.sendStatus(204);

    await prisma.refreshToken.deleteMany({
      where: { token: hashToken(cookies.jwt) }
    });

    res.clearCookie('jwt', baseCookieOptions);
    res.sendStatus(204);
  }
);
