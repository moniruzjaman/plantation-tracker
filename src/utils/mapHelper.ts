/**
 * Shared GIS / map layer configuration for the native MapTab.
 * Adapted from plantation-tracker-app's src/utils/mapHelper.ts, with a
 * Bangladesh bounding-box validator added — the same fix applied to
 * legacy-nursery.html's map (PR #26) to stop a single bad/placeholder GPS
 * coordinate (e.g. null-island 0,0) from forcing fitBounds() to zoom out
 * to a "world map" view.
 */

// ---------- Tile layer definitions ----------

export type LayerId = 'osm' | 'satellite' | 'ndvi' | 'evi';

/** Returns the NASA GIBS date string for tile URLs (current date minus 6 days, composites lag). */
export function gibsDate(): string {
  return new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString().split('T')[0];
}

/** Bangladesh-wide default view — consistent with the fix applied to legacy-nursery.html. */
export const BD_CENTER: [number, number] = [23.8103, 90.4125];
export const BD_ZOOM = 7;

/** NDVI legend bands for the overlay panel. */
export const NDVI_BANDS = [
  { label: 'নগ্ন ভূমি', color: '#c2410c', range: '< 0.1' },
  { label: 'বিরল', color: '#eab308', range: '0.1 – 0.3' },
  { label: 'মধ্যম', color: '#84cc16', range: '0.3 – 0.5' },
  { label: 'ঘন সবুজ', color: '#16a34a', range: '0.5 – 0.7' },
  { label: 'অতি ঘন', color: '#14532d', range: '> 0.7' },
];

/**
 * Returns tile config for a given layer. NDVI/EVI URLs are date-dependent
 * (NASA GIBS lags a few days), so they use gibsDate() by default.
 */
export function getLayerTiles(id: LayerId, date?: string): { url: string; attribution: string; maxZoom?: number } {
  const d = date || gibsDate();
  switch (id) {
    case 'ndvi':
      return {
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/${d}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`,
        attribution: 'NASA GIBS — MODIS Terra NDVI (8-Day)',
        maxZoom: 9,
      };
    case 'evi':
      return {
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_EVI_8Day/default/${d}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`,
        attribution: 'NASA GIBS — MODIS Terra EVI (8-Day)',
        maxZoom: 9,
      };
    case 'satellite':
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles © Esri',
        maxZoom: 19,
      };
    case 'osm':
      return {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      };
  }
}

// ---------- Bangladesh coordinate sanity check ----------

const BD_BOUNDS = { minLat: 20.0, maxLat: 27.5, minLng: 87.5, maxLng: 93.5 };

/**
 * Rejects clearly bad/placeholder GPS coordinates (null-island 0,0, a GPS
 * glitch, an out-of-country typo) before they can reach fitBounds() and
 * drag the whole map view out to a "world" zoom level.
 */
export function isValidBdCoord(lat: number, lng: number): boolean {
  if (Number.isNaN(lat) || Number.isNaN(lng)) return false;
  if (lat === 0 && lng === 0) return false;
  return lat >= BD_BOUNDS.minLat && lat <= BD_BOUNDS.maxLat && lng >= BD_BOUNDS.minLng && lng <= BD_BOUNDS.maxLng;
}

// ---------- Bengali number helper ----------

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/** Converts a number to Bengali numeral string. */
export function toBnNum(num: number): string {
  return num.toString().replace(/\d/g, (d) => BN_DIGITS[parseInt(d, 10)]);
}
