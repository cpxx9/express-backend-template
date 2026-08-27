const { REFRESH_EXP_MS } = require('../lib/constants');

const isProd = process.env.NODE_ENV === 'production';

const baseCookieOptions = {
  httpOnly: true,
  sameSite: isProd ? 'None' : 'Lax',
  secure: isProd,
  path: '/'
};

const refreshCookieOptions = {
  ...baseCookieOptions,
  maxAge: REFRESH_EXP_MS
};

module.exports = { baseCookieOptions, refreshCookieOptions };
