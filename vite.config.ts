import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
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
          globIgnores: ['**/og-image-large.png', '**/og-share-large.png', 'assets/districts/**'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/unpkg\.com\/leaflet@[\d\.]+\/dist\/leaflet\.(js|css)/,
              handler: 'CacheFirst',
              options: { cacheName: 'leaflet-assets', expiration: { maxEntries: 10, maxAgeSeconds: 31536000 }, cacheableResponse: { statuses: [0,200] } }
            },
            {
              urlPattern: /^https:\/\/[a-c]\.tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png/,
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'openstreetmap-tiles', expiration: { maxEntries: 500, maxAgeSeconds: 2592000 }, cacheableResponse: { statuses: [0,200] } }
            },
            {
              urlPattern: /\/assets\/districts\/.*\.js$/,
              handler: 'CacheFirst',
              options: { cacheName: 'district-polygon-chunks', expiration: { maxEntries: 64, maxAgeSeconds: 31536000 }, cacheableResponse: { statuses: [0,200] } }
            }
          ]
        },
        manifest: {
          name: 'plantation-tracker',
          short_name: 'বৃক্ষরোপণ ট্র্যাকার',
          start_url: '/',
          scope: '/',
          description: '“০৫ বছরে ২৫ কোটি বৃক্ষরোপণ” কর্মসূচী',
          theme_color: '#006A4E',
          background_color: '#006A4E',
          display: 'standalone',
          orientation: 'any',
          icons: [
            { src: 'logo.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
            { src: 'pwa-192x192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
            { src: 'pwa-512x512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: 'icon-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
            { src: 'icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
            { src: 'apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
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
      outDir: 'build',
      rollupOptions: {
        output: {
          chunkFileNames: (chunkInfo) => {
            const id = chunkInfo.facadeModuleId || '';
            if (id.includes(`${path.sep}data${path.sep}districts${path.sep}`) || id.includes('/data/districts/')) {
              return 'assets/districts/[name]-[hash].js';
            }
            return 'assets/[name]-[hash].js';
          },
        },
      },
    },
    resolve: { alias: { '@': path.resolve(__dirname, '.') } },
    server: { hmr: process.env.DISABLE_HMR !== 'true' },
  };
});
