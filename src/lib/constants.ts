export const REFRESH_SECRET =
  process.env.REFRESH_SECRET || 'P3gOHGtYz7cZlQnHaHg9Qny2GjraKUk/s5Q2I7ZbzZk=';
export const ACCESS_SECRET =
  process.env.ACCESS_SECRET || 'rYi3Stjt+KW3B1eWV/oyHG7AMU3lMC90Wy6D2P81jZI=';
export const ACCESS_EXP = '15m';
export const REFRESH_EXP = '1d';
export const REFRESH_EXP_MS = 24 * 60 * 60 * 1000;

export const LOGIN_FAIL_THRESHOLD = 5;
export const LOGIN_BACKOFF_BASE_MS = 15 * 1000;
export const LOGIN_BACKOFF_MAX_MS = 15 * 60 * 1000;
