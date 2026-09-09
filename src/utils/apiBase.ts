/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Capacitor } from '@capacitor/core';

// See the matching comment in public/part2.txt for the full story: a
// relative "/api/gas-sync" only reaches the Vercel proxy when the WebView's
// origin is actually plantation.krishiai.live. The Capacitor Android build
// has no `server.url` override, so it loads bundled assets from a local
// WebView origin instead, and relative API calls resolve to nothing there.
// Vercel already sends Access-Control-Allow-Origin: * on /api/*, so an
// absolute URL works fine cross-origin from the native app.
const PRODUCTION_ORIGIN = 'https://plantation.krishiai.live';

export const GAS_SYNC_ENDPOINT = Capacitor.isNativePlatform()
  ? `${PRODUCTION_ORIGIN}/api/gas-sync`
  : '/api/gas-sync';

export const VALIDATION_TASKS_ENDPOINT = Capacitor.isNativePlatform()
  ? `${PRODUCTION_ORIGIN}/api/validation-tasks`
  : '/api/validation-tasks';
