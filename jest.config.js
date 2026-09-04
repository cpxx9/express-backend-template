module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/__tests__/setup/loadEnv.js'],
  globalSetup: '<rootDir>/__tests__/setup/globalSetup.js',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/setupAfterEnv.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  transform: {
    '^.+\\.(ts|js)$': [
      'ts-jest',
      { tsconfig: 'tsconfig.json', isolateModules: true }
    ]
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node']
};
