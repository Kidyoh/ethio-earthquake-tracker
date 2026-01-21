import { DamageReport } from "./types";

const USGS_API_BASE = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

export async function getRecentEarthquakes(days: number = 30, lat?: number, lng?: number, radiusKm: number = 1000) {
  const startTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const params = new URLSearchParams({
    format: 'geojson',
    starttime: startTime,
    minmagnitude: '2.5',
  });

  // Default to Ethiopia if no location specified
  const searchLat = lat ?? 9.145; // Ethiopia center latitude
  const searchLng = lng ?? 40.489; // Ethiopia center longitude
  const searchRadius = radiusKm ?? 1200; // Slightly larger radius to cover all of Ethiopia

  params.append('latitude', searchLat.toString());
  params.append('longitude', searchLng.toString());
  params.append('maxradiuskm', searchRadius.toString());

  const response = await fetch(`${USGS_API_BASE}?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch earthquake data');
  }

  return response.json();
}

export async function getNearbyServices(lat: number, lng: number, type: string) {
  // This would connect to a backend service that maintains emergency service locations
  // For now, return mock data
  return [];
}

export async function submitDamageReport(report: Omit<DamageReport, 'id' | 'timestamp'>) {
  // This would connect to your backend to store the report
  // For now, just mock the response
  return {
    ...report,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
  };
}

export const getHistoricalEarthquakes = async () => {
  const response = await fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-01-01&endtime=2023-01-01');
  if (!response.ok) {
    throw new Error('Failed to fetch historical earthquakes');
  }
  return response.json();
};