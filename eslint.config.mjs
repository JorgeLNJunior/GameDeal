// @ts-check
import eslint from '@eslint/js';
import vitest from '@vitest/eslint-plugin'
import pluginJest from 'eslint-plugin-jest'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    name: 'ignores',
    ignores: ['dist', 'compose']
  },
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  // testing
  {
    files: ['apps/backend/src/**/*.spec.js', 'apps/backend/src/**/*.test.js'],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
  },
  {
    files: ["apps/frontend/src/**/*.spec.ts", "apps/frontend/src/**/*.test.ts"],
    plugins: {
      vitest
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },

  // vue
  {
    files: ['apps/frontend/src/**/*.vue'],
    ignores: ['apps/frontend/src/components/ui/**'], // shadcn/vue components
    extends: [
      ...pluginVue.configs['flat/recommended'],
      // FIX: disabled until tailwind v4 support
      // ...tailwind.configs['flat/recommended'],
    ],
    languageOptions: {
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: tseslint.parser
      }
    }
  },
);
