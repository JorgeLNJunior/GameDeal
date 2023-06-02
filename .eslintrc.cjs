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
        sourceType: 'module',
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
        sourceType: 'module',
        project: path.join(__dirname, 'apps/backend/tsconfig.json')
      }
    },
    // frontend .ts files
    {
      files: ['apps/frontend/**/*.ts'],
      extends: ['standard-with-typescript'],
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
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
        '@vue/eslint-config-standard-with-typescript'
      ],
      parserOptions: {
        ecmaVersion: 'latest',
        project: [
          path.join(__dirname, 'apps/frontend/tsconfig.json'),
        ]
      }
    },
    // frontend test files
    {
      files: ['apps/frontend/**/*.spec.ts'],
      plugins: ['jest'],
      extends: ['standard-with-typescript'],
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: path.join(__dirname, 'apps/frontend/tsconfig.vitest.json')
      }
    },
  ],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/no-explicit-any': 'warn'
  }
}
