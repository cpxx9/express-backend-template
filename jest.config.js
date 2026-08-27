module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/__tests__/loadEnv.js'],
  globalSetup: '<rootDir>/__tests__/globalSetup.js',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setupAfterEnv.js'],
  testMatch: ['**/__tests__/**/*.test.js']
};
