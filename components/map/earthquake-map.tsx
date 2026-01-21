'use client';

import { Earthquake } from '@/lib/types';
import { DynamicMap } from './dynamic-map';

interface EarthquakeMapProps {
  earthquakes: Earthquake[];
  onMarkerClick?: (earthquake: Earthquake) => void;
  center?: [number, number];
  zoom?: number;
}

export function EarthquakeMap({ earthquakes, onMarkerClick, center, zoom }: EarthquakeMapProps) {
  return (
    <div className="h-[600px] w-full rounded-lg border p-4">
      <DynamicMap earthquakes={earthquakes} onMarkerClick={onMarkerClick} center={center} zoom={zoom} />
    </div>
  );
} 