'use client';

import { EarthquakeMap } from '@/components/map/earthquake-map';
import { useEffect, useState } from 'react';
import { Earthquake } from '@/lib/types';
import { getRecentEarthquakes } from '@/lib/api';
import { formatEarthquakeData } from '@/lib/utils/earthquake';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MapPage() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);

  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        const data = await getRecentEarthquakes();
        setEarthquakes(data.features.map(formatEarthquakeData));
      } catch (error) {
        console.error('Error fetching earthquakes:', error);
      }
    };

    fetchEarthquakes();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Earthquake Map</CardTitle>
        </CardHeader>
        <CardContent>
          <EarthquakeMap earthquakes={earthquakes} />
        </CardContent>
      </Card>
    </div>
  );
}