const refreshCookieOptions = {
  httpOnly: true,
  sameSite: 'None',
  secure: true,
  maxAge: 24 * 60 * 60 * 1000
};

module.exports = { refreshCookieOptions };
