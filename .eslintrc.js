module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:jsdoc/recommended-error'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'ES2021',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'simple-import-sort',
    'eslint-plugin-tsdoc',
    'eslint-plugin-jsdoc'
  ],
  overrides: [
    {
      files: ['**/*.spec.ts', '**/*.test.ts'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended']
    }
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        trailingComma: 'none'
      }
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-returns': 'off',
    'jsdoc/require-returns-type': 'off',
    'tsdoc/syntax': 'error'
  }
}
