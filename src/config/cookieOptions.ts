import { REFRESH_EXP_MS } from '../lib/constants';

export const isDevOrTest =
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development';

export const baseCookieOptions = {
  httpOnly: true,
  sameSite: !isDevOrTest ? 'None' : 'Lax',
  secure: !isDevOrTest,
  path: '/'
};

export const refreshCookieOptions = {
  ...baseCookieOptions,
  maxAge: REFRESH_EXP_MS
};
