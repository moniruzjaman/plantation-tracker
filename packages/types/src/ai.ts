export interface DiagnosisRequest {
  photoBase64: string;
  symptoms: string[];
  cropType: string;
  cropStage: string;
  location: { division: string; district: string; upazila: string };
}

export interface DiagnosisResponse {
  disease: string;
  confidence: number;
  treatment: string[];
  prevention: string[];
  provider: 'gemini' | 'openrouter' | 'groq' | 'offline';
}

export interface AdvisoryRequest {
  cropType: string;
  location: { lat: number; lng: number };
  weatherData: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
  soilData?: {
    type: string;
    ph: number;
  };
}

export interface AdvisoryResponse {
  recommendations: string[];
  alerts: string[];
  irrigationAdvice: string;
  fertilizerSchedule: string[];
  provider: 'gemini' | 'openrouter' | 'groq' | 'offline';
}

export interface SatelliteSnapshot {
  id: string;
  plantationId: string;
  ndvi: number;
  evi: number;
  ndwi: number;
  capturedAt: string;
  source: 'sentinel-2';
}
