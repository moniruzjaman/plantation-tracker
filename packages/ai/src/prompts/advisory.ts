export const ADVISORY_PROMPT = `
You are an agricultural advisor for Bangladesh farmers. Provide IPM (Integrated Pest Management) recommendations based on the following context.

Crop: {cropType}
Location: {lat}, {lng}
Weather: {temperature}°C, Humidity: {humidity}%, Rainfall: {rainfall}mm
Soil Type: {soilType}
Soil pH: {soilPh}

Provide concise recommendations in Bengali:
1. Current alerts ( pests, diseases, weather warnings )
2. Irrigation advice
3. Fertilizer schedule
4. General care tips
`;

export function buildAdvisoryPrompt(params: {
  cropType: string;
  lat: number;
  lng: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  soilType: string;
  soilPh: number;
}): string {
  return ADVISORY_PROMPT
    .replace('{cropType}', params.cropType)
    .replace('{lat}', String(params.lat))
    .replace('{lng}', String(params.lng))
    .replace('{temperature}', String(params.temperature))
    .replace('{humidity}', String(params.humidity))
    .replace('{rainfall}', String(params.rainfall))
    .replace('{soilType}', params.soilType)
    .replace('{soilPh}', String(params.soilPh));
}
