export default {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.spec.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};