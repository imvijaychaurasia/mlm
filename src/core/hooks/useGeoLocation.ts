import { useState, useCallback } from 'react';
import { geohashForLocation, geohashQueryBounds } from 'geofire-common';

export interface GeoLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface GeoBounds {
  center: string;
  bounds: string[][];
}

export const useGeoLocation = () => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback((): Promise<GeoLocation> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = 'Geolocation is not supported by this browser';
        setError(error);
        reject(new Error(error));
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: GeoLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setLocation(loc);
          setLoading(false);
          resolve(loc);
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

  const getGeohash = useCallback((loc: GeoLocation): string => {
    return geohashForLocation([loc.lat, loc.lng]);
  }, []);

  const getQueryBounds = useCallback((loc: GeoLocation, radiusInKm: number): GeoBounds => {
    const center = geohashForLocation([loc.lat, loc.lng]);
    const bounds = geohashQueryBounds([loc.lat, loc.lng], radiusInKm * 1000);
    return {
      center,
      bounds: bounds.map(bound => [bound[0], bound[1]]),
    };
  }, []);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    getGeohash,
    getQueryBounds,
  };
};