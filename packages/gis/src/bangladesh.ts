export const BD_CENTER: [number, number] = [23.6850, 90.3563];
export const BD_ZOOM = 7;

export const isValidBdCoord = (lat: number | null, lng: number | null): boolean => {
  if (lat === null || lng === null) return false;
  if (lat === 0 && lng === 0) return false;
  if (lat < 20 || lat > 27 || lng < 88 || lng > 93) return false;
  return true;
};

export const LAYER_TILES: Record<string, { url: string; attribution: string }> = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri'
  }
};

export function toBnNum(num: number): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bnDigits[parseInt(d)]);
}
