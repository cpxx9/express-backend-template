const REQUIRED = ['ACCESS_SECRET', 'REFRESH_SECRET', 'DATABASE_URL'];

function validateEnv() {
  const missing = REQUIRED.filter(
    (key) => !process.env[key] || process.env[key].trim() === ''
  );
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}.` +
        `Check your .env file`
    );
  }

  if (process.env.NODE_ENV === 'production') {
    ['ACCESS_SECRET', 'REFRESH_SECRET'].forEach((key) => {
      if (process.env[key].length < 32) {
        throw new Error(`${key} is too short for production (need ≥32 chars).`);
      }
    });
  }
}

module.exports = { validateEnv };
