import { fileURLToPath } from 'node:url'

import { mergeConfig } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*', 'src/types/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        all: true,
        reporter: ['clover', 'json', 'lcov', 'text'],
        include: ['src/**/*.ts', 'src/**/*.vue'],
        exclude: ['src/main.ts', 'src/router/index.ts', 'src/**/*.spec.ts']
      },
      passWithNoTests: true,
      reporters: 'verbose'
    }
  })
)
