const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowms: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    msg: 'Too many attempts, please try again later.'
  },
  skipSuccessfulRequests: true
});

const refreshLimiter = rateLimit({
  windowms: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    msg: 'Too many refresh attempts, please try again later.'
  }
});

module.exports = { authLimiter, refreshLimiter };
