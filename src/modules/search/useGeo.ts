import { useState, useCallback } from 'react';
import { geohashForLocation, geohashQueryBounds, distanceBetween } from 'geofire-common';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  state?: string;
}

export interface UseGeoReturn {
  currentLocation: Location | null;
  loading: boolean;
  error: string | null;
  getCurrentPosition: () => Promise<Location>;
  calculateDistance: (from: Location, to: Location) => number;
  getGeohash: (location: Location) => string;
  getQueryBounds: (center: Location, radiusInKm: number) => string[][];
  reverseGeocode: (location: Location) => Promise<string>;
}

export const useGeo = (): UseGeoReturn => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentPosition = useCallback((): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          try {
            // Try to get address from reverse geocoding
            const address = await reverseGeocode(location);
            location.address = address;
          } catch (err) {
            console.warn('Reverse geocoding failed:', err);
          }

          setCurrentLocation(location);
          setLoading(false);
          resolve(location);
        },
        (err) => {
          const errorMessage = `Geolocation error: ${err.message}`;
          setError(errorMessage);
          setLoading(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }, []);

  const calculateDistance = useCallback((from: Location, to: Location): number => {
    return distanceBetween([from.lat, from.lng], [to.lat, to.lng]);
  }, []);

  const getGeohash = useCallback((location: Location): string => {
    return geohashForLocation([location.lat, location.lng]);
  }, []);

  const getQueryBounds = useCallback((center: Location, radiusInKm: number): string[][] => {
    const bounds = geohashQueryBounds([center.lat, center.lng], radiusInKm * 1000);
    return bounds.map(bound => [bound[0], bound[1]]);
  }, []);

  const reverseGeocode = useCallback(async (location: Location): Promise<string> => {
    // In a real implementation, you'd use a geocoding service like Google Maps
    // For now, we'll return a mock address
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
      }, 500);
    });
  }, []);

  return {
    currentLocation,
    loading,
    error,
    getCurrentPosition,
    calculateDistance,
    getGeohash,
    getQueryBounds,
    reverseGeocode,
  };
};