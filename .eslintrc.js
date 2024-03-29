/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')
const path = require('path')

module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
    browser: true
  },
  parserOptions: {
    sourceType: 'module'
  },
  plugins: [
    'simple-import-sort'
  ],
  overrides: [
    // backend .ts files
    {
      files: ['apps/backend/**/*.ts'],
      extends: ['standard-with-typescript'],
      parserOptions: {
        ecmaVersion: 2021,
        project: path.join(__dirname, 'apps/backend/tsconfig.json')
      }
    },
    // backend test files
    {
      files: ['apps/backend/**/*.spec.ts'],
      plugins: ['jest'],
      extends: ['standard-with-typescript', 'plugin:jest/recommended'],
      parserOptions: {
        ecmaVersion: 2021,
        project: path.join(__dirname, 'apps/backend/tsconfig.json')
      }
    },
    // frontend .ts files
    {
      files: ['apps/frontend/src/**/*.ts'],
      extends: ['standard-with-typescript'],
      parserOptions: {
        ecmaVersion: 2021,
        project: [
          path.join(__dirname, 'apps/frontend/tsconfig.app.json'),
          path.join(__dirname, 'apps/frontend/tsconfig.node.json')
        ]
      }
    },
    // frontend .vue files
    {
      files: ['apps/frontend/src/**/*.vue'],
      extends: [
        'plugin:vue/vue3-essential',
        '@vue/eslint-config-standard-with-typescript',
        'plugin:tailwindcss/recommended'
      ],
      parserOptions: {
        ecmaVersion: 'latest',
        project: [
          path.join(__dirname, 'apps/frontend/tsconfig.json'),
        ],
        sourceType: 'module'
      },
      rules: {
        'tailwindcss/no-custom-classname': ['error', {
          config: path.join(__dirname, 'apps/frontend/tailwind.config.js')
        }]
      }
    },
    // frontend test files
    {
      files: ['apps/frontend/src/**/*.spec.ts'],
      extends: ['standard-with-typescript', 'plugin:vitest/recommended'],
      plugins: ['vitest'],
      parserOptions: {
        ecmaVersion: 2021,
        project: path.join(__dirname, 'apps/frontend/tsconfig.vitest.json')
      },
    },
    // packages .ts files
    {
      files: ['packages/**/*.ts'],
      extends: ['standard-with-typescript'],
      parserOptions: {
        ecmaVersion: 2021,
        project: path.join(__dirname, 'packages/tsconfig.json')
      }
    },
  ],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/no-explicit-any': 'warn'
  }
}
