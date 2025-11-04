module.exports = {
  preset: 'jest-preset-angular',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@debts/(.*)$': '<rootDir>/src/app/debts/$1',
    '^@expenses/(.*)$': '<rootDir>/src/app/expenses/$1',
    '^@forecast/(.*)$': '<rootDir>/src/app/forecast/$1',
    '^@settings/(.*)$': '<rootDir>/src/app/settings/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@state/(.*)$': '<rootDir>/src/app/state/$1',
    '^@stats/(.*)$': '<rootDir>/src/app/stats/$1',
    '^@users/(.*)$': '<rootDir>/src/app/users/$1',
    '^@weather/(.*)$': '<rootDir>/src/app/weather/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1'
  },

  transform: {
    '^.+\\.(ts|js|mjs|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$'
      }
    ]
  },

  moduleFileExtensions: ['ts', 'html', 'js', 'json'],

  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },

  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  cacheDirectory: '<rootDir>/.jest-cache'
};
