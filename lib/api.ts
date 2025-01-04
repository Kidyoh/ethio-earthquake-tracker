const USGS_API_BASE = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

export async function getRecentEarthquakes() {
  const params = new URLSearchParams({
    format: 'geojson',
    starttime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    latitude: '9.145',  // Ethiopia center approx
    longitude: '40.489',
    maxradiuskm: '1000',
    minmagnitude: '2.5',
  });

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