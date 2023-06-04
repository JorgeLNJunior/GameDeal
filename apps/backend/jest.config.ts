import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/testing/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', 'dist'],
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/modules/database/migrations/**/*',
    '!src/modules/database/scripts/**/*',
    '!src/dependencies/**/*',
    '!src/types/**/*',
    '!**/*.interface.ts',
    '!**/*.dto.ts',
    '!**/*.query.ts',
    '!**/*.type.ts',
    '!src/infra/newrelic.ts',
    '!src/main.ts'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@testing/(.*)$': '<rootDir>/testing/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@dependencies/(.*)$': '<rootDir>/src/dependencies/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@cron/(.*)$': '<rootDir>/src/modules/cron/$1',
    '^@database/(.*)$': '<rootDir>/src/modules/database/$1',
    '^@api/(.*)$': '<rootDir>/src/modules/api/$1',
    '^@infra/(.*)$': '<rootDir>/src/modules/infra/$1',
    '^@queue/(.*)$': '<rootDir>/src/modules/queue/$1',
    '^@scrapers/(.*)$': '<rootDir>/src/modules/scrapers/$1',
    '^@notification/(.*)$': '<rootDir>/src/modules/notification/$1',
    '^@workers/(.*)$': '<rootDir>/src/modules/workers/$1',
    '^@shared/(.*)$': '<rootDir>/src/modules/shared/$1',
    '^@localtypes/(.*)$': '<rootDir>/src/types/$1'
  },
  verbose: true,
  testTimeout: 15000
}

export default config
