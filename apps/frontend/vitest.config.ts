import { fileURLToPath } from 'node:url'

import { mergeConfig } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'

import viteConfig from './vite.config.js'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*', 'src/types/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        all: true,
        provider: 'v8',
        reporter: ['clover', 'json', 'lcov', 'text'],
        include: ['src/**/*.ts', 'src/**/*.vue'],
        exclude: [
          'src/main.ts',
          'src/router/index.ts',
          'src/types',
          'src/**/*.spec.ts',
        ]
      },
      setupFiles: ['testing/setup.ts'],
      reporters: 'verbose'
    }
  })
)
