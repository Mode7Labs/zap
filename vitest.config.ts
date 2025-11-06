import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Environment setup
    environment: 'jsdom',

    // Global test utilities
    globals: true,

    // Setup files
    setupFiles: ['./test/setup.ts'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',

      // Coverage thresholds (aim for 80%+)
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },

      // Include src files
      include: ['src/**/*.ts'],

      // Exclude certain files
      exclude: [
        'node_modules/',
        'dist/',
        'docs/',
        'test/',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
    },

    // Test file patterns
    include: ['test/**/*.test.ts', 'src/**/*.test.ts'],

    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
