import { CookieOptions } from 'express';
import { REFRESH_EXP_MS } from '../lib/constants';

export const isDevOrTest =
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development';

export const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: !isDevOrTest ? 'none' : 'lax',
  secure: !isDevOrTest,
  path: '/'
};

export const refreshCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: REFRESH_EXP_MS
};
