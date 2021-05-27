const { defaults } = require('jest-config');

module.exports = {
  ...defaults,
  testPathIgnorePatterns: [...defaults.testPathIgnorePatterns, '/cypress/'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svgrMock.js',
    '@/(.*)$': '<rootDir>/src/$1',
  }
};
