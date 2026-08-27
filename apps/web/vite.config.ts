import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        minify: false,
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,txt}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/unpkg\.com\/leaflet@[\d\.]+\/dist\/leaflet\.(js|css)/,
              handler: 'CacheFirst',
              options: { cacheName: 'leaflet-assets', expiration: { maxEntries: 10, maxAgeSeconds: 31536000 } }
            },
            {
              urlPattern: /^https:\/\/[a-c]\.tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png/,
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'openstreetmap-tiles', expiration: { maxEntries: 500, maxAgeSeconds: 2592000 } }
            }
          ]
        },
        manifest: {
          name: 'PMIS V2 - KrishiAI Field Platform',
          short_name: 'PMIS V2',
          start_url: '/',
          scope: '/',
          description: 'Plantation Management Information System V2',
          theme_color: '#006A4E',
          background_color: '#006A4E',
          display: 'standalone',
          orientation: 'any',
          icons: [
            { src: 'logo.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
            { src: 'pwa-192x192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
            { src: 'pwa-512x512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      '__GEMINI_API_KEY__': JSON.stringify(env.GEMINI_API_KEY || ''),
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@pmis/ui': path.resolve(__dirname, '../../packages/ui/src'),
        '@pmis/types': path.resolve(__dirname, '../../packages/types/src'),
        '@pmis/geo': path.resolve(__dirname, '../../packages/geo/src'),
        '@pmis/gis': path.resolve(__dirname, '../../packages/gis/src'),
        '@pmis/db': path.resolve(__dirname, '../../packages/db/src')
      }
    },
    server: { hmr: process.env.DISABLE_HMR !== 'true' }
  };
});
