const STORAGE_KEY = 'plantation_device_id';

/**
 * Simple djb2-style hash — no external dependencies.
 */
function simpleHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Build a browser fingerprint from available navigator/screen properties.
 */
function browserFingerprint(): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav = navigator as any;
  const parts = [
    nav.userAgent ?? '',
    `${screen.width}x${screen.height}`,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    nav.language ?? '',
    nav.hardwareConcurrency ?? '',
    nav.platform ?? '',
  ];
  return parts.join('|');
}

/**
 * Attempt to get a native device ID via @capacitor/device.
 * Returns null if Capacitor is not available.
 */
async function nativeDeviceId(): Promise<string | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { Device } = await import('@capacitor/device' as any);
    const info = await Device.getId();
    return info.identifier ?? null;
  } catch {
    return null;
  }
}

/**
 * Return a stable device identifier.
 *
 * 1. Return cached value from localStorage if present.
 * 2. Try Capacitor native ID first (Android / iOS).
 * 3. Fall back to a browser fingerprint hash.
 * 4. Persist the result in localStorage.
 */
export async function getDeviceId(): Promise<string> {
  // 1. Check cache
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    return cached;
  }

  // 2. Try native Capacitor device ID
  const nativeId = await nativeDeviceId();
  const id = nativeId ?? simpleHash(browserFingerprint());

  // 3. Persist & return
  localStorage.setItem(STORAGE_KEY, id);
  return id;
}

/**
 * Remove the stored device ID, forcing regeneration on next call.
 */
export function clearDeviceId(): void {
  localStorage.removeItem(STORAGE_KEY);
}
