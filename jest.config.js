module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/loadEnv.js'],
  globalSetup: '<rootDir>/tests/globalSetup.js',
  setupFilesAfterEnv: ['<rootDir>/tests/setupAfterEnv.js'],
  testMatch: ['**/__tests__/**/*.test.js']
};
