import type { Config } from 'jest';

const config: Config = {
  rootDir: '.', // ✅ Fix the root directory
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage', // adjust path as needed
  testEnvironment: 'node',
};

export default config;

