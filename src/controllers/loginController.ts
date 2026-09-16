import asyncHandler from 'express-async-handler';
import { prisma } from '../lib/prisma';
import { validPassword, issueJWT, hashToken } from '../utils/passwordUtils';
import { backoffMs } from '../utils/backoff';
import { validateLogin } from '../utils/validations';
import { handleValidation } from '../middleware/handleValidation';
import { refreshCookieOptions } from '../config/cookieOptions';
import { LOGIN_FAIL_THRESHOLD } from '../lib/constants';
import CustomUnauthorizedError from '../errors/CustomUnauthorizedError';
import { Request, Response } from 'express';

const loginController = [
  ...validateLogin,
  handleValidation,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username
      }
    });

    const failMsg = 'incorrect username or password';

    if (!user) {
      throw new CustomUnauthorizedError(failMsg);
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new CustomUnauthorizedError(failMsg);
    }

    const isValid = validPassword(req.body.password, user.hash);

    if (!isValid) {
      const failedAttempts = user.failedAttempts + 1;
      const data: { failedAttempts: number; lockedUntil?: Date } = {
        failedAttempts
      };
      if (failedAttempts > LOGIN_FAIL_THRESHOLD) {
        data.lockedUntil = new Date(Date.now() + backoffMs(failedAttempts));
      }
      await prisma.user.update({ where: { id: user.id }, data });
      throw new CustomUnauthorizedError(failMsg);
    }

    if (user.failedAttempts !== 0 || user.lockedUntil !== null) {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedAttempts: 0, lockedUntil: null }
      });
    }

    const { accessToken, refreshToken } = issueJWT(user);

    await prisma.refreshToken.create({
      data: {
        token: hashToken(refreshToken.token),
        userId: user.id,
        expiresAt: refreshToken.expiresAt
      }
    });

    res.cookie('jwt', refreshToken.token, refreshCookieOptions);

    res.status(200).json({
      success: true,
      token: accessToken.token,
      expiresIn: accessToken.expires
    });
  })
];

export { loginController };
