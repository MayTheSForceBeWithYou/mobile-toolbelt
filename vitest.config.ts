import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@mobile-toolbelt/core': resolve(__dirname, 'packages/core/src'),
      '@mobile-toolbelt/shared': resolve(__dirname, 'packages/shared/src'),
      '@mobile-toolbelt/ios': resolve(__dirname, 'packages/ios/src'),
      '@mobile-toolbelt/android': resolve(__dirname, 'packages/android/src'),
    },
  },
  test: {
    include: ['src/**/*.test.ts', 'packages/**/src/**/*.test.ts'],
  },
});
