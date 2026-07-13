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
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,txt}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/unpkg\.com\/maplibre-gl@[\d\.]+\/dist\/maplibre-gl/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'maplibre-assets',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: { statuses: [0, 200] }
              }
            },
            {
              urlPattern: /^https:\/\/unpkg\.com\/@maplibre\/maplibre-gl-draw/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'maplibre-draw-assets',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] }
              }
            },
            {
              urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/npm\/@turf\/turf/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'turf-assets',
                expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] }
              }
            },
            {
              urlPattern: /^https:\/\/[a-c]\.tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'openstreetmap-tiles',
                expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
                cacheableResponse: { statuses: [0, 200] }
              }
            },
            {
              urlPattern: /^https:\/\/[a-d]\.basemaps\.cartocdn\.com/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'cartodb-tiles',
                expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
                cacheableResponse: { statuses: [0, 200] }
              }
            },
            {
              urlPattern: /^https:\/\/[a-z]\.arcgisonline\.com/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'esri-tiles',
                expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
                cacheableResponse: { statuses: [0, 200] }
              }
            },
            {
              urlPattern: /^https:\/\/[a-c]\.tile\.opentopomap\.org/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'opentopomap-tiles',
                expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
                cacheableResponse: { statuses: [0, 200] }
              }
            },
            {
              urlPattern: /\/gis\/boundaries\/.*\.geojson$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'admin-boundaries',
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 7 },
                cacheableResponse: { statuses: [0, 200] }
              }
            }
          ]
        },
        manifest: {
          name: 'plantation-tracker',
          short_name: 'বৃক্ষরোপণ ট্র্যাকার',
          description: '"০৫ বছরে ২৫ কোটি বৃক্ষরোপণ" কর্মসূচী - স্বয়ংক্রিয় জিও-কোডিং ও স্যাটেলাইট ট্র্যাকিং',
          theme_color: '#006A4E',
          background_color: '#006A4E',
          display: 'standalone',
          orientation: 'any',
          icons: [
            {
              src: 'logo.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            },
            {
              src: 'pwa-192x192.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            },
            {
              src: 'pwa-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            },
            {
              src: 'logo.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'apple-touch-icon.png',
              sizes: '180x180',
              type: 'image/png'
            }
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
      sourcemap: false,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            'google-genai': ['@google/genai']
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
