module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true
  },
  extends: ['standard-with-typescript'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    'simple-import-sort'
  ],
  overrides: [
    {
      files: ['**/*.spec.ts', '**/*.test.ts'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended']
    }
  ],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/no-explicit-any': 'warn'
  }
}
