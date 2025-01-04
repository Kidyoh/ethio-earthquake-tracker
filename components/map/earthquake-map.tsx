'use client';

import { Earthquake } from '@/lib/types';
import { DynamicMap } from './dynamic-map';

interface EarthquakeMapProps {
  earthquakes: Earthquake[];
  onMarkerClick?: (earthquake: Earthquake) => void;
}

export function EarthquakeMap({ earthquakes, onMarkerClick }: EarthquakeMapProps) {
  return (
    <div className="h-[600px] w-full rounded-lg border p-4">
      <DynamicMap earthquakes={earthquakes} onMarkerClick={onMarkerClick} />
    </div>
  );
} 