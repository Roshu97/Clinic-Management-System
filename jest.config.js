module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/cypress/firebase-rules-tests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};