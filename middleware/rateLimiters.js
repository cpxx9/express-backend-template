const rateLimit = require('express-rate-limit');

const passthrough = (req, res, next) => next();
const isTest = process.env.NODE_ENV === 'test';

const authLimiter = isTest
  ? passthrough
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
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

module.exports = { authLimiter, refreshLimiter };
