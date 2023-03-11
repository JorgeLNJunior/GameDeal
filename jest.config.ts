import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/testing/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', 'dist'],
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/modules/database/migrations/**/*',
    '!src/dependencies/**/*',
    '!**/*.dto.ts',
    '!**/*.interface.ts',
    '!**/*.type.ts'
  ],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@dependencies/(.*)$': '<rootDir>/src/dependencies/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@cron/(.*)$': '<rootDir>/src/modules/cron/$1',
    '^@database/(.*)$': '<rootDir>/src/modules/database/$1',
    '^@http/(.*)$': '<rootDir>/src/modules/http/$1',
    '^@infra/(.*)$': '<rootDir>/src/modules/infra/$1',
    '^@queue/(.*)$': '<rootDir>/src/modules/queue/$1',
    '^@scrapers/(.*)$': '<rootDir>/src/modules/scrapers/$1',
    '^@localtypes/(.*)$': '<rootDir>/src/types/$1'
  },
  verbose: true,
  testTimeout: 15000
}

export default config
