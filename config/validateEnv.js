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
    const weak = ['ACCESS_SECRET', 'REFRESH_SECRET'].filter(
      (key) => process.env[key].length < 32
    );
    if (weak.length > 0) {
      throw new Error(
        `JWT secret(s) too short for production (need ≥32 chars): ${weak.join(', ')}`
      );
    }
  }
}

module.exports = { validateEnv };
