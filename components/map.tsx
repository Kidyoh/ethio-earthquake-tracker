'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapProps {
  earthquakes: any[];
}

export default function Map({ earthquakes }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([9.145, 40.489], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    // Add earthquake markers
    earthquakes.forEach(quake => {
      const { coordinates } = quake.geometry;
      const { mag, place, time } = quake.properties;

      const circle = L.circle([coordinates[1], coordinates[0]], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: Math.pow(2, mag) * 1000
      }).addTo(mapRef.current!);

      circle.bindPopup(`
        <b>Magnitude:</b> ${mag}<br>
        <b>Location:</b> ${place}<br>
        <b>Time:</b> ${new Date(time).toLocaleString()}
      `);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [earthquakes]);

  return <div id="map" className="h-full w-full" />;
}