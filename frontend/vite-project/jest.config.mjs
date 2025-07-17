export default {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/__tests__/**/*.spec.[jt]s?(x)',
  ],
};
