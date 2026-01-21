'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Earthquake } from '@/lib/types';
import { MapContainer, CircleMarker, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { formatDistanceToNow } from 'date-fns';

interface MapComponentProps {
  earthquakes: Earthquake[];
  onMarkerClick?: (earthquake: Earthquake) => void;
  center?: [number, number];
  zoom?: number;
}

export default function MapComponent({ earthquakes, onMarkerClick, center, zoom }: MapComponentProps) {
  const markers = useMemo(() => {
    return earthquakes.map((quake) => {
      const radius = Math.pow(2, quake.magnitude) * 1.5;
      const color = getColorByMagnitude(quake.magnitude);
      
      return (
        <CircleMarker
          key={quake.id}
          center={[quake.location.lat, quake.location.lng]}
          radius={radius}
          pathOptions={{
            color,
            fillColor: color,
            fillOpacity: 0.5,
          }}
          eventHandlers={{
            click: () => onMarkerClick?.(quake),
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">Magnitude {quake.magnitude}</p>
              <p>{quake.location.place}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(quake.time), { addSuffix: true })}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      );
    });
  }, [earthquakes, onMarkerClick]);

  return (
    <MapContainer
      center={center || [9.145, 40.489]} // Center of Ethiopia
      zoom={zoom || 6}
      className="h-full w-full rounded-lg"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers}
    </MapContainer>
  );
}

function getColorByMagnitude(magnitude: number): string {
  if (magnitude >= 7) return '#ef4444';
  if (magnitude >= 5) return '#f97316';
  if (magnitude >= 3) return '#eab308';
  return '#22c55e';
} 