module.exports = {
  preset: "jest-preset-angular",
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  testEnvironment: "jsdom",

  moduleNameMapper: {
    "^@core/(.*)$": "<rootDir>/libs/shared/src/lib/core/$1",
    "^@debts/(.*)$": "<rootDir>/libs/shared/src/lib/debts/$1",
    "^@expenses/(.*)$": "<rootDir>/libs/shared/src/lib/expenses/$1",
    "^@forecast/(.*)$": "<rootDir>/libs/shared/src/lib/forecast/$1",
    "^@settings/(.*)$": "<rootDir>/libs/shared/src/lib/settings/$1",
    "^@shared/(.*)$": "<rootDir>/libs/shared/src/lib/shared/$1",
    "^@state/(.*)$": "<rootDir>/libs/shared/src/lib/state/$1",
    "^@stats/(.*)$": "<rootDir>/libs/shared/src/lib/stats/$1",
    "^@users/(.*)$": "<rootDir>/libs/shared/src/lib/users/$1",
    "^@weather/(.*)$": "<rootDir>/libs/shared/src/lib/weather/$1",
    "^@env/(.*)$": "<rootDir>/libs/shared/src/environments/$1",
    "^shared$": "<rootDir>/libs/shared/src/index.ts",
  },

  transform: {
    "^.+\\.(ts|js|mjs|html)$": [
      "jest-preset-angular",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
        stringifyContentPathRegex: "\\.html$",
      },
    ],
  },

  moduleFileExtensions: ["ts", "html", "js", "json"],

  coverageDirectory: "coverage",
  collectCoverage: true,
  coverageProvider: "v8",

  transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$|@angular|@ngrx|rxjs)"],
  cacheDirectory: "<rootDir>/.jest-cache",
};
