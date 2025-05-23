// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import pluginJest from 'eslint-plugin-jest'
import vitest from 'eslint-plugin-vitest'
import tailwind from "eslint-plugin-tailwindcss";
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default tseslint.config(
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
    files: ['apps/frontend/src/**'],
    extends: [
      ...pluginVue.configs['flat/recommended'],
      ...tailwind.configs['flat/recommended'],
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
