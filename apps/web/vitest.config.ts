import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@pmis/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@pmis/types': path.resolve(__dirname, '../../packages/types/src'),
      '@pmis/geo': path.resolve(__dirname, '../../packages/geo/src'),
      '@pmis/gis': path.resolve(__dirname, '../../packages/gis/src'),
      '@pmis/db': path.resolve(__dirname, '../../packages/db/src'),
    },
  },
});
