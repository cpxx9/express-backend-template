import asyncHandler from 'express-async-handler';
import { prisma } from '../lib/prisma';
import { genPassword, issueJWT, hashToken } from '../utils/passwordUtils';
import { validateUser } from '../utils/validations';
import { handleValidation } from '../middleware/handleValidation';
import { refreshCookieOptions } from '../config/cookieOptions';

export const postNewUser = [
  ...validateUser,
  handleValidation,
  asyncHandler(async (req, res) => {
    const { hash } = genPassword(req.body.password);

    const user = await prisma.user.create({
      data: {
        username: req.body.username.toLowerCase().trim(),
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        hash
      }
    });

    const { refreshToken, accessToken } = issueJWT(user);

    await prisma.refreshToken.create({
      data: {
        token: hashToken(refreshToken.token),
        userId: user.id,
        expiresAt: refreshToken.expiresAt
      }
    });

    res.cookie('jwt', refreshToken.token, refreshCookieOptions);

    res.status(201).json({
      success: true,
      token: accessToken.token,
      expiresIn: accessToken.expires
    });
  })
];
