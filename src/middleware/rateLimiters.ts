import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

const passthrough = (req: Request, res: Response, next: NextFunction) => next();
const isTest = process.env.NODE_ENV === 'test';

const authLimiter = isTest
  ? passthrough
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 20,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        msg: 'Too many attempts, please try again later.'
      },
      skipSuccessfulRequests: true
    });

const refreshLimiter = isTest
  ? passthrough
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        msg: 'Too many refresh attempts, please try again later.'
      }
    });

export { authLimiter, refreshLimiter };
