const { REFRESH_EXP_MS } = require('../lib/constants');

const isDevOrTest = process.env.NODE_ENV === 'test' || 'development';

const baseCookieOptions = {
  httpOnly: true,
  sameSite: !isDevOrTest ? 'None' : 'Lax',
  secure: !isDevOrTest,
  path: '/'
};

const refreshCookieOptions = {
  ...baseCookieOptions,
  maxAge: REFRESH_EXP_MS
};

module.exports = { baseCookieOptions, refreshCookieOptions };
