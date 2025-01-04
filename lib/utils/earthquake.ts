import { Earthquake } from '../types';

export function formatEarthquakeData(feature: any): Earthquake {
  return {
    id: feature.id,
    magnitude: feature.properties.mag,
    location: {
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
      place: feature.properties.place,
    },
    time: new Date(feature.properties.time).toISOString(),
    depth: feature.geometry.coordinates[2],
    tsunami: feature.properties.tsunami,
  };
}

export function calculateAverageMagnitude(earthquakes: any[]): number {
  if (earthquakes.length === 0) return 0;
  const sum = earthquakes.reduce((acc, quake) => acc + quake.properties.mag, 0);
  return sum / earthquakes.length;
}

export function findHighestMagnitude(earthquakes: any[]): number {
  if (earthquakes.length === 0) return 0;
  return Math.max(...earthquakes.map(quake => quake.properties.mag));
} 