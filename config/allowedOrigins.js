module.exports.allowedOrigins = [
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  ...process.env.EXTRA_ORIGINS.split(',')
];
