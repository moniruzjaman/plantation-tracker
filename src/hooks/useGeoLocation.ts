import { useState, useCallback } from 'react';
import { reverseGeocode, autoSelectAdminFromGeo } from '../services/geocoding';

interface AdminMatch {
  region?: string;
  district?: string;
  upazila?: string;
}

export interface GeoLocationState {
  latitude: number | null;
  longitude: number | null;
  geoString: string;
  address: string;
  adminMatch: AdminMatch;
  loading: boolean;
  error: string | null;
  fetchGPS: () => Promise<void>;
  setAddress: (address: string) => void;
}

export function useGeoLocation(): GeoLocationState {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [geoString, setGeoString] = useState('');
  const [address, setAddress] = useState('');
  const [adminMatch, setAdminMatch] = useState<AdminMatch>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGPS = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check browser support
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser.');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10_000,
          maximumAge: 300_000,
        });
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setLatitude(lat);
      setLongitude(lng);
      setGeoString(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);

      // Reverse geocode to get a human-readable address
      const addrResult = await reverseGeocode(lat, lng);
      setAddress(addrResult?.display_name ?? '');

      // Auto-select admin hierarchy from geocoded address
      if (addrResult?.address) {
        const admin = autoSelectAdminFromGeo(addrResult.address);
        setAdminMatch({
          region: admin.region ?? undefined,
          district: admin.district ?? undefined,
          upazila: admin.upazila ?? undefined,
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof GeolocationPositionError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to get location.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    latitude,
    longitude,
    geoString,
    address,
    adminMatch,
    loading,
    error,
    fetchGPS,
    setAddress,
  };
}
