module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'ES2021',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prettier', 'simple-import-sort'],
  overrides: [
    {
      files: ['**/*.spec.ts'],
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
    'simple-import-sort/exports': 'error'
  }
}
