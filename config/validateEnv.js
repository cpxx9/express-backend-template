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
}

module.exports = { validateEnv };
