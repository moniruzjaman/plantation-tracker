/**
 * Simple NDVI-to-carbon conversion for the GrowthTracker carbon history feature.
 * This is a lightweight placeholder that maps NDVI to an estimated carbon stock.
 * It does NOT replace the full VM0047 calculator in the app repo.
 */

export function estimateCarbonFromNdvi(ndvi: number | null, areaHectares = 1): number {
  if (ndvi == null || ndvi <= 0) return 0;
  const biomassPerHectare = ndvi * 120;
  const carbonTons = (biomassPerHectare * areaHectares * 0.47) / 1000;
  return Math.max(0, carbonTons);
}
