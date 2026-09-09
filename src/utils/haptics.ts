/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Thin wrapper around @capacitor/haptics. Field officers often work in bright
 * sunlight or with gloves on — a vibration confirming "GPS locked" or "synced"
 * is a trust signal that doesn't depend on reading the screen. Every call is
 * fire-and-forget and swallows errors, since haptics are a nice-to-have that
 * must never block or throw on devices/browsers where the plugin is
 * unavailable (older Android WebViews, desktop browsers, etc).
 */
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

async function safe(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch {
    // No-op: haptics unsupported on this device/browser.
  }
}

export const haptics = {
  /** Light tap — minor confirmations (GPS lock acquired, item added). */
  light: () => safe(() => Haptics.impact({ style: ImpactStyle.Light })),
  /** Medium tap — more significant confirmations (submission queued). */
  medium: () => safe(() => Haptics.impact({ style: ImpactStyle.Medium })),
  /** Success pattern — data successfully synced to the server. */
  success: () => safe(() => Haptics.notification({ type: NotificationType.Success })),
  /** Warning pattern — saved offline / will retry later. */
  warning: () => safe(() => Haptics.notification({ type: NotificationType.Warning })),
  /** Error pattern — action failed and needs user attention. */
  error: () => safe(() => Haptics.notification({ type: NotificationType.Error })),
};
