const isProd = process.env.NODE_ENV === 'production';

const baseCookieOptions = {
  httpOnly: true,
  sameSite: isProd ? 'None' : 'Lax',
  secure: isProd,
  path: '/'
};

const refreshCookieOptions = {
  ...baseCookieOptions,
  maxAge: 24 * 60 * 60 * 1000
};

module.exports = { baseCookieOptions, refreshCookieOptions };
